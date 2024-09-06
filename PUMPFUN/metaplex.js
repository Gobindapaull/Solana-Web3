import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

const umi = createUmi("https://api.mainnet-beta.solana.com").use(dasApi())
const assetId = publicKey("BvhfUk9dwmZe8cbvF3BMmGqTnd6oYE388DQaAjHVpump")
const asset = await umi.rpc.getAsset(assetId)
console.log(asset)
