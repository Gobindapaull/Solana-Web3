const { Connection, PublicKey } = require("@solana/web3.js");
const connection = new Connection(
    "https://api.mainnet-beta.solana.com",
    "confirmed"
);

const mint = new PublicKey("9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump");

const main = async () => {
    const accountInfo = await connection.getParsedAccountInfo(mint);
    console.log(accountInfo.value.data);
    console.log(`==============================================`)
    const extensions = accountInfo.value.data.parsed.info.extensions;
    console.log(extensions)
    console.log(`==============================================`)
}

main();
