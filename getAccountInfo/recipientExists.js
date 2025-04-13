const { Connection, PublicKey } = require("@solana/web3.js");
const bs58 = require("bs58");

const recipient = new PublicKey("2rEawiYnokG1r94tFVSztTxZDqWzDQGgLv26EBMEanqn");

const main = async () => {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const recipientInfo = await connection.getAccountInfo(recipient);
    console.log("Recipient exists : ", !!recipientInfo);
    
}

main();
