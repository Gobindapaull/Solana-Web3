const inputMint = 'So11111111111111111111111111111111111111112';
const outputMint = '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr';
const inputAmount = 1;
const slippage = 50;

const main = async () => {
    // Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage
    const jup = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${inputAmount*1e9}&slippageBps=${slippage}`);
    const quoteResponse = await jup.json();
    console.log(quoteResponse);
    console.log("Output Amount : ", quoteResponse["outAmount"] / 1e9);
}

main();
