const solanaWeb3 = require("@solana/web3.js")

async function main() {
    const url = "https://api.devnet.solana.com"
    const connection = new solanaWeb3.Connection(url)

    const wallet = solanaWeb3.Keypair.generate()
    console.log(wallet.publicKey)
    console.log(wallet.secretKey)
}

for (let i = 0; i < 1000; i++) {
    main()
}
