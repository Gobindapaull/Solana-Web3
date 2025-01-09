import { Connection, Keypair, VersionedTransaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

const inputMint = 'So11111111111111111111111111111111111111112';
const outputMint = '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr';
const inputAmount = 0.00001;
const slippage = 50;

const wallet = Keypair.fromSecretKey(new Uint8Array(bs58.decode("")));
console.log(wallet.publicKey.toBase58());

const connection = new Connection(clusterApiUrl("mainnet-beta"));

const jup = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${inputAmount*1e9}&slippageBps=${slippage}`);
const quoteResponse = await jup.json();
console.log(quoteResponse);

// get serialized transactions for the swap
const { swapTransaction } = await (
  await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
    })
  })
).json();


// deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

// sign the transaction
transaction.sign([wallet]);

// Execute the transaction
const rawTransaction = transaction.serialize()
const txid = await connection.sendRawTransaction(rawTransaction, {
  skipPreflight: true,
  maxRetries: 2
});
await connection.confirmTransaction(txid);
console.log(`https://solscan.io/tx/${txid}`);
