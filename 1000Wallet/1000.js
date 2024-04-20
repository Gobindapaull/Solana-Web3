const { Keypair, PublicKey } = require("@solana/web3.js") // "@solana/web3.js": "^1.91.7",

// solana single wallet address
console.log(Keypair.generate().publicKey.toBase58())

// generate 1000 wallets

const wallets = [];
for (let i = 0; i < 700; i++) {
    wallets.push( Keypair.generate());
    console.log(wallets[i].publicKey.toBase58())
}
