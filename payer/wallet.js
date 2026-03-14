const {
  createKeyPairSignerFromBytes
} = require("gill");

const fs = require("fs");

const main = async () => {

  const secret = JSON.parse(fs.readFileSync("./payer.json", "utf8"));
  const payer = await createKeyPairSignerFromBytes(new Uint8Array(secret));

  console.log(`Wallet address: ${payer.address}`);

};

main();
