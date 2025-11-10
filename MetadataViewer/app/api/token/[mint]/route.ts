import { NextResponse } from "next/server";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  mplTokenMetadata,
  findMetadataPda,
  fetchMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi-public-keys";

export async function GET(
  req: Request,
  context: { params: Promise<{ mint: string }> } // ✅ new typing for async params
) {
  try {
    // ✅ unwrap params first
    const { mint } = await context.params;

    const umi = createUmi("https://api.mainnet-beta.solana.com")
      .use(mplToolbox())
      .use(mplTokenMetadata());

    const mintKey = publicKey(mint);
    const metadataPda = findMetadataPda(umi, { mint: mintKey });
    const metadata = await fetchMetadata(umi, metadataPda);

    const uri = metadata.uri;
    const response = await fetch(uri);
    const json = await response.json();

    return NextResponse.json({
      name: json.name || metadata.name,
      symbol: json.symbol || metadata.symbol,
      image: json.image || null,
      description: json.description || "",
    });
  } catch (err: any) {
    console.error("Metadata fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
