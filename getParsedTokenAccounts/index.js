const { Connection, PublicKey } = require('@solana/web3.js');

const connection = new Connection("https://api.mainnet-beta.solana.com");

const walletAddress = new PublicKey("CcwxvBSbqtahqUdc5wU1xUMUxg1CtSdmpzePBXjmS2hP");
const programId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

async function getParsedTokenAccounts() {
    try {
        const accounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
            programId
        });

        console.log("Token accounts found:", accounts.value.length);

        for (const { pubkey, account } of accounts.value) {
            const info = account.data.parsed.info;
            console.table({
                tokenAccount: pubkey.toBase58(),
                mint: info.mint,
                amount: info.tokenAmount.uiAmountString
            });
        }
    } catch (err) {
        console.error("Failed to fetch parsed token accounts:", err);
    }
}

getParsedTokenAccounts();
