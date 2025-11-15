const { createMint, freezeAccount, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");
const { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// const feePayer = Keypair.generate();
const feePayer = Keypair.fromSecretKey(Uint8Array.from([secretKey_Here]))
console.log(`feePayer: ${feePayer}`);
console.log(`feePayer secretKey: ${feePayer.secretKey}`);

const mintAuthority = feePayer;
const freezeAuthority = feePayer;
const decimals = 6;


const main = async () => {

    // Request airdrop for fee payer
    // const airdropSig = await connection.requestAirdrop(feePayer.publicKey, 1 * LAMPORTS_PER_SOL);
    // await connection.confirmTransaction(airdropSig);

    // Create a new mint
    const mint = await createMint(connection, feePayer, mintAuthority.publicKey, freezeAuthority.publicKey, decimals);
    console.log(`Mint address: ${mint.toBase58()}`);

    // Create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, feePayer, mint, feePayer.publicKey);
    console.log(`Token account address: ${tokenAccount.address.toBase58()}`);

    // Mint tokens
    const mintTokens = await mintTo(connection, feePayer, mint, tokenAccount.address, mintAuthority, 1000000 * LAMPORTS_PER_SOL);
    console.log(`Token mint done: ${mintTokens}`);

    // Freeze token account
    const freezeTokenAccount = await freezeAccount(connection, feePayer, tokenAccount.address, mint, freezeAuthority);
    console.log(`Freezed token account: ${freezeTokenAccount}`);
}

main();
