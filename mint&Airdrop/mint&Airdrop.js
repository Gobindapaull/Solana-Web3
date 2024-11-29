import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import bs58 from "bs58";

// Connect to the Solana cluster
const connection = new Connection(
    clusterApiUrl("devnet"),
    'confirmed'
);

const payer = Keypair.fromSecretKey(new Uint8Array(bs58.decode("")));

// Mint the SPL Token (replace existing mint if you already have one)
const mintToken = async () => {
  const mint = await createMint(connection, payer, payer.publicKey, null, 9); // 9 decimals
  console.log(`Token Mint Address: ${mint.toBase58()}`);

  return mint;
};

// Airdrop tokens to a wallet
const airdropTokens = async (mint, recipient) => {
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, recipient);

  // Mint 100 tokens to the recipient
  await mintTo(connection, payer, mint, recipientTokenAccount.address, payer, 100 * 10 ** 9); // 100 tokens
  console.log(`Airdropped 100 tokens to ${recipient.toBase58()}`);
};

// Example usage
(async () => {
  const mint = await mintToken();
  const recipient = new PublicKey('36gDcjWX5L8R8BGCy2BM3rkNDWsUfm7sJGDG2FsxYiSJ');
  await airdropTokens(mint, recipient);
})();

  
// 36gDcjWX5L8R8BGCy2BM3rkNDWsUfm7sJGDG2FsxYiSJ
// https://api.mainnet-beta.solana.com
