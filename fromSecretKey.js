const { Keypair } = require("@solana/web3.js");
let account = Keypair.generate();

console.log(account.publicKey.toBase58());
console.log(account.secretKey);


let accountFromSecret = Keypair.fromSecretKey(account.secretKey);

console.log(accountFromSecret.publicKey.toBase58());
console.log(accountFromSecret.secretKey);
