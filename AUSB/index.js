const solanaWeb3 = require('@solana/web3.js')
const bs58 = require('bs58')
require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY
const toAddress = process.env.TO_ADDRESS


async function main() {
    const url = "https://api.mainnet-beta.solana.com"
    const connection = new solanaWeb3.Connection(url)

    const to = new solanaWeb3.PublicKey(toAddress)

    const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)))
    const balance = await connection.getBalance(walletKeyPair.publicKey)
    // console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)

    const solSendAmount = balance - 5000

    for (let index = 0; index < Infinity; index++) {
        console.log(`Wallet Balance : ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`)
        if (solSendAmount > 5000) {
            console.log('bot scanning ...')
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
