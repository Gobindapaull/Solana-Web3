import { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const wallet = new PublicKey("CcwxvBSbqtahqUdc5wU1xUMUxg1CtSdmpzePBXjmS2hP");
    const balance = await connection.getBalance(wallet) / LAMPORTS_PER_SOL;
    console.log(balance);
}
main();
