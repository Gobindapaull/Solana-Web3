const fs = require("fs")
import { AccountRole, address, appendTransactionMessageInstruction, createSolanaRpc, createTransactionMessage, generateKeyPair, generateKeyPairSigner, getBase64EncodedWireTransaction, IInstruction, pipe, setTransactionMessageFeePayer, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners } from "@solana/web3.js"

const main = async () => {
    const signer = generateKeyPairSigner()

    const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com")

    const {value: latestBlockhash} = await rpc.getLatestBlockhash().send()

    const pumpProgramID = address("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
    console.log(pumpProgramID)

    const dataBuffer = Buffer.alloc(24)
    dataBuffer.write("ddeb2fb385903bfe8bd6bf02a5dd455b8064e4e5e878d55a95f535415644be1f", "hex")
    console.log(dataBuffer)
    const data = new Uint8Array(dataBuffer)
    console.log(data)

    const ix: IInstruction = {
        programAddress: pumpProgramID,
        accounts: [
            {
                address: address("Cot3wyGVUAzpBARrSjSX32UeHymQKpvqdoyWbo5EkYye"),
                role: AccountRole.READONLY
            },
            {
                address: address("2mnz3h22QcUCyvpyJP6nQU8RWo7yox7k4WQNa5JqHGeT"),
                role: AccountRole.READONLY
            },
            {
                address: address("6zAcFYmxkaH25qWZW5ek4dk4SyQNpSza3ydSoUxjTudD"),
                role: AccountRole.READONLY
            }
        ],
        data: new Uint8Array(dataBuffer)
    }
    const tx = pipe(
        createTransactionMessage({version: 0}),
        tx => setTransactionMessageFeePayerSigner(signer, tx),
        tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
        tx => appendTransactionMessageInstruction(ataTx, tx),
        tx => appendTransactionMessageInstruction(ix, tx)
    )
    const signedTx = await signTransactionMessageWithSigners(tx)
    const encodedTx = getBase64EncodedWireTransaction(signedTx)
    const simulation = await rpc.simulateTransaction(encodedTx, { encoding: 'base64'}).send()
    console.log(simulation)
}

main()

// "dependencies": {
//     "@solana/web3.js": "^2.0.0-rc.1"
//   },
//   "devDependencies": {
//     "@types/node": "^22.5.2"
//   }
