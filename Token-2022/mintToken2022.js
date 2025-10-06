import {
    closeAccount, createInitializeMintInstruction, createInitializeMintCloseAuthorityInstruction,
    getMintLen, ExtensionType, TOKEN_2022_PROGRAM_ID,
    createInitializeTransferFeeConfigInstruction,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction
} from "@solana/spl-token";

import fs from 'fs';

import { clusterApiUrl, sendAndConfirmTransaction, PublicKey, Connection, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";

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


    const extensions = [ExtensionType.MintCloseAuthority, ExtensionType.TransferFeeConfig];
    const minLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(minLen);

    const recipient = new PublicKey("3h9QqDgeLXHR7kncsHMEh6Ya9WtyziVsHYdVgqSxfUDB");

    // --- Fee authorities ---
    const feeAuthority = payer.publicKey;
    const withdrawAuthority = payer.publicKey;


    const transferFeeBasisPoint = 50; // 0.5 %
    const maxFee = BigInt(5000) // 5 tokens

    const transaction = new Transaction().add(
        // Create Mint Account
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: minLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID
        }),
        // Add Transfer Fee extension
        createInitializeTransferFeeConfigInstruction(
            mintKeypair.publicKey,
            feeAuthority,
            withdrawAuthority,
            transferFeeBasisPoint,
            maxFee,
            TOKEN_2022_PROGRAM_ID
        ),
        // Add Close Authority extension
        createInitializeMintCloseAuthorityInstruction(
            mintKeypair.publicKey,
            closeAuthority.publicKey,
            TOKEN_2022_PROGRAM_ID
        ),
        // Initialize Mint
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

    console.log("✅ Mint initialized with Close + Transfer Fee extensions");
    console.log("Close Authority:", closeAuthority.publicKey.toBase58());
    console.log("Freeze Authority:", freezeAuthority.publicKey.toBase58());
    console.log("mint Authority:", mintAuthority.publicKey.toBase58());

    // --- Create ATA for recipient ---
    const ata = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        recipient,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    const createAtaTx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            payer.publicKey,
            ata,
            recipient,
            mintKeypair.publicKey,
            TOKEN_2022_PROGRAM_ID
        )
    );
    await sendAndConfirmTransaction(
        connection,
        createAtaTx,
        [payer]
    );
    console.log("✅ Recipient ATA created:", ata.toBase58());

    // --- Mint tokens to recipient ---
    const mintAmount = BigInt(1_000_000 * LAMPORTS_PER_SOL);; // 1 million tokens
    const mintTx = new Transaction().add(
        createMintToInstruction(
            mintKeypair.publicKey,
            ata,
            mintAuthority.publicKey,
            mintAmount,
            [],
            TOKEN_2022_PROGRAM_ID
        )
    );
    await sendAndConfirmTransaction(
        connection,
        mintTx,
        [payer, mintAuthority]
    );
    console.log(`✅ Minted ${Number(mintAmount) / LAMPORTS_PER_SOL} tokens to ${recipient}`);


}

main();
