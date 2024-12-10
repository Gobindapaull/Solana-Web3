const { getMint, mintTo, burn, TOKEN_PROGRAM_ID} = require("@solana/spl-token");
const { Connection, Keypair, PublicKey, clusterApiUrl } = require("@solana/web3.js");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"));

const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync("/home/block107/.config/solana/id.json"))));
const MINT_ADDRESS = new PublicKey("GyKwjx397ZMxjRNHTQbTGtX6hzA9AzJtmLjUH2nxQMpZ");
const ASSOCIATED_TOKEN_ADDRESS = new PublicKey("3xJYqCr3WYrajEvZNjwm2DuBJuVpyBXfdXHDwqYYVgnt");
const AMOUNT = 100;

const update = async () => {
    // fetch mint details
    const mint = await getMint(connection, MINT_ADDRESS);
    console.log(`Current Supply : ${mint.supply.toString()}`);

    // mint new tokens
    console.log(`Minting ${AMOUNT} tokens ...`);
    await mintTo(
        connection,
        payerKeypair,
        MINT_ADDRESS,
        ASSOCIATED_TOKEN_ADDRESS,
        payerKeypair,
        AMOUNT * (10 ** mint.decimals)
    );
    console.log(`Successfully minted ${AMOUNT} tokens.`);

}

update();
