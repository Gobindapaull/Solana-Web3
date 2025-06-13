const solanaWeb3 = require('@solana/web3.js')
const bs58 = require('bs58')

const privateKey = "5yW38WQsiLtu58bz7C9UbF5hZNReDNDHipHYqpc8shsrwKw4m6F3pS1KMBTjoujk3aUGUFzX3635Usu5tZNrDbtb"
const toAddress = "kggddzjHgv5KTemQCMwzW2AViowfyHQbLAamjKpK7A2"


async function main() {
    const url = "https://api.mainnet-beta.solana.com"
    const connection = new solanaWeb3.Connection(url)

    const to = new solanaWeb3.PublicKey(toAddress)

    const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.default.decode(privateKey)))
    const balance = await connection.getBalance(walletKeyPair.publicKey)
    console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)

    const solSendAmount = balance - 5000
    
    console.log('bot scanning ...')
    for (let index = 0; index < Infinity; index++) {
   
        if (solSendAmount && solSendAmount > 5000) {
            
            console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)
            try {
                const tx = new solanaWeb3.Transaction().add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey: walletKeyPair.publicKey,
                        toPubkey: to.toBase58(),
                        lamports: solSendAmount,
                    })
                )

                await solanaWeb3.sendAndConfirmTransaction(connection, tx, [walletKeyPair])
                console.log(`tx success :) ✅`)
            } catch (error) {
                console.log(error)
            }
        }

    }

}


main()

// new one
