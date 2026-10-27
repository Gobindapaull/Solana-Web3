const { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } = require("@solana/web3.js")

const RPC_URL = clusterApiUrl("mainnet-beta")
const WALLET_ADDRESS = "FfW5e8gKJfgaZPog6DiJoW6Kif6Fb23CokWprRhHVjV1"

const connection = new Connection(RPC_URL, "confirmed")
const publicKey = new PublicKey(WALLET_ADDRESS)

async function main() {
    try {
        // Check balance
        const balanceLamports = await connection.getBalance(publicKey)
        const balanceSOL = Number(balanceLamports) / LAMPORTS_PER_SOL

        console.log(`Network: ${RPC_URL}`)
        console.log(`Wallet address: ${publicKey}`)
        console.log(`Balance (SOL) : ${balanceSOL}`)
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

main()

// "@solana/web3.js": "^3.1.1"
