const main = async () => {
    try {
        // private key 
        const privateKey = Uint8Array.from([]);
        console.log("Private key:", Buffer.from(privateKey).toString('base64'));

    } catch (error) {
        console.log(error);
    }
}

main();

