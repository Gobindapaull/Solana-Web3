const solanaWeb3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const bs58 = require("bs58");

require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;

async function main() {
  const url = "https://api.devnet.solana.com";
  const connection = new solanaWeb3.Connection(url);
  // console.log(connection)

  const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(
    new Uint8Array(bs58.decode(privateKey))
  );
  const balance = await connection.getBalance(walletKeyPair.publicKey);
  console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);

  const mint = await splToken.createMint(
    connection,
    walletKeyPair,
    walletKeyPair.publicKey,
    null,
    9,
    undefined,
    {},
    splToken.TOKEN_PROGRAM_ID
  );

  console.log(`Mint : ${mint}`);

  const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    connection,
    walletKeyPair,
    mint,
    walletKeyPair.publicKey
  );
  console.log(`Token Account : ${tokenAccount}`);

  await splToken.mintTo(
    connection,
    walletKeyPair,
    mint,
    tokenAccount.address,
    walletKeyPair.publicKey,
    1000000000000
  );

  const secondWalletKeyPair = solanaWeb3.Keypair.generate();

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey: walletKeyPair.publicKey,
      toPubkey: secondWalletKeyPair.publicKey,
      lamports: solanaWeb3.LAMPORTS_PER_SOL * 0.0001,
    })
  );
  console.log(`tx : ${transaction}`);

  const signature = await solanaWeb3.sendAndConfirmRawTransaction(
    connection,
    transaction,
    [walletKeyPair]
  );

  console.log(`Success : ${signature}`)
}

main();
