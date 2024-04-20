const solanaWeb3 = require("@solana/web3.js") // ✔
const {Token, TOKEN_PROGRAM_ID} = require("@solana/spl-token")
const bs58 = require("bs58")


// wallet private key
const privateKey = "";

async function airdropToWallets() {

    const connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com', 'confirmed'); // ✔
    const tokenMintAddress = new solanaWeb3.PublicKey('3itPgs45ZG4vAXnXGNk4jnieXfTPtjzyJqZsjhxurvAy'); // ✔
    // console.log(tokenMintAddress.toBase58()) // ✔
    const senderPublicKey = ''; // ✔

    const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(
        new Uint8Array(bs58.decode(privateKey))
      );

    console.log(`Owner wallet : ${walletKeyPair.publicKey.toBase58()}`)

    // Generate 700 wallets
    const wallets = [];
    for (let i = 0; i < 700; i++) {
        wallets.push( solanaWeb3.Keypair.generate()); // ✔
        // console.log(wallets[i].publicKey.toBase58())
    }

    // Perform airdrop to each wallet
     for (const wallet of wallets) {
        
        const amount = 10;
        // Construct token transfer transaction
        const transaction = new solanaWeb3.Transaction().add(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                new solanaWeb3.PublicKey(senderPublicKey), // Sender public key
                new solanaWeb3.PublicKey(wallet.publicKey), // Recipient public key
                walletKeyPair.publicKey, // owner public key
                amount // Amount of tokens to send
            )
        );

        // Sign transaction
        transaction.feePayer = new PublicKey(senderPublicKey);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(wallet);

        // Send transaction
        const signature = await connection.sendTransaction(transaction);
        console.log(`Airdrop to ${wallet.publicKey} successful. Transaction signature: ${signature}`);
    }
}

airdropToWallets().then(() => {
    console.log('Airdrop completed successfully.');
}).catch((error) => {
    console.error('Airdrop failed:', error);
});
