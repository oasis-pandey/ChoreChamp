import express from "express";
import Chore from "../models/Chore.js";
import ChoreLog from "../models/choreLog.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/chores/dashboard - Get user's dashboard data
router.get("/dashboard", protect, async (req, res) => {
    try {
        // Get user's groups
        const userGroupIds = req.user.groupIds || [];

        // Get assigned chores for the current user
        const assignedChores = await Chore.find({
            assignedTo: req.user._id,
            status: "pending"
        }).populate('groupId', 'name').populate('createdBy', 'username');

        // Get all pending chores in user's groups (including unassigned ones)
        const allGroupChores = await Chore.find({
            groupId: { $in: userGroupIds },
            status: "pending"
        }).populate('groupId', 'name').populate('assignedTo', 'username').populate('createdBy', 'username');

        // Get recently completed chores by the user
        const completedChores = await Chore.find({
            assignedTo: req.user._id,
            status: "completed"
        }).populate('groupId', 'name').populate('createdBy', 'username').limit(10).sort({ lastCompleted: -1 });

        // Get all completed chores in user's groups
        const allCompletedChores = await Chore.find({
            groupId: { $in: userGroupIds },
            status: "completed"
        }).populate('groupId', 'name').populate('assignedTo', 'username').populate('createdBy', 'username').limit(20).sort({ lastCompleted: -1 });

        res.status(200).json({
            assigned: assignedChores,
            completed: completedChores,
            allGroupChores: allGroupChores,
            allCompletedChores: allCompletedChores,
        });
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        res.status(500).json({ message: "Failed to load dashboard" });
    }
});

// POST /api/chores/create - Create a new chore
router.post("/create", protect, async (req, res) => {
    try {
        const { name, description, frequency, assignedTo, groupId } = req.body;

        // If no groupId provided, use the first group the user belongs to
        let finalGroupId = groupId;
        if (!finalGroupId && req.user.groupIds && req.user.groupIds.length > 0) {
            finalGroupId = req.user.groupIds[0];
        }

        // If still no groupId, return an error
        if (!finalGroupId) {
            return res.status(400).json({
                message: "You must belong to a group to create chores. Please create or join a group first."
            });
        }

        const chore = await Chore.create({
            name,
            description: description || "",
            frequency,
            assignedTo: assignedTo || null,
            groupId: finalGroupId,
            createdBy: req.user._id,
        });

        res.status(201).json({
            message: "Chore created successfully",
            chore,
        });
    } catch (error) {
        console.error("Error creating chore:", error);
        res.status(500).json({
            message: "Failed to create chore",
            error: error.message
        });
    }
});

// POST /api/chores/:choreId/complete - Mark a chore as complete
router.post("/:choreId/complete", protect, async (req, res) => {
    try {
        console.log("=== CHORE COMPLETION REQUEST ===");
        console.log("User ID:", req.user?._id);
        console.log("User:", req.user?.name, req.user?.email);
        console.log("Chore ID:", req.params.choreId);
        console.log("Note:", req.body.note);

        const { choreId } = req.params;
        const { note } = req.body;

        const chore = await Chore.findById(choreId);
        if (!chore) {
            console.log("ERROR: Chore not found");
            return res.status(404).json({ message: "Chore not found" });
        }

        console.log("Found chore:", {
            id: chore._id,
            title: chore.title,
            assignedTo: chore.assignedTo,
            groupId: chore.groupId,
            status: chore.status
        });

        // Check if user is assigned to this chore or is in the same group
        if (chore.assignedTo && chore.assignedTo.toString() !== req.user._id.toString()) {
            console.log("ERROR: Not authorized - assignedTo:", chore.assignedTo.toString(), "userId:", req.user._id.toString());
            return res.status(403).json({ message: "Not authorized to complete this chore" });
        }

        // Update chore status
        chore.status = "completed";
        chore.lastCompleted = new Date();
        chore.assignedTo = req.user._id; // Assign to completing user if it was unassigned
        if (note) {
            chore.completionNote = note;
        }

        console.log("Saving chore with status:", chore.status);
        await chore.save();

        // Create a chore log entry
        console.log("Creating chore log...");
        await ChoreLog.create({
            choreId: chore._id,
            userId: req.user._id,
            completedAt: new Date(),
            note: note || "",
        });

        // Award points to user (optional - you can adjust the point system)
        console.log("Updating user points...");
        req.user.points = (req.user.points || 0) + 10;
        await req.user.save();

        console.log("SUCCESS: Chore completed successfully!");
        res.status(200).json({
            message: "Chore completed successfully!",
            chore,
            pointsAwarded: 10,
        });
    } catch (error) {
        console.error("=== CHORE COMPLETION ERROR ===");
        console.error("Error details:", error);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ message: "Failed to complete chore", error: error.message });
    }
});

// GET /api/chores/group/:groupId - Get all chores for a specific group
router.get("/group/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        // Check if user is a member of this group
        const userGroupIds = req.user.groupIds || [];
        if (!userGroupIds.some(id => id.equals(groupId))) {
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        // Get all chores for this group
        const chores = await Chore.find({
            groupId: groupId
        }).populate('assignedTo', 'username').populate('createdBy', 'username').sort({ createdAt: -1 });

        res.status(200).json({
            chores: chores
        });
    } catch (error) {
        console.error("Error fetching group chores:", error);
        res.status(500).json({ message: "Failed to load group chores" });
    }
});

// DELETE /api/chores/:choreId/remove - Remove a completed chore from logs
router.delete("/:choreId/remove", protect, async (req, res) => {
    try {
        const { choreId } = req.params;
        const userId = req.user._id;

        // Find the chore
        const chore = await Chore.findById(choreId);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }

        // Check if chore is completed
        if (chore.status !== "completed") {
            return res.status(400).json({ message: "Can only remove completed chores" });
        }

        // Check if user has permission (either assigned to them or in same group)
        const userGroupIds = req.user.groupIds || [];
        const hasPermission =
            (chore.assignedTo && chore.assignedTo.equals(userId)) ||
            userGroupIds.some(groupId => groupId.equals(chore.groupId));

        if (!hasPermission) {
            return res.status(403).json({ message: "Not authorized to remove this chore" });
        }

        // Delete the chore completely
        await Chore.findByIdAndDelete(choreId);

        // Also remove associated chore logs
        await ChoreLog.deleteMany({ choreId: choreId });

        res.status(200).json({
            message: "Chore removed successfully",
            choreId: choreId
        });
    } catch (error) {
        console.error("Error removing chore:", error);
        res.status(500).json({ message: "Failed to remove chore" });
    }
});

// DELETE /api/chores/:choreId/delete - Delete a pending chore (before completion)
router.delete("/:choreId/delete", protect, async (req, res) => {
    try {
        const { choreId } = req.params;
        const userId = req.user._id;

        // Find the chore
        const chore = await Chore.findById(choreId);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }

        // Check if chore is pending (can't delete completed chores, use remove for that)
        if (chore.status === "completed") {
            return res.status(400).json({ message: "Cannot delete completed chores. Use remove instead." });
        }

        // Check if user has permission to delete this chore
        // Allow: creator, assigned person, or group members
        const userGroupIds = req.user.groupIds || [];
        const isCreator = chore.createdBy && chore.createdBy.equals(userId);
        const isAssigned = chore.assignedTo && chore.assignedTo.equals(userId);
        const isInSameGroup = userGroupIds.some(groupId => groupId.equals(chore.groupId));

        if (!isCreator && !isAssigned && !isInSameGroup) {
            return res.status(403).json({ message: "Not authorized to delete this chore" });
        }

        // Delete the chore completely
        await Chore.findByIdAndDelete(choreId);

        // Also remove any associated chore logs (if any exist)
        await ChoreLog.deleteMany({ choreId: choreId });

        res.status(200).json({
            message: "Chore deleted successfully",
            choreId: choreId,
            deletedBy: req.user.username || req.user.email
        });
    } catch (error) {
        console.error("Error deleting chore:", error);
        res.status(500).json({ message: "Failed to delete chore" });
    }
});

export default router;