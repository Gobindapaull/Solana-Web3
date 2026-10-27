const {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js");

const RPC_URL = clusterApiUrl("mainnet-beta");

// Replace with your Solana wallet address
const WALLET_ADDRESS = "FfW5e8gKJfgaZPog6DiJoW6Kif6Fb23CokWprRhHVjV1";

const connection = new Connection(RPC_URL, "confirmed");

async function getWalletBalances() {
    try {
        const wallet = new PublicKey(WALLET_ADDRESS);

        console.log("==================================");
        console.log("Solana Wallet Balance");
        console.log("==================================");
        console.log("Wallet:", WALLET_ADDRESS);

        // 1. Get native SOL balance
        const lamports = await connection.getBalance(wallet);
        const solBalance =
            Number(lamports) / Number(LAMPORTS_PER_SOL);

        console.log("\nNative SOL:", solBalance, "SOL");

        // 2. Get all SPL token accounts owned by the wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            wallet,
            {
                programId: new PublicKey(
                    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                )
            }
        );

        console.log("\nSPL Token Balances:");

        if (tokenAccounts.value.length === 0) {
            console.log("No SPL token accounts found.");
        } else {
            for (const account of tokenAccounts.value) {
                const info = account.account.data.parsed.info;
                const mintAddress = info.mint;
                const tokenAmount = info.tokenAmount;

                // Skip empty token accounts
                if (tokenAmount.amount === "0") {
                    continue;
                }

                console.log("----------------------------------");
                console.log("Mint:", mintAddress);
                console.log("Amount:", tokenAmount.uiAmountString);
                console.log("Decimals:", tokenAmount.decimals);
            }
        }

        // 3. Get Token-2022 balances too
        const token2022Accounts =
            await connection.getParsedTokenAccountsByOwner(
                wallet,
                {
                    programId: new PublicKey(
                        "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
                    )
                }
            );

        console.log("\nToken-2022 Balances:");

        if (token2022Accounts.value.length === 0) {
            console.log("No Token-2022 accounts found.");
        } else {
            for (const account of token2022Accounts.value) {
                const info = account.account.data.parsed.info;
                const tokenAmount = info.tokenAmount;

                if (tokenAmount.amount === "0") {
                    continue;
                }

                console.log("----------------------------------");
                console.log("Mint:", info.mint);
                console.log("Amount:", tokenAmount.uiAmountString);
                console.log("Decimals:", tokenAmount.decimals);
            }
        }

        console.log("\n==================================");
        console.log("Balance check completed.");
        console.log("==================================");

    } catch (error) {
        console.error("Error:", error.message);
    }
}

getWalletBalances();
