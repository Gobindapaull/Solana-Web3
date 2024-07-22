import {
    Connection,
    clusterApiUrl,
    Keypair,
    PublicKey
} from "@solana/web3.js"

import bs58 from "bs58"

import {
    getAccount
} from "@solana/spl-token"

const bot = async () => {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed")

    const tokenAcc = new PublicKey("GQxc4rQvJh7qRGZxjMBxmbG7MGGotLzBYGEy1sNgu9yx")
    const tokenAccount = await getAccount(connection, tokenAcc);
    const tokenAmount = await connection.getTokenAccountBalance(tokenAccount.address);
    console.log(`Token account balance : ${tokenAmount.value.uiAmount}`)

}

bot()
