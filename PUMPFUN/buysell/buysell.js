import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(
    RPC_ENDPOINT,
    'confirmed',
);

async function buy() {
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "publicKey": "4RFnGqwoQzHe38ZCpsHrGfcxDFvDhsTCGak5RMpuXqvT",  // Your wallet public key
            "action": "buy",                 // "buy" or "sell"
            "mint": "BTx2uAma11W2UGMnehnChnN1HAoMzJ3mFVF2AeVqpump",         // contract address of the token you want to trade
            "denominatedInSol": "false",     // "true" if amount is amount of SOL, "false" if amount is number of tokens
            "amount": 1000,                  // amount of SOL or tokens
            "slippage": 10,                  // percent slippage allowed
            "priorityFee": 0.00001,          // priority fee
            "pool": "pump"                   // exchange to trade on. "pump" or "raydium"
        })
    });
    if (response.status === 200) { // successfully generated transaction
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(""));
        tx.sign([signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx)
        console.log("[bought] -- Transaction: https://solscan.io/tx/" + signature);
    } else {
        console.log(response.statusText); // log error
    }
}

async function sell() {
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "publicKey": "4RFnGqwoQzHe38ZCpsHrGfcxDFvDhsTCGak5RMpuXqvT",  // Your wallet public key
            "action": "sell",                 // "buy" or "sell"
            "mint": "BTx2uAma11W2UGMnehnChnN1HAoMzJ3mFVF2AeVqpump",         // contract address of the token you want to trade
            "denominatedInSol": "false",     // "true" if amount is amount of SOL, "false" if amount is number of tokens
            "amount": 2000,                  // amount of SOL or tokens
            "slippage": 10,                  // percent slippage allowed
            "priorityFee": 0.00001,          // priority fee
            "pool": "pump"                   // exchange to trade on. "pump" or "raydium"
        })
    });
    if (response.status === 200) { // successfully generated transaction
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(""));
        tx.sign([signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx)
        console.log("[sold] -- Transaction: https://solscan.io/tx/" + signature);
    } else {
        console.log(response.statusText); // log error
    }
}

async function sendPortalTransaction() {
    await buy()

    setTimeout(() => {
        console.log("Waited for 3 seconds");
    }, 3000);
    
    await sell()
}

sendPortalTransaction();



// buy = https://solscan.io/tx/9SQFQusKitCd4dh7MGRK5BXTxfdQjtt8AoedJKfwGK54gwDeZtuoV27kDGA4WLA6P37fBHuchwu9wZivxgviQBw
// sell = https://solscan.io/tx/2HN2zUxLQ8GuYoNHD6LjM2HLJgmb4GghLEYAUQnM5mwkKV7MMLNHr4RuLPse5KSYv5Aa8bjDHD7LhqiTmerP7zyb
