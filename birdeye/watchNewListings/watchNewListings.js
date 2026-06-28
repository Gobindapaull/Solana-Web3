require("dotenv").config();
const seen = new Set();

async function watchNewListings() {
    const response = await fetch(process.env.BIRD_EYE_URL_NEW_LISTING, {
        headers: {
            "X-API-KEY": process.env.EYE_BIRD_API_KEY,
            "x-chain": "solana",
            "accept": "application/json",
        },
    });

    const { data } = await response.json();

    for (const token of data.items) {
        if (!seen.has(token.address)) {
            seen.add(token.address);

            console.log(`🚀 NEW TOKEN: ${token.symbol} (${token.address})`);
        }
    }
}

watchNewListings();
setInterval(watchNewListings, 5000);
