const { Connection, Keypair, SystemProgram, Transaction, clusterApiUrl } = require("@solana/web3.js");
const bs58 = require("bs58");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// const keypair = Keypair.generate();
const keypair = Keypair.fromSecretKey(new Uint8Array(bs58.default.decode("")))

console.log(`owner: ${keypair.publicKey.toBase58()}`);

const recipientPublicKey = Keypair.generate().publicKey.toBase58();
console.log(`recipient: ${recipientPublicKey}`);

async function createAndSerializeTransaction() {
    try {
        const transaction = new Transaction();
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: recipientPublicKey,
            lamports: 1000000
        });
        transaction.add(transferInstruction);
        transaction.feePayer = keypair.publicKey;
        const {blockhash} = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.sign(keypair);

        // Serialize the transaction
        const serializedTransaction = transaction.serialize();
        const serializedBase64 = serializedTransaction.toString("base64");
        console.log(`Serialized Transaction (Base64): ${serializedBase64}`);

        // send the serialize transaction
        const signature = await connection.sendRawTransaction(serializedTransaction, {
            skipPreflight: false
        });
        const confirmation = await connection.confirmTransaction(signature, "confirmed").then(a => console.log(a));
    } catch (error) {
        console.log(error);
    }
}

createAndSerializeTransaction();
