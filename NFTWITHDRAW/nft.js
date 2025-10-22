// save as withdraw_nfts.js
const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const bs58 = require('bs58');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TO_ADDRESS = process.env.TO_ADDRESS;
const RPC_URL = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';

if (!PRIVATE_KEY || !TO_ADDRESS) {
  console.error('❌ Set PRIVATE_KEY and TO_ADDRESS in your .env');
  process.exit(1);
}

const TOKEN_2022_PROGRAM_ID = new solanaWeb3.PublicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' // official Token-2022 program
);

async function main() {
  const connection = new solanaWeb3.Connection(RPC_URL, 'confirmed');
  const walletKeyPair = solanaWeb3.Keypair.fromSecretKey(
    new Uint8Array(bs58.default.decode(PRIVATE_KEY))
  );
  const ownerPubkey = walletKeyPair.publicKey;
  const toPubkey = new solanaWeb3.PublicKey(TO_ADDRESS);

  console.log('🔍 Monitoring NFT wallet:', ownerPubkey.toBase58());

  while (true) {
    try {
      // fetch token accounts for both legacy SPL and Token-2022, then combine
      const [legacyRes, t2022Res] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(ownerPubkey, {
          programId: splToken.TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(ownerPubkey, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ]);

      const combined = [...legacyRes.value, ...t2022Res.value];

      // dedupe by pubkey
      const seen = new Set();
      const tokenAccounts = [];
      for (const acc of combined) {
        const pk = acc.pubkey.toString();
        if (!seen.has(pk)) {
          seen.add(pk);
          tokenAccounts.push(acc);
        }
      }

      if (tokenAccounts.length === 0) {
        console.log('❌ No token accounts found.');
      }

      let foundAny = false;
      for (const tokenAccountInfo of tokenAccounts) {
        const accountData = tokenAccountInfo.account.data.parsed.info;
        const mintAddress = accountData.mint;
        const amount = Number(accountData.tokenAmount.amount || 0);
        const decimals = Number(accountData.tokenAmount.decimals || 0);
        const program = tokenAccountInfo.account.owner?.toString?.() || 'unknown';
        // print summary for debugging
        console.log({
          mint: mintAddress,
          amount,
          decimals,
          program,
          extensions: accountData.extensions || null,
          owner: accountData.owner,
        });

        // identify NFT (1 token, 0 decimals)
        if (amount === 1 && decimals === 0) {
          foundAny = true;
          console.log(`\n🖼️ Found NFT mint ${mintAddress} — preparing transfer...`);

          // detect transferHook extension (Token-2022 NFTs often have this)
          const hasTransferHook = Array.isArray(accountData.extensions)
            && accountData.extensions.some((e) => e.extension === 'transferHookAccount');

          if (hasTransferHook) {
            console.warn('⚠️ This NFT has a transferHookAccount extension — direct transfer likely blocked by hook. Skipping.');
            console.warn('If you control the hook program or have special instructions, we can attempt a hook-enabled transfer (needs extra data).');
            continue;
          }

          // figure which program this account belongs to so we pass correct programId to spl-token helpers
          const isToken2022 = program === TOKEN_2022_PROGRAM_ID.toBase58();

          const mintPubkey = new solanaWeb3.PublicKey(mintAddress);
          const sourceTokenAccount = tokenAccountInfo.pubkey; // string/publickey

          // create/get destination ATA with correct program id when needed
          let destAccount;
          try {
            if (isToken2022) {
              destAccount = await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                walletKeyPair,
                mintPubkey,
                toPubkey,
                false, // allowOwnerOffCurve
                'confirmed',
                undefined, // payer
                TOKEN_2022_PROGRAM_ID // pass program id for Token-2022
              );
            } else {
              destAccount = await splToken.getOrCreateAssociatedTokenAccount(
                connection,
                walletKeyPair,
                mintPubkey,
                toPubkey
              );
            }
          } catch (createErr) {
            console.error('❌ Failed creating/getting destination ATA:', createErr);
            // continue to next token
            continue;
          }

          // transfer: pass program id for Token-2022
          try {
            let sig;
            if (isToken2022) {
              sig = await splToken.transfer(
                connection,
                walletKeyPair,
                sourceTokenAccount,
                destAccount.address,
                ownerPubkey,
                1,
                [], // multiSigners
                undefined, // confirmOptions
                TOKEN_2022_PROGRAM_ID
              );
            } else {
              sig = await splToken.transfer(
                connection,
                walletKeyPair,
                sourceTokenAccount,
                destAccount.address,
                ownerPubkey,
                1
              );
            }

            console.log(`✅ NFT Transfer Success! TX: https://solscan.io/tx/${sig}`);
          } catch (transferErr) {
            console.error('⚠️ Transfer failed. Full error object:');
            console.error(transferErr);
            // If transfer fails, show the RPC error/message in readable form
            if (transferErr?.message) console.error('message:', transferErr.message);
            if (transferErr?.logs) console.error('program logs:', transferErr.logs);
            // continue to next token
            continue;
          }
        }
      } // end for loop

      if (!foundAny) console.log('❌ No NFTs found in this check.');

      await new Promise((r) => setTimeout(r, 3000));
    } catch (e) {
      console.error('⚠️ Error (outer):', e);
      // print full object
      console.error(e && typeof e === 'object' ? JSON.stringify(e, Object.getOwnPropertyNames(e), 2) : e);
      await new Promise((r) => setTimeout(r, 3000));
    }
  } // end while
}

main().catch((e) => {
  console.error('Fatal error:', e);
});
