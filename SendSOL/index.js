import { Connection, Keypair, SystemProgram, LAMPORTS_PER_SOL, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"


const fromKeyPair = Keypair.fromSecretKey(
    Uint8Array.from([
        
    ]
    )
)

console.log(fromKeyPair.publicKey.toBase58())

const start = async () => {

    const toKeypair = Keypair.generate()
    console.log(`toKeypair: ${toKeypair.publicKey}`)

    const connection = new Connection("https://api.devnet.solana.com", "confirmed")
    console.log(`connection: ${connection.commitment}`)

    const lamportsToSend = 1_000_000 // 0.001 SOL


    const tx = SystemProgram.transfer({
        fromPubkey: fromKeyPair.publicKey,
        toPubkey: toKeypair.publicKey,
        lamports: lamportsToSend
    })

    const transferTransaction = new Transaction().add(tx)

    const txhash = await sendAndConfirmTransaction(connection, transferTransaction, [fromKeyPair])
    console.log(txhash)
    
}

start()
