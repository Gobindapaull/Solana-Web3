import WebSocket from "ws"

const ws = new WebSocket("wss://pumpportal.fun/api/data")

ws.on('open', (open) => {
    let payload = {
        method: "subscribeNewToken"
    }
    ws.send(JSON.stringify(payload))

    payload = {
        method: "subscribeAccountTrade",
        keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"]
    }
    ws.send(JSON.stringify(payload))

    payload = {
        method: "subscribeTokenTrade",
        keys: ["91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p"]
    }
    ws.send(JSON.stringify(payload))

})

ws.on('message', (data) => {
    console.log(JSON.parse(data))
})
