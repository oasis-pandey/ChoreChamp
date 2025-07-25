import mongoose from "mongoose";

const choreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Chore name is required"],
  },
  description: {
    type: String,
    default: "",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  lastCompleted: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
}, {
  timestamps: true,
});

const Chore = mongoose.model("Chore", choreSchema);
export default Chore;
