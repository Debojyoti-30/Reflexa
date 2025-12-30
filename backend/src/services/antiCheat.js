export function validateReaction(reactionTime){
    if(reactionTime < 120 ) return false; //bot-fast
    if(reactionTime > 2000 ) return false; //bot-slow
    return true;
}