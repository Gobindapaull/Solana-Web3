import { Connection, LAMPORTS_PER_SOL, Transaction,clusterApiUrl, SystemProgram, sendAndConfirmTransaction, Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const fromKeypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode("")));
console.log(fromKeypair.publicKey.toBase58());

const connection = new Connection(clusterApiUrl("mainnet-beta"));

const sender = fromKeypair.publicKey;
const receiver = Keypair.generate().publicKey;

const transferAmount = 0.001;

const main = async () => {
    const preBalanceSender = await connection.getBalance(sender);
    const preBalanceReceiver = await connection.getBalance(receiver);

    console.log(`sender pre balance : ${preBalanceSender / LAMPORTS_PER_SOL} SOL`);
    console.log(`receiver pre balance : ${preBalanceReceiver / LAMPORTS_PER_SOL} SOL`);

    const transferInstruction = SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: receiver,
        lamports: transferAmount * LAMPORTS_PER_SOL
    });

    const transaction = new Transaction().add(transferInstruction);

    const transactionSignature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);

    const postBalanceSender = await connection.getBalance(sender);
    const postBalanceReceiver = await connection.getBalance(receiver);

    console.log(`sender post balance : ${postBalanceSender / LAMPORTS_PER_SOL} SOL`);
    console.log(`receiver post balance : ${postBalanceReceiver / LAMPORTS_PER_SOL} SOL`);

    console.log(`Transaction Hash : https://explorer.solana.com/tx/${transactionSignature}`);

}

main();

