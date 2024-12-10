const { Connection, Transaction, TransactionInstruction, PublicKey, clusterApiUrl, Keypair, sendAndConfirmTransaction } = require("@solana/web3.js");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"));
const transaction = new Transaction();

const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync('/home/block107/.config/solana/id.json')))
);

// Fetch the payer address
const payerAddress = payerKeypair.publicKey.toString();
console.log('Payer Address:', payerAddress);

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const memoText = "Hello, Solana Memo...";

transaction.add(new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memoText)
}));

console.log(`Sending transaction ...`);

const main = async () => {
    try {
        const txHash = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payerKeypair]
        );

        console.log(`Transaction sent with hash : ${txHash}`);
    } catch (error) {
        console.log(error);
    }

}

main();
