import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  StakeProgram,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// 1. Generate a keypair for your main wallet (payer)
const payer = Keypair.generate();

// 2. Fund the payer with 1 SOL from airdrop (devnet only)
const airdropSignature = await connection.requestAirdrop(
  payer.publicKey,
  1 * LAMPORTS_PER_SOL
);
await connection.confirmTransaction(airdropSignature, "confirmed");

// 3. Generate a new stake account keypair
const stakeAccount = Keypair.generate();

// 4. Define the amount to stake
const amountToStake = 0.5 * LAMPORTS_PER_SOL; // 0.5 SOL

// 5. Create a Stake Account Instruction
const createStakeAccountTx = StakeProgram.createAccount({
  fromPubkey: payer.publicKey,
  stakePubkey: stakeAccount.publicKey,
  authorized: {
    staker: payer.publicKey,
    withdrawer: payer.publicKey,
  },
  lamports: amountToStake,
});

// 6. Send and confirm transaction
const signature = await sendAndConfirmTransaction(
  connection,
  createStakeAccountTx,
  [payer, stakeAccount]
);

console.log("✅ Stake account created!");
console.log("Transaction Signature:", signature);
console.log("Stake Account Address:", stakeAccount.publicKey.toBase58());
