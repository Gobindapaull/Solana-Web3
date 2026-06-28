require("dotenv").config();

const API_KEY = process.env.EYE_BIRD_API_KEY;

async function getTokens() {
    try {
        const url =
            "https://public-api.birdeye.so/defi/v3/token/list?sort_by=liquidity&sort_type=desc&limit=10";

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-API-KEY": API_KEY,
                "x-chain": "solana", // solana, ethereum, base, bsc
                "accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        // token list
        // console.log(data.data.items);

        // filter data
        data.data.items.forEach((token, index) => {
            console.log(`
==================== Token #${index + 1} ====================
Symbol      : ${token.symbol}
Name        : ${token.name}
Price       : $${token.price}
Address     : ${token.address}
Liquidity   : $${token.liquidity}
Market Cap  : $${token.market_cap}
24h Volume  : $${token.volume_24h_usd}
24h Change  : ${token.price_change_24h_percent}%
Buy 24h     : ${token.buy_24h}
Sell 24h    : ${token.sell_24h}
Holders     : ${token.holder}
==============================================================
`);
        });



    } catch (error) {
        console.log(error);
    }
}

getTokens()
