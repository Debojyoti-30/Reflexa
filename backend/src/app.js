import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

const app = express();

//middleware 
app.use(cors());
app.use(express.json());

app.use("/game",gameRoutes);
app.use("/leaderboard",leaderboardRoutes);

app.get('/',(req,res)=>{
    res.send("Backend is running on port 4000");
});

export default app;