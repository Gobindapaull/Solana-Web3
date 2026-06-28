- Solana token sniper

- A lower-latency approach is to monitor:
- Solana RPC WebSockets (logsSubscribe / programSubscribe)
- DEX program events (Raydium, Pump.fun, Meteora)
- Transaction logs for liquidity additions


- websocket connection
- npm install ws
- method: ["logsSubscribe", "programSubscribe"]
- logsSubscribe on the launchpad or DEX program you're targeting (Pump.fun, Raydium).
- Look for instructions like InitializeMint, pool creation, or liquidity addition.
- Fetch and decode only those transactions.



- Bird Eye API > https://docs.birdeye.so/reference/
- 



- [Rug Check]
- Minimum liquidity > 5000$
- Minimum holder count > 1000
- Volume
- Token age
- Market cap
