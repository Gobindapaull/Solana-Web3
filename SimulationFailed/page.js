'use client';

import { useState } from 'react';
import {
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export default function Home() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');

  const sendSol = async () => {
    try {
      const provider = (window).solana;
      if (!provider?.isPhantom) {
        setResult('Phantom Wallet not found!');
        return;
      }

      await provider.connect();

      const connection = new Connection(clusterApiUrl('devnet'));
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const computeIx = ComputeBudgetProgram.setComputeUnitLimit({ units: 100 }); // Fails sim but succeeds
      const transferIx = SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const tx = new Transaction().add(computeIx).add(transferIx);
      tx.feePayer = provider.publicKey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTx = await provider.signTransaction(tx);
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,
      });

      setResult(`✅ Sent!\nSignature: ${signature}\nExplorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (err) {
      console.error(err);
      setResult(`❌ Error: ${err.message}`);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚫 Devnet SOL Transfer (Fails Simulation)</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Recipient PublicKey (Devnet)"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="number"
        step="0.001"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={sendSol}
      >
        Send SOL (Fail Simulation)
      </button>

      <pre className="mt-4 text-sm text-green-800 whitespace-pre-wrap">{result}</pre>
    </main>
  );
}
