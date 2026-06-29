// Call InitializeMint or InitializeMint2 on the Token Program

const WebSocket = require("ws");

const ws = new WebSocket("wss://api.mainnet-beta.solana.com");

const TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

ws.on("open", () => {
    console.log("✅ Connected");

    ws.send(JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "logsSubscribe",
        params: [
            {
                mentions: [TOKEN_PROGRAM]
            },
            {
                commitment: "confirmed"
            }
        ]
    }));
});

ws.on("message", (data) => {
    const msg = JSON.parse(data);

    // Ignore subscription confirmation
    if (msg.method !== "logsNotification") return;

    const { logs, signature } = msg.params.result.value;

    if (
        logs.some(log => log.includes("Instruction: InitializeMint")) ||
        logs.some(log => log.includes("Instruction: InitializeMint2"))
    ) {
        console.log(`
╔══════════════════════════════════════╗
║        🎉 NEW SPL TOKEN FOUND        ║
╚══════════════════════════════════════╝
📝 Signature : ${signature}
⏰ Time      : ${new Date().toLocaleTimeString()}
`);
    }
});

ws.on("error", console.error);
