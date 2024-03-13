import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenContract } from "../target/types/token_contract";
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction
} from '@solana/spl-token';
import { associated } from "@coral-xyz/anchor/dist/cjs/utils/pubkey";
import { assert } from "chai";

describe("token-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TokenContract as Program<TokenContract>;
  const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
  let associatedTokenAccount = undefined;

  it("Mint a token", async () => {
    const key = anchor.AnchorProvider.env().wallet.publicKey;
    const lamports: number = await program.provider.connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    associatedTokenAccount = await getAssociatedTokenAddress(
      mintKey.publicKey,
      key
    );

    const mint_tx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.createAccount(
        {
          fromPubKey: key,
          newAccountPubKey: mintKey.publicKey,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
          lamports
        }
      ),

      createInitializeMintInstruction(
        mintKey.publicKey,
        0,
        key,
        key
      ),
      createAssociatedTokenAccountInstruction(
        key,
        associatedTokenAccount,
        key,
        mintKey.publicKey
      ),
    );

        const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, [mintKey]);

        console.log(await program.provider.connection.getParsedAccountInfo(mintKey.publicKey));
        console.log(`account ${res}`)
        console.log(`mint key : ${mintKey.publicKey.toString()}`)
        console.log(`User : ${key.toString()}`)

        const tx = await program.methods.mintToken().accounts({
          mint: mintKey.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          tokenAccount : associatedTokenAccount,
          payer: key,
        }).rpc();
        console.log(`your tx signature : ${tx}`)

        const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
        assert.equal(minted, 10);

  });


  it("transfer token", async () => {
    const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const toATA = await getAssociatedTokenAddress(
      mintKey.publicKey,
      toWallet.publicKey
    );
    const mint_tx = new anchor.web3.Transaction.add(
      createAssociatedTokenAccountInstruction(
        myWallet,
        toATA,
        toWallet.publicKey,
        mintKey.publicKey
      )
    );

    const res = await anchor.AnchorProvider.env().sendAndConfirm(mint_tx, []);
    console.log(res);

    const tx = await program.methods.transferToken().accounts({
      tokenProgram: TOKEN_PROGRAM_ID,
      from: associatedTokenAccount,
      signer: myWallet,
      to: toATA
    }).rpc();
    console.log(`your transaction signature : ${tx}`)
    const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAccount.amount;
    assert.equal(minted, 5);
  })
});
