import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"

const start = async () => {
    const fromKeypair = Keypair.generate()
    console.log(`fromKeypair: ${fromKeypair.publicKey}`)

    const toKeypair = Keypair.generate()
    console.log(`toKeypair: ${toKeypair.publicKey}`)

    const connection = new Connection("https://api.testnet.solana.com", "confirmed")
    console.log(`connection: ${connection.commitment}`)

    const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL)

    const tx = await connection.confirmTransaction(airdropSignature)
    console.log(tx.value)

}

start()
