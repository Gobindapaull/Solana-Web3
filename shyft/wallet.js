const { ShyftSdk, Network } = require("@shyft-to/js");

const shyft = new ShyftSdk({
    apiKey: "",
    network: Network.Mainnet
});

const owner = "";

const main = async () => {
    // wallet balance
    const balance = await shyft.wallet.getBalance({wallet: owner});
    console.log(balance);

    // send sol
    // const tx = await shyft.wallet.sendSol({
    //     // network: Network.Mainnet,
    //     fromAddress: "",
    //     toAddress: "",
    //     amount: 0.001
    // });
    

    // token balance
    const tokenBalance = await shyft.wallet.getAllTokenBalance({
        network: Network.Mainnet,
        wallet: owner,
    });
    console.log(tokenBalance);
    console.log(`total tokens number : ${tokenBalance.length}`);

    // transaction
    // const txHistory = await shyft.wallet.transaction({
    //     network: Network.Mainnet,
    //     txnSignature: ""
    // });
    // console.log(txHistory);

}

main();
