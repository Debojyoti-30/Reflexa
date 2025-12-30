import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
    wallet:String,
    roundId:String,
    delayMs:Number,
    startedAt:Date,
    status: {type:String,default:"STARTED"}    
});

export default mongoose.model("GameSession",gameSessionSchema);