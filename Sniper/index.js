import { Keypair } from "@solana/web3.js";
import bs58 from "bs58"
import { SolanaTracker } from "solana-swap"
import fetch from "node-fetch"

const secret = ""

const CONFIG = {
    amountToSwap: 0.0001,
    slippage: 30,
    priorityFee: 0.00005
}

const keypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(secret)))
const solanaTracker = new SolanaTracker(keypair, "https://api.solanatracker.io/rpc")

async function getLatestTokens() {
    const response = await fetch("https://api.solanatracker.io/tokens/latest")
    const tokens = await response.json()
    return tokens
}

async function snipe(tokenAddress) {
    const swapResponse = await solanaTracker.getSwapInstructions(
        "So11111111111111111111111111111111111111112",
        tokenAddress,
        CONFIG.amountToSwap,
        CONFIG.slippage,
        keypair.publicKey.toBase58(),
        CONFIG.priorityFee
    )
    const txId = await solanaTracker.performSwap(swapResponse)
    console.log(`Transactin ID : ${txId}`)
    console.log(`explorer : https://explorer.solana.com/tx/${txId}`)
}

async function main() {
    const startDate = new Date()

    while(true) {
        const tokens = await getLatestTokens()

        for (const token of tokens) {
            const createdAt = new Date(token.createdAt)
            
            if(createdAt > startDate) {
                console.log(`No token found : ${token.name}`)
                await snipe(token.address)
            }
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
    }
}

main().catch((error) => {
    console.error(error)
})
