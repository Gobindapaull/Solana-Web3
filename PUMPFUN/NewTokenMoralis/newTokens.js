require("dotenv").config();

async function newTokens() {
    const response = await fetch(process.env.RPC_URL, {
        headers: {
            accept: "application/json",
            "X-API-key": process.env.API_KEY
        }
    });
    const data = await response.json();
    data.result.forEach((token) => {
        console.log(`Token Name: ${token.name}\n${new Date(token.createdAt)}\n`);
        console.log(`Solscan url: https://solscan.io/token/`)
        console.log(`Pump fun url: https://pump.fun/coin/${token.tokenAddress}`)
        console.log(`-----------------------------------------\n-----------------------------------------------\n`)
    })
}

newTokens();
