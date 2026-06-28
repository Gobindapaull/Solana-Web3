const WebSocket = require("ws");
const { AccountLayout } = require("@solana/spl-token");
const { PublicKey } = require("@solana/web3.js");

const ws = new WebSocket("wss://api.mainnet-beta.solana.com");

ws.on("open", () => {
    console.log("✅ Connected");

    ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "programSubscribe",
        params: [
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            {
                encoding: "base64",
                commitment: "processed"
            }
        ]
    }));
});

ws.on("message", (data) => {
    const msg = JSON.parse(data);

    // Ignore subscription confirmation
    if (!msg.params) return;

    const account = msg.params.result.value.account;

    // Decode only token accounts (165 bytes)
    if (account.space !== 165) return;

    const buffer = Buffer.from(account.data[0], "base64");

    const decoded = AccountLayout.decode(buffer);


    console.log({
        pubkey: msg.params.result.value.pubkey,
        mint: new PublicKey(decoded.mint).toBase58(),
        owner: new PublicKey(decoded.owner).toBase58(),
        amount: decoded.amount.toString(),
        lamports: account.lamports,
    });
});

ws.on("error", console.error);
