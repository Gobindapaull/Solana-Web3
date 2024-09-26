import { Connection, clusterApiUrl, SystemProgram, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import bs58 from "bs58";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const fromKeypair = Keypair.fromSecretKey(new Uint8Array(bs58.decode("")));
 
console.log(fromKeypair.publicKey.toBase58());

const fromPubkey = fromKeypair;
const newPubkey = Keypair.generate();

const main = async () => {
    const space = 0;
    const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(space);

    const blockhash = await connection.getLatestBlockhash();
    console.log(blockhash.lastValidBlockHeight);

    const createAccountParams = {
        fromPubkey: fromPubkey.publicKey,
        newAccountPubkey: newPubkey.publicKey,
        lamports: rentExemptionAmount,
        space,
        programId: SystemProgram.programId
    }
    const createAccountTransaction = new Transaction().add(
        SystemProgram.createAccount(createAccountParams)
    );

    const tx = await sendAndConfirmTransaction(connection, createAccountTransaction, [fromPubkey, newPubkey]);
    console.log(tx);
    // https://explorer.solana.com/address/FLgznt5HnrKSaYTRzCk2vU5XuL2rvqv5Uc8Bxmj6oxcf

}

main();
