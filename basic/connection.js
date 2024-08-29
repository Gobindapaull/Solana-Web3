const {
    Keypair,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Connection,
    clusterApiUrl
} = require("@solana/web3.js")

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed")

const main = async () => {
    // slot number
    const slot = await connection.getSlot()
    console.log(`slot: ${slot}`)

    // blocktime
    const blocktime = await connection.getBlockTime(slot)
    const d = new Date(blocktime * 1000)
    const utc = d.toUTCString()
    const date = utc.slice(-12, -4)
    console.log(`blocktime: ${date} UTC`)

    // slot leader
    const leader = await connection.getSlotLeader()
    console.log(`Slot Leader : ${leader}`)

    // total supply
    const supply = await connection.getSupply()
    console.log(`Total supply of SOL : ${supply.value.total / 1e9}`)

    // generate keypair
    const account = Keypair.generate()
    console.log(`account: ${account.publicKey.toBase58()}`)
    console.log(account.secretKey)
}

main()
