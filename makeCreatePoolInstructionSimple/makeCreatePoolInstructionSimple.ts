import { Clmm, MAINNET_PROGRAM_ID, TxVersion } from "@raydium-io/raydium-sdk";
import { Connection, PublicKey, Keypair, clusterApiUrl } from "@solana/web3.js";
import { getMint, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import Decimal from "decimal.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
const wallet = Keypair.generate();
console.log(`Wallet address: ${wallet.publicKey.toBase58()}`);

async function createClmmPool() {
  const mintAKey = new PublicKey("So11111111111111111111111111111111111111112"); // WSOL
  const mintBKey = new PublicKey("4NGbC4RRrUjS78ooSN53Up7gSg4dGrj6F6dxpMWHbonk"); // Example token

  const mintAInfo = await getMint(connection, mintAKey, "confirmed", TOKEN_PROGRAM_ID);
  const mintBInfo = await getMint(connection, mintBKey, "confirmed", TOKEN_PROGRAM_ID);

  // CLMM config

  // ✅ Define a valid CLMM config object
  const ammConfig = {
    id: new PublicKey("9iFER3bpjf1PTTCQCfTRu17EJgvsxo9pVyA9QWwEuX4x"),
    index: 1,
    protocolFeeRate: 0,
    tradeFeeRate: 3000,
    tickSpacing: 64,
    fundFeeRate: 0,
    description: "Test Pool Config",
  };

  const initialPrice = new Decimal(1000); // 1 WSOL = 1000 token

  const result = await Clmm.makeCreatePoolInstructionSimple({
    makeTxVersion: TxVersion.LEGACY,
    connection,
    programId: MAINNET_PROGRAM_ID.CLMM,
    owner: wallet.publicKey,
    payer: wallet.publicKey,
    mint1: {
      mint: mintAKey,
      decimals: mintAInfo.decimals,
      programId: TOKEN_PROGRAM_ID,
    },
    mint2: {
      mint: mintBKey,
      decimals: mintBInfo.decimals,
      programId: TOKEN_PROGRAM_ID,
    },
    ammConfig, // ✅ required now
    initialPrice,
    startTime: new BN(Math.floor(Date.now() / 1000)),
  });

  console.log("✅ Pool Address Info:", result.address);
  console.log("✅ Pool ID:", result.address.poolId.toBase58());
  console.log("✅ Transactions:", result.innerTransactions);
}

createClmmPool().catch(console.error);
