import crypto from "crypto";

const PRIVATE_KEY = process.env.SIGNING_SECRET;
console.log("SIGNING_SECRET loaded:", !!PRIVATE_KEY);

export function signScore(message){
    return crypto
        .createHmac("sha256",PRIVATE_KEY)
        .update(message)
        .digest("hex");
}