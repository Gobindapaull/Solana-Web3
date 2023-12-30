const web3 = require("@solana/web3.js")
let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed")

const sol = async () => {
    let slot = await connection.getSlot()
    console.log(`slot ${slot}`)

    let slotLeader = await connection.getSlotLeader(slot)
    console.log(`slot leader : ${slotLeader}`)

    let blockTime = await connection.getBlockTime(slot)
    console.log(`block time : ${blockTime}`)

    let version = await connection.getVersion()
    console.log(`version : ${version["solana-core"]}`)

}

sol()
