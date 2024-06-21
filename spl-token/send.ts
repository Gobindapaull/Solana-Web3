import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token"
import { clusterApiUrl, Connection, Keypair, ParsedAccountData, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
import bs58 from "bs58"

const secret = ""
const fromKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(secret)))

const connection = new Connection("https://rpc.ankr.com/solana")


const receiver = ""
const mintAddress = ""
const amount = 100

async function getNumberDecimals(mintAddress: string): Promise<number> {
    const info = await connection.getParsedAccountInfo(new PublicKey(mintAddress))
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number
    return result
}

async function sendTokens() {
    console.log(`source account [step 1]`)
    const sourceAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        new PublicKey(mintAddress),
        fromKeyPair.publicKey
    )
    console.log(`source Account : ${sourceAccount.address.toString()}`)

    console.log(`destination account [step 2]`)

    const destAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeyPair,
        new PublicKey(mintAddress),
        new PublicKey(receiver)
    )
    console.log(`destination Account : ${destAccount.address.toString()}`)

    const decimals = await getNumberDecimals(mintAddress)
    console.log(`No. of decimals : ${decimals}`)

    console.log(`creating and sending transaction ...`)

    const tx = new Transaction();
    tx.add(createTransferInstruction(
        sourceAccount.address,
        destAccount.address,
        fromKeyPair.publicKey,
        amount * Math.pow(10, 9)
    ))

    const latestBlockHash = await connection.getLatestBlockhash("confirmed")
    // console.log(latestBlockHash)
    tx.recentBlockhash =  await latestBlockHash.blockhash
    const signature = await sendAndConfirmTransaction(connection, tx, [fromKeyPair])
    console.log(`Tx Success ✅ \n tx hash : https://solscan.io/tx/${signature}`)
}

sendTokens()
