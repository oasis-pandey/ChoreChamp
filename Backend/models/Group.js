import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true,'Please add a group name'],
        trim:true
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    chores : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chore"
    }],
    inviteCode : {
        type : String,
        unique: true,
        required: true
    }
},{
    timestamps : true
})

const Group = mongoose.model('Group', groupSchema)
export default Group;