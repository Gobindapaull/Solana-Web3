import { Keypair } from "@solana/web3.js"
import * as bip39 from "bip39"

const mnemonic = "poet key spare orbit glory foam cloud giggle banner dance chronic retire"

const seed = bip39.mnemonicToSeedSync(mnemonic, "")
const keypair = Keypair.fromSeed(seed.slice(0, 32))

console.log(`${keypair.publicKey.toBase58()}`)
