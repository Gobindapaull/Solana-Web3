const { Connection, PublicKey } = require("@solana/web3.js")
const anchor = require("@coral-xyz/anchor")
const bs58 = require("bs58")

const connection = new Connection("https://api.mainnet-beta.solana.com", {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
})

const pumpFunProgramAddress = new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
const txSignature = "5mUqy1Uw1DE7LBHjD7Zv7h2xq1UEikCqACefn727gkhV6G2JkwFgww3svbABjvBrk6LbRbdbQG4tpkhVLvZCicZ3"

async function checkTransaction(txSignature) {
    try {
        const txInfo = await connection.getParsedTransaction(txSignature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        })
        if (!txInfo) {
            console.log("Invalid tx info")
            return
        }
        for (let instruction of txInfo.transaction.message.instructions) {
            if (instruction.programId.equals(pumpFunProgramAddress)) {
                console.log("PUMP FUN VALID TX")
                return true
            }
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}
async function getTransactionDetails(txSignature) {
    try {
        await checkTransaction(txSignature)
        const transaction = await connection.getTransaction(txSignature, {
            commitment: "confirmed",
            maxSupportedTransactionVersion: 0
        })
        if (!transaction) {
            console.log("tx not valid")
            return
        }

        const accountKeys = transaction.transaction.message.staticAccountKeys.map(key => key.toBase58())
        // console.log(accountKeys)
        const signer = accountKeys[0]
        console.log(`signer : ${signer}`)
    } catch (error) {
        console.log(error)
    }
}

getTransactionDetails(txSignature)
