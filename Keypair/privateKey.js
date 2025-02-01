import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

const secretKey = new Uint8Array([]);

// Restore keypair from secret key
const keypair = Keypair.fromSecretKey(secretKey);

// Get the private key in Base58 format
const privateKeyBase58 = bs58.encode(keypair.secretKey);
console.log("Private Key (Base58):", privateKeyBase58);

// Get the public key
console.log("Public Key:", keypair.publicKey.toBase58());
