import {
    Connection,
    PublicKey
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Fetch top validator vote account (by stake weight)
const voteAccounts = await connection.getVoteAccounts();
const topValidator = voteAccounts.current.sort(
    (a, b) => b.activatedStake - a.activatedStake
)[0]; // highest stake validator
const validatorVotePubkey = new PublicKey(topValidator.votePubkey);

console.log("🏆 Top Validator:", validatorVotePubkey.toBase58());
// 🏆 Top Validator: vgcDar2pryHvMgPkKaZfh8pQy4BJxv7SpwUG7zinWjG
