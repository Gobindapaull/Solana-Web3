use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig,
    signature::{read_keypair_file, Signer},
    system_instruction,
    transaction::Transaction,
    pubkey::Pubkey,
};
use std::{path::PathBuf, str::FromStr};

fn main() {
    // Connect to Solana Devnet
    let client = RpcClient::new_with_commitment(
        "https://api.devnet.solana.com".to_string(),
        CommitmentConfig::confirmed(),
    );

    // ✅ Change this to the actual path of your keypair file
    let path = PathBuf::from("/mnt/c/2025/tailwindcss/01/solanasdk/payer.json");

    // Load the payer's keypair
    let payer = read_keypair_file(path).expect("Failed to read keypair file");

    // 📥 Recipient's address
    let recipient = Pubkey::from_str("5Hh9fYQprMXB2QgPTp2Vv3UEsRftz3LK6fgFSikC75z7")
        .expect("Invalid recipient address");

    // 🪙 Instruction to transfer 1,000,000 lamports (0.001 SOL)
    let instruction = system_instruction::transfer(&payer.pubkey(), &recipient, 1_000_000);

    // 🧱 Fetch recent blockhash for the transaction
    let recent_blockhash = client.get_latest_blockhash().expect("Failed to get blockhash");

    // 🧾 Construct and sign the transaction
    let tx = Transaction::new_signed_with_payer(
        &[instruction],
        Some(&payer.pubkey()),
        &[&payer],
        recent_blockhash,
    );

    // 🚀 Send the transaction
    let signature = client
        .send_and_confirm_transaction(&tx)
        .expect("Failed to send transaction");

    println!("✅ Transaction sent successfully!");
    println!("🔗 Signature: {}", signature);
    println!(
        "🌐 View it on Solana Explorer:\nhttps://explorer.solana.com/tx/{}?cluster=devnet",
        signature
    );
}

