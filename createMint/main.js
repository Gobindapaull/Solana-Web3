const { Connection, Keypair, clusterApiUrl } = require("@solana/web3.js");
const { createMint } = require("@solana/spl-token");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"));
const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/block107/.config/solana/id.json"))));

const createMintFunction = async () => {
    const tokenAddress = await createMint(
        connection,
        payerKeypair,
        payerKeypair.publicKey,
        payerKeypair.publicKey,
        9
    );
    console.log(`Your token mint address : ${tokenAddress.toBase58()}`);
}

createMintFunction();
