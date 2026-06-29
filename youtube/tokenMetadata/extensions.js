const { Connection, PublicKey } = require("@solana/web3.js");
const connection = new Connection("http://api.mainnet-beta.solana.com", "confirmed");

const mint = new PublicKey("5RNsaRw3vDsZ9T1cHgNfGWGcK84GoAYRJcpW5Jpjpump");

const main = async () => {
    const accountInfo = await connection.getParsedAccountInfo(mint);
    const data = accountInfo.value.data;
    console.log(data);
    console.log(`===================================================`)

    const extensions = data.parsed.info.extensions;
    console.log(extensions);
    console.log(`====================================================`)
}

main();
