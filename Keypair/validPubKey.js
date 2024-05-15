import { PublicKey } from "@solana/web3.js"

const key = new PublicKey("godV1Mx1vmFPMYoyJradmb51KVzTtHJTvxxcXLGCpwG")

const check = PublicKey.isOnCurve(key.toBytes())
console.log(`Valid public key : ${check}`)
