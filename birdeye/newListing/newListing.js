require("dotenv").config();

const API_KEY = process.env.EYE_BIRD_API_KEY;

async function newListing() {
    try {
        const url = process.env.BIRD_EYE_URL_NEW_LISTING;

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
        console.log(`Found ${data.data.items.length} new listings\n`);
        console.log(JSON.stringify(data.data.items[0], null, 2));

        // filter data
        data.data.items.forEach((token, index) => {
            console.log(`
==================== Token #${index + 1} ====================

Symbol        : ${token.symbol}
Name          : ${token.name}
Address       : ${token.address}
Decimals      : ${token.decimals}
Listed At     : ${new Date(token.liquidityAddedAt).toLocaleString()}
Logo          : ${token.logoURI}
Liquidity     : ${token.liquidity}

==============================================================
`);
        });



    } catch (error) {
        console.log(error);
    }
}

newListing()
