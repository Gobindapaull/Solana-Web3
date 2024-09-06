import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import bs58 from "bs58"

async function getBalance() {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
    const signer = [
        Keypair.fromSecretKey(bs58.decode(""))
    ]
    const signerPublicKey = signer[0].publicKey
    console.log(`signer: ${signerPublicKey}`)
    
    const bal = await connection.getBalance(signerPublicKey, "confirmed")
    console.log(`Balance: ${bal / LAMPORTS_PER_SOL} SOL`)
}

getBalance()
