const solanaWeb3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token')
const bs58 = require('bs58')

require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY

async function main() {
    const url = "https://api.devnet.solana.com"
    const connection = new solanaWeb3.Connection(url)
    // console.log(connection)

    const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)))
    const balance = await connection.getBalance(walletKeyPair.publicKey)
    console.log(`Wallet Balance : ${ balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)
}

main()
