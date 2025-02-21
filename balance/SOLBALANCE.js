const { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const main = async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const balance = await connection.getAccountInfo(new PublicKey("CcwxvBSbqtahqUdc5wU1xUMUxg1CtSdmpzePBXjmS2hP"));
    console.log(`${balance.lamports / LAMPORTS_PER_SOL} SOL`);
}

main();
