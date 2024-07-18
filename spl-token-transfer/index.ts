import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction
} from "@solana/web3.js"

import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction
} from "@solana/spl-token"

const bot = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
    const fromWallet = Keypair.generate()
    console.log(`from wallet address : ${fromWallet.publicKey.toBase58()}`)

    const fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL
    )
    await connection.confirmTransaction(fromAirdropSignature)

    const toWallet = Keypair.generate()

    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9
    )

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
    )

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey
    )

    await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        10000000000
    )
    const tx1 = createTransferInstruction(
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        200
    )

    const transaction = new Transaction().add(tx1)

    const tx = await sendAndConfirmTransaction(connection, transaction, [fromWallet])
    console.log(tx)

}

bot()
