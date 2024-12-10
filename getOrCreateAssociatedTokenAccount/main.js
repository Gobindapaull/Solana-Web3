// mint address: GyKwjx397ZMxjRNHTQbTGtX6hzA9AzJtmLjUH2nxQMpZ

const { getOrCreateAssociatedTokenAccount } = require("@solana/spl-token");
const { Connection, Keypair, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const fs = require("fs");

const connnection = new Connection(clusterApiUrl("devnet"));
const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/block107/.config/solana/id.json"))));
const mintAddress = new PublicKey("GyKwjx397ZMxjRNHTQbTGtX6hzA9AzJtmLjUH2nxQMpZ");

const associatedTokenAccountFunction = async () => {
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
        connnection,
        payerKeypair,
        mintAddress,
        payerKeypair.publicKey
    );
    console.log(`associated token account : ${associatedTokenAccount.address.toBase58()}`);
    // 3xJYqCr3WYrajEvZNjwm2DuBJuVpyBXfdXHDwqYYVgnt
}

associatedTokenAccountFunction();
