const { createMint, getOrCreateAssociatedTokenAccount, mintTo, thawAccount, TOKEN_PROGRAM_ID, freezeAccount } = require("@solana/spl-token");
const { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL} = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const feePayer = Keypair.fromSecretKey(Uint8Array.from([secretKey_Here]));

console.log(`feePayer: ${feePayer.publicKey}`);

const mintAuthority = feePayer;
const freezeAuthority = feePayer;

const decimals = 9;

const main = async () => {
    // Create a new mint
    const mint = await createMint(connection, feePayer, mintAuthority.publicKey, freezeAuthority.publicKey, decimals);
    console.log(`Mint address: ${mint.toBase58()}`);

    // Create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, feePayer, mint, feePayer.publicKey);
    console.log(`Token account: ${tokenAccount.address.toBase58()}`);

    // Mint tokens
    const mintTokens = await mintTo(connection, feePayer, mint, tokenAccount.address, mintAuthority, 1000000 * LAMPORTS_PER_SOL);
    console.log(`Successfully minted: ${1000000} tokens. Hash: ${mintTokens}`);

    // Freeze account
    const freezeTokenAccount = await freezeAccount(connection, feePayer, tokenAccount.address, mint, freezeAuthority);
    console.log(`Successfully frozen token account. Hash: ${freezeTokenAccount}`);

    // Thaw the frozen token account
    const thawTokenAccount = await thawAccount(connection, feePayer, tokenAccount.address, mint, freezeAuthority);
    console.log(`Successfully thaw the frozen token account. Hash: ${thawTokenAccount}`);

}

main();
