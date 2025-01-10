import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionInstruction, Transaction, PublicKey, clusterApiUrl } from "@solana/web3.js";

const main = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        const payer = Keypair.fromSecretKey(Uint8Array.from([]));
        console.log(payer.publicKey.toBase58()); // PAL1do8VYBBwJ5rVnjYLGCWiyUCxRcL1a9MqcTwxtRM

        // const nonceAccount = Keypair.fromSecretKey(Uint8Array.from([]));
        // console.log(nonceAccount.publicKey.toBase58()); // noAJaRJE41cE7CCuEMzepBo94QxGgTQWv45GFUKdySt

        const nonceAccount = Keypair.generate();
        console.log(nonceAccount.secretKey)

        const minimumBalance = await connection.getMinimumBalanceForRentExemption(80);

        // Step 5: Create and initialize the nonce account
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: payer.publicKey,
                newAccountPubkey: nonceAccount.publicKey,
                lamports: minimumBalance,
                space: 80, // Space required for the nonce account
                programId: SystemProgram.programId,
            }),
            SystemProgram.nonceInitialize({
                noncePubkey: nonceAccount.publicKey,
                authorizedPubkey: payer.publicKey,
            })
        );

        // Sign and send transaction
        const signature = await connection.sendTransaction(transaction, [payer, nonceAccount]);
        await connection.confirmTransaction(signature);

        console.log("Nonce Account created and initialized successfully");


    } catch (error) {
        console.log(error);
    }
}

main();


// https://explorer.solana.com/tx/2Z76fsPSqWtvpXJ7dGVJVsZCnHWm6GdWAyXVJWCLfRUsGn4U5vMcUVF4JFktoRzDoz5gnHYiYRoujpyv63x71682?cluster=devnet
// Nonce Account created and initialized successfully

// Nonce address = 7CajxGSeP3sk3fmq1aH6HWxAVQFeBJqCLE5A7b8mCdak
// Authority address = PAL1do8VYBBwJ5rVnjYLGCWiyUCxRcL1a9MqcTwxtRM

// Allocated Data Size = 80 byte(s)
