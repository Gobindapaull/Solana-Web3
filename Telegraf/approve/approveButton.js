require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const {
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} = require('@solana/web3.js');
const {
  getOrCreateAssociatedTokenAccount,
  createApproveInstruction,
} = require('@solana/spl-token');
const bs58 = require('bs58');

// === ENV SETUP ===
const bot = new Telegraf(process.env.BOT_TOKEN);
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MINT_ADDRESS = process.env.MINT_ADDRESS;
const DELEGATE_ADDRESS = process.env.DELEGATE_ADDRESS;

// === SETUP CONNECTION & WALLET ===
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
const signer = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const mint = new PublicKey(MINT_ADDRESS);
const delegate = new PublicKey(DELEGATE_ADDRESS);
const tokenName = 'USDT';
const amount = 100;       

// === /simulate COMMAND ===
bot.command('approve', async (ctx) => {
  const userWallet = signer.publicKey.toBase58();

  const message = `🪙 *Token Approval Request*\n\n` +
    `You are about to approve:\n\n` +
    `✅ *Token:* ${tokenName}\n` +
    `💳 *Amount:* ${amount}\n` +
    `👤 *Delegate:* \`${delegate.toBase58().slice(0, 6)}...${delegate.toBase58().slice(-3)}\`\n` +
    `🔐 *From Wallet:* \`${userWallet.slice(0, 6)}...${userWallet.slice(-3)}\`\n\n` +
    `Would you like to simulate this?`;

  await ctx.reply(message, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard([
      Markup.button.callback('🔍 Approval', 'simulate_approval')
    ])
  });
});

// === BUTTON HANDLER ===
bot.action('simulate_approval', async (ctx) => {
  await ctx.answerCbQuery(); // acknowledge click

  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      mint,
      signer.publicKey
    );

    const approveIx = createApproveInstruction(
      tokenAccount.address,
      delegate,
      signer.publicKey,
      amount * 10 ** 6 // adjust for decimals (6 for USDC)
    );

    const { blockhash } = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
      payerKey: signer.publicKey,
      recentBlockhash: blockhash,
      instructions: [approveIx],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([signer]);

    const simulation = await connection.simulateTransaction(transaction, {
      replaceRecentBlockhash: true,
    });

    if (simulation.value.err) {
      await ctx.reply(`❌ Simulation failed:\n${JSON.stringify(simulation.value.err, null, 2)}`);
    } else {
      await ctx.reply('✅ Simulation succeeded!\nLogs:\n' + simulation.value.logs.join('\n'));
    }
  } catch (err) {
    console.error(err);
    await ctx.reply('⚠️ Error during simulation:\n' + err.message);
  }
});

bot.launch();
console.log('🤖 Bot is running...');
