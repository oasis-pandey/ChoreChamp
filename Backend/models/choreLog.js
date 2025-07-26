import mongoose from "mongoose";

const choreLogSchema = new mongoose.Schema(
    {
        choreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chore",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
        verified: {
            type: Boolean,
            default: false, // Optional: can be used later
        },
        note: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const ChoreLog = mongoose.model("ChoreLog", choreLogSchema);

export default ChoreLog;
