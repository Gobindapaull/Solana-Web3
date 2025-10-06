
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const airdrop = async () => {
    const payer = Keypair.generate();
    console.log(`payer: ${payer.publicKey}`);
    console.log(payer.secretKey);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const airdropSignature = await connection.requestAirdrop(payer.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction({ signature: airdropSignature, ...(await connection.getLatestBlockhash())});
    console.log(`Aidrop successful`);
}

airdrop();
