import { Keypair } from "@solana/web3.js";
import bs58 from "bs58"

async function getPublickey() {
    const signer = [
        Keypair.fromSecretKey(bs58.decode(""))
    ]
    console.log(`signer : ${signer[0].publicKey.toBase58()}`)
}

getPublickey()
