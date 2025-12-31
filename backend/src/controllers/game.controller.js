import { v4 as uuid } from "uuid";
import GameSession from "../models/GameSession.js";
import Score from "../models/Score.js";
import User from "../models/User.js";
import { calculateScore } from "../services/gameEngine.js";
import { validateReaction } from "../services/antiCheat.js";
import { signScore } from "../services/scoreSigner.js";

export async function startGame(req,res){
    const {wallet} = req.body;
    const delay = Math.floor(Math.random() * 3000)+2000;
    const roundId = uuid();

    await GameSession.create({
        wallet,
        roundId,
        delayMs: delay,
        startedAt: new Date(),
        status: "STARTED"
    });

    res.json({roundId,delay});
}

export async function submitScore(req,res){
    const {wallet,roundId,reactionTime} = req.body;
    const session = await GameSession.findOne({roundId,wallet});
    if(!session) return res.status(400).json({error: "Invalid Session"});
    if(!validateReaction(reactionTime))
        return res.status(400).json({error:"Cheeat Detected"});
    const score = calculateScore(reactionTime);
    const message = `${wallet}:${roundId}:${score}`;
    const signature = signScore(message);

    await Score.create({
        wallet,
        roundId,
        reactionTime,
        score,
        verified:true,
        signature
    });

    await User.findOneAndUpdate(
        {wallet},
        {
            $inc:{totalGames:1},
            $max:{bestScore:score},
            lastPlayedAt:new Date()
        },
        { upsert:true}
    );

    res.json({score,signature});
    
}