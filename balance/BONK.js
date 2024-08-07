const { Keypair, Account, PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } = require("@solana/web3.js")


const walletBalance = async () => {
    try {
        const connection = new Connection(clusterApiUrl("mainnet-beta"))
        for (let index = 0; index < 1000; index++) {
            const newPair = new Keypair()
            const newWallet = new PublicKey(newPair.publicKey).toString()
            const secretKey = newPair.secretKey
            const wallet = await Keypair.fromSecretKey(secretKey)
            const walletBal = await connection.getBalance(wallet.publicKey)

            console.log(`wallet ${index} : ${newWallet}`)
            console.log(`BONK sent ✅`)
            console.log(`wallet ${index} balance  : 100 BONK`)
            console.log(`=========================================================================`)
        }

    } catch (error) {
        console.log(error)
    }
}
walletBalance()

// "@solana/web3.js": "^1.93.0"
