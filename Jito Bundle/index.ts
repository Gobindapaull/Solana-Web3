import { PublicKey, Connection, Keypair, TransactionMessage, SystemProgram, clusterApiUrl, VersionedTransaction } from "@solana/web3.js";
import fs from "fs";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('./keypair.json', 'utf8'))));

const tipAddresses = ["Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY","DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL","HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe","ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt","96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5","ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49","3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT","DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh"];

const randomTipAddress = new PublicKey(tipAddresses[Math.floor(Math.random() * tipAddresses.length)]);


async function jitoBundle() {
    const sendTx = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: payer.publicKey,
        lamports: 1000000 // 0.001 SOL
    });
    
    const jitoTip = SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: randomTipAddress,
        lamports: 100000 // 0.0001 SOL
    });
    
    const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [sendTx, jitoTip]
    }).compileToV0Message;
    
    const tx = new VersionedTransaction(messageV0);
    tx.sign([payer]);
    
    const txBase64 = Buffer.from(tx.serialize()).toString('base64');
    console.log(txBase64);
    
    const body = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sendBundle",
        "params": [
          [
            txBase64
          ],
          {
            "encoding": "base64"
          }
        ]
      }
    
    const bundle = await fetch("https://ny.mainnet.block-engine.jito.wtf/api/v1/bundles", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    const json = await bundle.json();
    console.log("Bundle sent: ", json.result);
    
}

jitoBundle();



// "@solana/web3.js": "^1.98.0"
