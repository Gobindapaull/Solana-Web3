const { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionMessage, VersionedTransaction, PublicKey } = require("@solana/web3.js");
const bs58 = require("bs58");

const privateKey = "";
const recipient = new PublicKey("");

const main = async () => {
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");
    const sender = Keypair.fromSecretKey(bs58.decode(privateKey));
    console.log(`sender address: ${sender.publicKey.toBase58()}`);
    
    const { blockhash } = await connection.getLatestBlockhash("confirmed");

    const transferIx = SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: 0.0001 * LAMPORTS_PER_SOL
    })

    const messageV0 = new TransactionMessage({
        payerKey: sender.publicKey,
        recentBlockhash: blockhash,
        instructions: [transferIx]
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([sender]);

    const simulation = await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true
    });

    console.log(`Simulation logs: ${simulation.value.logs}`);

    if (simulation.value.err) {
        console.log(`Simulation failed: ${JSON.stringify(simulation.value.err, null, 2)}`);
    } else {
        console.log(`✅ Simulation succeeded`);
    }
}


main();
