const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
require("dotenv").config();

const main = async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

    const mintAddress = process.env.MINT_ADDRESS; // MasterBOT
    const mintPubkey = new PublicKey(mintAddress);

    const info = await connection.getParsedAccountInfo(mintPubkey);

    if (info.value === null) {
        console.log('❌ Invalid mint: Account does not exist on-chain');
    } else {
        console.log('✅ Account found');
        console.log(JSON.stringify(info.value.data, null, 2));

        if (info.value.data.parsed.type === "mint") {
            console.log('✅ This is a valid SPL token mint');
        } else {
            console.log('⚠️ This account exists but is not a token mint');
        }
    }
}

main();
