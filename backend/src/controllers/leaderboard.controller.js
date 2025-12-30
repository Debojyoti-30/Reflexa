import Score from "../models/Score.js";

export async function getLeaderboard(req,res){
    const top = await Score.find({ verified:true})
        .sort({score:-1})
        .limit(10);
    res.json(top);
}