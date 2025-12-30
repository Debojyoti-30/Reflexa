import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    wallet:String,
    roundId:String,
    reactionTime:Number,
    score:Number,
    verified:Boolean,
    signature:String,
    createdAt:{type:Date,default:Date.now}
});

export default mongoose.model("Score",scoreSchema);