export function calculateScore(reactionTime){
    return Math.max(0,1000 - reactionTime);
}