const { PublicKey } = require("@solana/web3.js");

const programId = new PublicKey("9yQeWvG816bUx9EP1bZXy1GhEBRYuBD5kW5yQ2p2u1qA");

const seed1 = Buffer.from("seed123");
const seed2 = Buffer.from([1, 2, 3]);

const [pda, bump] = PublicKey.findProgramAddressSync([seed1, seed2], programId);

console.log("PDA: ", pda.toBase58());
console.log("Bump: ", bump);
