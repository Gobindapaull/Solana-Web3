import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = "https://mainnet.helius-rpc.com/?api-key="; // Replace with a private RPC if needed
const connection = new Connection(RPC_URL, "confirmed");

// Replace with your target token's Mint Address
const TOKEN_MINT = "HjzW3cWKctHxiVow1aco4zcDcyVhW85BS8VpjKY6pump";

// Replace with the token's Program ID (Usually Token Program ID)
const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Set how often to check for new transactions (in milliseconds)
const POLL_INTERVAL = 3000; // Every 5 seconds

// Store processed transactions to avoid duplicates
let lastSignature = null;

async function fetchNewBuys() {
    try {
        const signatures = await connection.getSignaturesForAddress(
            new PublicKey(TOKEN_MINT),
            { before: lastSignature, limit: 10 }
        );

        if (signatures.length === 0) return;

        for (const sig of signatures.reverse()) {
            const txn = await connection.getParsedTransaction(sig.signature, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });

            if (!txn || !txn.meta) continue;

            // Find token transfers
            const tokenTransfers = txn.meta.postTokenBalances.filter(
                (bal) => bal.mint === TOKEN_MINT
            );

            if (tokenTransfers.length > 0) {
                let wallet;

                // Handle both legacy and versioned transactions
                if (txn.transaction.message.getAccountKeys) {
                    wallet = txn.transaction.message.getAccountKeys().staticAccountKeys[0].toBase58();
                } else {
                    wallet = txn.transaction.message.accountKeys[0].pubkey.toBase58();
                }

                const amount = tokenTransfers[0].uiTokenAmount.uiAmount;

                console.log("🚨 New Buy Alert 🚨");
                console.log("Wallet:", wallet);
                console.log("Amount:", amount);
                console.log("Txn:", `https://solscan.io/tx/${sig.signature}`);
                console.log("----------------------------------");
            }
        }

        // Update the last processed transaction to prevent duplicates
        lastSignature = signatures[0].signature;
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// Start polling every few seconds
setInterval(fetchNewBuys, POLL_INTERVAL);

console.log("🔍 Monitoring new buys... 🚀");
// "@solana/web3.js": "^1.98.0"
