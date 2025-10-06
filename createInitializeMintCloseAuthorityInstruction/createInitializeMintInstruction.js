import {
    closeAccount, createInitializeMintInstruction, createInitializeMintCloseAuthorityInstruction,
    getMintLen, ExtensionType, TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";

import fs from 'fs';

import { clusterApiUrl, sendAndConfirmTransaction, Connection, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

const main = async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("./payer.json", "utf8"))));
    console.log(`payer: ${payer.publicKey}`); // BAztYPh3WbnTmP75GackB12vkA5bSnoRU5wmXHaJAwTf
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`payer balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    const mintKeypair = Keypair.generate();
    console.log(`mint : ${mintKeypair.publicKey}`);
    fs.writeFileSync("mintKeypair.json", JSON.stringify(Array.from(mintKeypair.secretKey)));

    const mintAuthority = Keypair.generate();
    fs.writeFileSync("mintAuthority.json", JSON.stringify(Array.from(mintAuthority.secretKey)));

    const freezeAuthority = Keypair.generate();
    fs.writeFileSync("freezeAuthority.json", JSON.stringify(Array.from(freezeAuthority.secretKey)));

    const closeAuthority = Keypair.generate();
    fs.writeFileSync("closeAuthority.json", JSON.stringify(Array.from(closeAuthority.secretKey)));


    const extensions = [ExtensionType.MintCloseAuthority];
    const minLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(minLen);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: minLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID
        }),
        createInitializeMintCloseAuthorityInstruction(
            mintKeypair.publicKey,
            closeAuthority.publicKey,
            TOKEN_2022_PROGRAM_ID
        ),
        createInitializeMintInstruction(
            mintKeypair.publicKey,
            9,
            mintAuthority.publicKey,
            freezeAuthority.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );

    await sendAndConfirmTransaction(
        connection,
        transaction,
        [payer, mintKeypair]
    );

    console.log("✅ Mint initialized with close authority!");
    console.log("Close Authority:", closeAuthority.publicKey.toBase58());
    console.log("Freeze Authority:", freezeAuthority.publicKey.toBase58());
    console.log("mint Authority:", mintAuthority.publicKey.toBase58());

}

main();
