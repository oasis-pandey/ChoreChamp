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

    req.user.groupIDs.push(group._id);
    await req.user.save();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again!" });
  }
});

export default router;
