import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js"
import { createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"

import * as fs from "fs"

const bot = async () => {
    const receiver = new PublicKey("");

    const mint = new Keypair();
    // console.log(mint);

    const keypairBytes = JSON.parse(fs.readFileSync("./aW69WftcTVhTsotfG73r7MJRMhxfGQLsxbxLjU3HzKp.json"));
    const signer = Keypair.fromSecretKey(new Uint8Array(keypairBytes));
    // console.log(signer.publicKey.toBase58());

    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    console.log(connection.getBalance(receiver));

    const transferIX = SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: receiver,
        lamports: 0.00001 * LAMPORTS_PER_SOL
    });

    const ata = getAssociatedTokenAddressSync(mint.publicKey, signer.publicKey, true, TOKEN_2022_PROGRAM_ID);

    const createMintIX = createInitializeMint2Instruction(mint.publicKey, 9, signer.publicKey, null, TOKEN_2022_PROGRAM_ID);
    const createATAIX = createAssociatedTokenAccountInstruction(signer.publicKey, ata, signer.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID);
    const mintTokensIX = createMintToInstruction(mint.publicKey, ata, signer.publicKey, 1 * 10 ** 9);

    const tx = new Transaction();

    tx.add(transferIX, createMintIX, createATAIX, mintTokensIX);

    tx.feePayer = signer.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    tx.sign(signer);

    // simulate
    const simulation = connection.simulateTransaction(tx);
    console.log(simulation);

    if ((await simulation).value.err) {
        return;
    }

    // send
    const sx = sendAndConfirmTransaction(connection, tx, [signer], { commitment: "confirmed" });
    console.log(sx);
}

bot()
