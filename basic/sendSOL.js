import { Connection, Keypair, SystemProgram, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"

const start = async () => {
    const fromKeypair = Keypair.generate()
    console.log(`fromKeypair: ${fromKeypair.publicKey}`)

    const toKeypair = Keypair.generate()
    console.log(`toKeypair: ${toKeypair.publicKey}`)

    const connection = new Connection("https://api.devnet.solana.com", "confirmed")
    console.log(`connection: ${connection.commitment}`)

    const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL)

    await sendAndConfirmTransaction(connection, airdropSignature)

    const lamportsToSend = 1_000_00

    const tx = SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toKeypair.publicKey,
        lamports: lamportsToSend
    })

    const transferTransaction = new Transaction().add(tx)

    await sendAndConfirmTransaction(connection, transferTransaction, [fromKeypair])
    console.log(transferTransaction)
    
}

start()
