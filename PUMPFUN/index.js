const { Connection } = require("@solana/web3.js")
const connection = new Connection("https://api.mainnet-beta.solana.com")

async function getTransactionDetails(txHash) {
    console.log(`PUMP FUN SCRIPT`)
    try {
        const transaction = await connection.getTransaction(txHash, {
            commitment: 'confirmed',
            maxSupportedTransactionVersion: 0
        })
        if (!transaction) {
            console.log('tx not found')
            return
        }
        const accountKeys = transaction.transaction.message.staticAccountKeys.map(key => key.toBase58())

        const postTokenBalance = transaction.meta.postTokenBalances
        const preTokenBalance = transaction.meta.preTokenBalances

        let buyer = null
        let seller = null
        let tokenMint = null
        let amount = 0

        if (postTokenBalance.length > 0) {
            postTokenBalance.forEach((postBalance, index) => {
                const preBalance = preTokenBalance[index]

                if (preBalance && preBalance.uiTokenAmount.uiAmount > postBalance.uiTokenAmount.uiAmount) {
                    seller = preBalance.owner
                    amount = preBalance.uiTokenAmount.uiAmount - postBalance.uiTokenAmount.uiAmount
                }
                else if (preBalance && preBalance.uiTokenAmount.uiAmount < postBalance.uiTokenAmount.uiAmount) {
                    buyer = postBalance.owner
                    amount = postBalance.uiTokenAmount.uiAmount - preBalance.uiTokenAmount.uiAmount
                }

                tokenMint = postBalance.mint
            })
        }

        if (buyer && seller && tokenMint && amount) {
            console.log(`Buyer : ${buyer}`)
            console.log(`Seller : ${seller}`)
            console.log(`Token Mint : ${tokenMint}`)
            console.log(`Amount : ${amount}`)
        }
    } catch (error) {
        console.log(error)
    }
}

const txHash = "3iUFWLFKX7EkscE6v8KhAvspCRV4LTRRof9XHFhJAtwbgvAJvcHvydpxADtktBww4crZC2fMtghUzBqcxfAvWNes"
getTransactionDetails(txHash)
