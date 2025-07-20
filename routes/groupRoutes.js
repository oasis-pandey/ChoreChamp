import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";
import generateCode from "../utils/generateCode.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", protect, async (req, res) => {
  const { name } = req.body;
  const code = generateCode();
  const group = await Group.create({
    name,
    members: [req.user._id],
    chores: [],
    inviteCode: code,
  });

  req.user.groupId = group._id;
  await req.user.save();
  res.status(201).json({
    message: "Group created successfully",
    group: {
      name: group.name,
      inviteCode: group.inviteCode,
      _id: group._id,
    },
  });
});

export default router;
