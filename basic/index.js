import { Keypair, LAMPORTS_PER_SOL, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

console.log(Keypair.generate().secretKey)
console.log(LAMPORTS_PER_SOL) // 1000000000
console.log(SystemProgram)
console.log(TransactionMessage)
console.log(VersionedTransaction)
