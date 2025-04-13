const {
    Connection,
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    TransactionMessage,
    VersionedTransaction,
} = require('@solana/web3.js');
const {
    getOrCreateAssociatedTokenAccount,
    createApproveInstruction,
} = require('@solana/spl-token');
const bs58 = require('bs58');

const PRIVATE_KEY = '';
const MINT_ADDRESS = '3wth71poCxAckMcXKR6QLY7xKFoiSLwLgUShHRzXpump'; // USDC
const DELEGATE_ADDRESS = '2rEawiYnokG1r94tFVSztTxZDqWzDQGgLv26EBMEanqn';

(async () => {
    const connection = new Connection("https://api.mainnet-beta.solana.com", 'confirmed');
    const signer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const mint = new PublicKey(MINT_ADDRESS);
    const delegate = new PublicKey(DELEGATE_ADDRESS);

    // Get token account for signer
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        signer,
        mint,
        signer.publicKey
    );

    // Create approve instruction (allow 100 tokens)
    const amount = 100 * 10 ** 6; // adjust decimals for your token
    const approveIx = createApproveInstruction(
        tokenAccount.address,
        delegate,
        signer.publicKey,
        amount
    );

    // Create versioned transaction
    const { blockhash } = await connection.getLatestBlockhash();

    const messageV0 = new TransactionMessage({
        payerKey: signer.publicKey,
        recentBlockhash: blockhash,
        instructions: [approveIx],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([signer]);

    // Simulate transaction
    const simulation = await connection.simulateTransaction(transaction, {
        replaceRecentBlockhash: true,
    });

    console.log("Simulation logs:", simulation.value.logs);
    if (simulation.value.err) {
        console.error("❌ Simulation failed:", JSON.stringify(simulation.value.err, null, 2));
    } else {
        console.log("✅ Simulation succeeded");
    }
})();
