const { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } = require("@solana/web3.js")

const RPC_URL = clusterApiUrl("mainnet-beta")
const WALLET_ADDRESS = "7o2H2RozhHSjh1955Xy1ABGyTpvy8fCRpP4cBTcHi95y"

const connection = new Connection(RPC_URL, "confirmed")

const publicKey = new PublicKey(WALLET_ADDRESS)

async function main() {
    try {
        // Generate a solana wallet
        const keypair = await Keypair.generate()
        console.log(`Public key: ${keypair.publicKey.toBase58()}`)
        console.log(`Private key: ${Buffer.from(keypair.secretKey).toString("hex")}`)

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
