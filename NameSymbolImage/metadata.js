const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const { mplToolbox } = require("@metaplex-foundation/mpl-toolbox");
const { mplTokenMetadata, findMetadataPda, fetchMetadata } = require("@metaplex-foundation/mpl-token-metadata");
const { publicKey } = require("@metaplex-foundation/umi-public-keys");
require("dotenv").config();

const mintAddress = process.env.MINT_ADDRESS;

const NameSymbolImage = async () => {
  // 👇 Add mplToolbox before mplTokenMetadata
  const umi = createUmi("https://api.mainnet-beta.solana.com")
    .use(mplToolbox())
    .use(mplTokenMetadata());

  const mint = publicKey(mintAddress);

  // Derive PDA for token metadata
  const metadataPda = findMetadataPda(umi, { mint });

  // Fetch metadata from blockchain
  const metadata = await fetchMetadata(umi, metadataPda);

  console.log("✅ Metadata found:");
  console.log("Name:", metadata.name);
  console.log("Symbol:", metadata.symbol);
  console.log("URI:", metadata.uri);
}

NameSymbolImage();
