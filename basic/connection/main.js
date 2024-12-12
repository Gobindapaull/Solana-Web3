const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, Transaction, SystemProgram, PublicKey } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("mainnet-beta"));

const main = async () => {
    // Mainnet endpoint url
    const endpoint = await connection.rpcEndpoint;
    console.log(endpoint);

    // Total supply of SOL
    const totalSupply = await connection.getSupply();
    console.log(totalSupply.value.total / LAMPORTS_PER_SOL);

}

main()
