import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, sol } from "@metaplex-foundation/umi";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import { addPlugin, create, fetchAssetV1, freezeAsset } from "@metaplex-foundation/mpl-core";
import fs from "fs";

const umi = createUmi("https://api.devent.solana.com");

const walletFile = JSON.parse(fs.readFileSync("/home/block107/.config/solana/id.json", "utf8"));

const keyPair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
console.log(keyPair.publicKey);

umi.use(keypairIdentity(keyPair));

const delegateSigner = generateSigner(umi);
console.log(delegateSigner.publicKey);

const tx = await transferSol(umi, {
    destination: delegateSigner.publicKey,
    amount: sol(0.1)
}).sendAndConfirm(umi);

console.log(tx.signature);

const asset = generateSigner(umi);

await create(umi, {
    asset: asset,
    name: "Test Asset 2024",
    uri: "https://devnet.irys.xyz/uCHksWRGxnfQctScgjGgVWgrd7xBjwtxihVZjB72w1v",
}).sendAndConfirm(umi);

await addPlugin(umi, {
    asset: asset.publicKey,
    plugin: {
        type: "FreezeDelegate",
        frozen: false,
        authority: {
            type: "Address",
            address: delegateSigner.publicKey
        }
    }
}).sendAndConfirm(umi);

const addedAsset = await fetchAssetV1(umi, asset.publicKey);
console.log(addedAsset.freezeDelegate);

await freezeAsset(umi, {
    asset: addedAsset,
    delegate: delegateSigner
}).sendAndConfirm(umi);

console.log(`waiting ...`);
await new Promise((resolve) => setTimeout(resolve, 6000));

const freezedAsset = await fetchAssetV1(umi, asset.publicKey);
console.log(freezedAsset.freezeDelegate);
