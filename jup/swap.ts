import { Connection, Keypair, VersionedTransaction, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

const inputMint = 'So11111111111111111111111111111111111111112';
const outputMint = 'EbvJsEaRfoP7dgvegCUwVqE7jNZ8YPtNgDtNuDE1pump';
const inputAmount = 0.0001;
const slippage = 300;

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
      userPublicKey: wallet.publicKey.toString()
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
const txid = await connection.sendRawTransaction(rawTransaction);

const result = await connection.confirmTransaction(txid);
console.log(result);
console.log(`https://solscan.io/tx/${txid}`);

// https://solscan.io/tx/5NiXqJ9w5U66M4xf9bcrLiWNfjArfCmPXVU4JfDtt4v2NVQ58gvLnzJJhYuLRcRYSU1mibJKc9m6UgtwdfsDwMFa
// https://solscan.io/tx/3wxEraFyLwxCJCM2ye4n3MJVVPZniPWSXfqYLYKpEBfKBQKn8yN7tLNtNpDh3WqGN6LL6xFebz6f2JUhh5dBDwVP
// https://solscan.io/tx/nVPMPeENs1RK9pE4JpggwiKV7R85yM1eNUxs1sGvuaneKFEGQDAvmBo4VJP3yviRm1GuKBWUzgvRjPbZLN1QeBP
