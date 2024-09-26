import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const main = async () => {
    const blockhash = await connection.getLatestBlockhash();
    console.log(blockhash.lastValidBlockHeight);

    const space = 1500;
    const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);
    console.log(`Minimum balance need: ${rentExemptionAmount / LAMPORTS_PER_SOL} SOL`);

}

main();
