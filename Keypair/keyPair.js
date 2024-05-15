import {Keypair} from "@solana/web3.js"

const keyPair = Keypair.generate()

console.log(keyPair)
console.log(keyPair.publicKey)
console.log(keyPair.secretKey)
