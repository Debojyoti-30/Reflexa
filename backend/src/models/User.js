import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    wallet: {type:String, unique: true},
    totalGames: {type:Number,default:0},
    bestScore:{type:Number,default:0},
    lastPlayedAt:{type:Date,default:Date.now}
});

export default mongoose.model("User",userSchema);