require("dotenv").config();

const API_KEY = process.env.EYE_BIRD_API_KEY;
const seen = new Set();

async function watchNewListings() {
    try {
        const response = await fetch(process.env.BIRD_EYE_URL_NEW_LISTING, {
            headers: {
                "X-API-KEY": API_KEY,
                "x-chain": "solana",
                "accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }

        const { data } = await response.json();

        data.items.forEach((token) => {
            // Skip if we've already seen this token
            if (seen.has(token.address)) return;

            // Mark as seen
            seen.add(token.address);

            const listedAt = token.liquidityAddedAt
                ? new Date(token.liquidityAddedAt).toLocaleString()
                : "N/A";

            console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NEW TOKEN DETECTED

🪙  Symbol      : ${token.symbol}
📛  Name        : ${token.name}
📍  Address     : ${token.address}
🔢  Decimals    : ${token.decimals}
💧  Liquidity   : ${token.liquidity?.toLocaleString() ?? "N/A"}
🕒  Listed At   : ${listedAt}
🖼️  Logo        : ${token.logoURI ?? "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
        });

    } catch (err) {
        console.error(err.message);
    }
}

// First check
watchNewListings();

// Check every 5 seconds
setInterval(watchNewListings, 5000);
