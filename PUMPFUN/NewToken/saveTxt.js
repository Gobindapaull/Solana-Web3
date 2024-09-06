import WebSocket from "ws"
const ws = new WebSocket("wss://pumpportal.fun/api/data")
import fs from "fs"

ws.on('open', (open) => {
    let payload = {
        method: "subscribeNewToken"
    }
    ws.send(JSON.stringify(payload))

})

ws.on('message', (data) => {
    const mint = JSON.parse(data)
    Object.keys(mint).map(key => {
        if (key == "mint") {
            const newPumpFunTokenAddress = mint[key]
            fs.writeFile("token.txt", newPumpFunTokenAddress, (err) => {
                if (err) throw err;
            })
            console.log(`New Pump Fun Token detected`)
            console.log(newPumpFunTokenAddress)
        }
    }
    )
})
