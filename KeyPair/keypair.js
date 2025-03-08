import { Keypair } from "@solana/web3.js";
import fs from "fs";

const keyPair = JSON.parse(fs.readFileSync('payer.json'));
const payer = Keypair.fromSecretKey(new Uint8Array(keyPair));
console.log("Payer Public Key:", payer.publicKey.toBase58());
