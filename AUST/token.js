const solanaWeb3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token');
const bs58 = require('bs58')
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const toAddress = process.env.TO_ADDRESS;

async function main() {
    const url = process.env.RPC_URL;
    const connection = new solanaWeb3.Connection(url)

    const to = new solanaWeb3.PublicKey(toAddress)
    const tokenMint = new solanaWeb3.PublicKey(process.env.JUPUARY_TOKEN_ADDRESS);

    const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)))

    console.log(`🔍 Monitoring wallet: ${walletKeyPair.publicKey.toBase58()}`);

    while (true) {
        try {
            // 1️⃣ Check for SOL balance
            const balance = await connection.getBalance(walletKeyPair.publicKey)
            console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)

            // 2️⃣ Check SPL token balance
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletKeyPair.publicKey, {
                mint: tokenMint,
            });

            // Token Account
            console.log(`Wallet Token Account: ${tokenAccounts.value[0].pubkey.toBase58()}`); // HGYfSXzgS7ajda95GwmFnC6oRRnLeYqeQp9WWMYkrNB2

            if (tokenAccounts.value.length > 0) {
                const accountInfo = tokenAccounts.value[0].account.data.parsed.info;
                const tokenAmount = accountInfo.tokenAmount.uiAmount;

                if (tokenAmount > 0) {
                    console.log(`🪙 Found ${tokenAmount} tokens of ${tokenMint.toBase58()}`);

                    // Get or create recipient’s token account
                    const destTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
                        connection,
                        walletKeyPair,
                        tokenMint,
                        to
                    );

                    // Transfer full balance
                    const sourceTokenAccount = tokenAccounts.value[0].pubkey;
                    const tx = await splToken.transfer(
                        connection,
                        walletKeyPair,
                        sourceTokenAccount,
                        destTokenAccount.address,
                        walletKeyPair.publicKey,
                        accountInfo.tokenAmount.amount // in smallest units
                    );

                    console.log(`✅ Token Transfer Success! TX: https://solscan.io/tx/${tx}`);
                } else {
                    console.log('❌ Token balance is zero.');
                }
            } else {
                console.log('❌ No token account found for this mint.');
            }
            await new Promise((res) => setTimeout(res, 1000)); // 1000 ms = 1 second
        } catch (error) {
            console.error('⚠️ Error:', error.message);
        }
    }


}

main();

// https://solscan.io/tx/5ht7YLni9h8j5VLAmX7Ue3pRjiL9HWYYs2XrNsJnM6cpaE7Gny1LHMbw2Xxdkd7xnXLNnn8YzKKqksvj2ayrkREk
// https://solscan.io/account/3h9QqDgeLXHR7kncsHMEh6Ya9WtyziVsHYdVgqSxfUDB
