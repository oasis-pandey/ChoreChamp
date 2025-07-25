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
        }).populate('groupId', 'name');

        // Get all pending chores in user's groups (including unassigned ones)
        const allGroupChores = await Chore.find({
            groupId: { $in: userGroupIds },
            status: "pending"
        }).populate('groupId', 'name').populate('assignedTo', 'username');

        // Get recently completed chores by the user
        const completedChores = await Chore.find({
            assignedTo: req.user._id,
            status: "completed"
        }).populate('groupId', 'name').limit(10).sort({ lastCompleted: -1 });

        // Get all completed chores in user's groups
        const allCompletedChores = await Chore.find({
            groupId: { $in: userGroupIds },
            status: "completed"
        }).populate('groupId', 'name').populate('assignedTo', 'username').limit(20).sort({ lastCompleted: -1 });

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
        const { choreId } = req.params;

        const chore = await Chore.findById(choreId);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }

        // Check if user is assigned to this chore or is in the same group
        if (chore.assignedTo && chore.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to complete this chore" });
        }

        // Update chore status
        chore.status = "completed";
        chore.lastCompleted = new Date();
        await chore.save();

        // Create a chore log entry
        await ChoreLog.create({
            choreId: chore._id,
            userId: req.user._id,
            completedAt: new Date(),
        });

        // Award points to user (optional - you can adjust the point system)
        req.user.points = (req.user.points || 0) + 10;
        await req.user.save();

        res.status(200).json({
            message: "Chore completed successfully!",
            chore,
            pointsAwarded: 10,
        });
    } catch (error) {
        console.error("Error completing chore:", error);
        res.status(500).json({ message: "Failed to complete chore" });
    }
});

// GET /api/chores/group/:groupId - Get all chores for a specific group
router.get("/group/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;

        const chores = await Chore.find({ groupId })
            .populate('assignedTo', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json({ chores });
    } catch (error) {
        console.error("Error fetching group chores:", error);
        res.status(500).json({ message: "Failed to load group chores" });
    }
});

export default router;
