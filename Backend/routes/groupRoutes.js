import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";
import generateCode from "../utils/generateCode.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, async (req, res) => {
    try {
        const { name } = req.body;
        const code = generateCode();
        const group = await Group.create({
            name,
            members: [req.user._id],
            chores: [],
            inviteCode: code,
        });

        req.user.groupIds.push(group._id);
        await req.user.save();
        res.status(201).json({
            message: "Group created successfully",
            group: {
                name: group.name,
                inviteCode: group.inviteCode,
                _id: group._id,
            },
        });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Could not create group. Please try again!" });
    }
});

router.post("/join", protect, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const group = await Group.findOne({ inviteCode });
        if (!group) {
            return res.status(404).json({ message: "Group not found!" });
        }
        // Check if user is already in the group
        const alreadyInGroup = group.members.includes(req.user._id);
        if (alreadyInGroup) {
            return res.status(400).json({ message: "You are already in this group" });
        }
        group.members.push(req.user._id)
        await group.save()

        req.user.groupIds.push(group._id);
        await req.user.save();

        res.status(200).json({
            message: "Successfully joined group!",
            group: {
                name: group.name,
                _id: group._id
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong, try again!" });
    }
});

// GET /api/groups/my-groups - Get user's groups
router.get("/my-groups", protect, async (req, res) => {
    try {
        const userGroupIds = req.user.groupIds || [];
        const groups = await Group.find({
            _id: { $in: userGroupIds }
        }).populate('members', 'username email');

        res.status(200).json({
            groups: groups.map(group => ({
                _id: group._id,
                name: group.name,
                inviteCode: group.inviteCode,
                memberCount: group.members.length,
                members: group.members
            }))
        });
    } catch (error) {
        console.error("Error fetching user groups:", error);
        res.status(500).json({ message: "Failed to load groups" });
    }
});

// POST /api/groups/:groupId/leave - Leave a group
router.post("/:groupId/leave", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if user is in the group
        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: "You are not a member of this group" });
        }

        // Remove user from group members
        group.members = group.members.filter(memberId => !memberId.equals(userId));
        await group.save();

        // Remove group from user's groupIds
        req.user.groupIds = req.user.groupIds.filter(id => !id.equals(groupId));
        await req.user.save();

        // If group is empty, optionally delete it (uncomment if you want this behavior)
        // if (group.members.length === 0) {
        //     await Group.findByIdAndDelete(groupId);
        // }

        res.status(200).json({
            message: "Successfully left the group",
            groupId: groupId
        });
    } catch (error) {
        console.error("Error leaving group:", error);
        res.status(500).json({ message: "Failed to leave group. Please try again." });
    }
});

// GET /api/groups/:groupId - Get specific group details
router.get("/:groupId", protect, async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        console.log('Getting group details for groupId:', groupId, 'userId:', userId);

        // Find the group and populate members
        const group = await Group.findById(groupId).populate('members', 'username email points');

        if (!group) {
            console.log('Group not found for groupId:', groupId);
            return res.status(404).json({ message: "Group not found" });
        }

        console.log('Found group:', group.name, 'members:', group.members.length);

        // Check if user is a member of this group
        if (!group.members.some(member => member._id.equals(userId))) {
            console.log('User not authorized for group:', groupId);
            return res.status(403).json({ message: "You are not a member of this group" });
        }

        console.log('Sending group details successfully');
        res.status(200).json({
            group: {
                _id: group._id,
                name: group.name,
                inviteCode: group.inviteCode,
                members: group.members
            }
        });
    } catch (error) {
        console.error("Error fetching group details:", error);
        res.status(500).json({ message: "Failed to load group details" });
    }
});

export default router;
