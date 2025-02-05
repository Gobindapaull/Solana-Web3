#!/bin/bash

while true; do
    echo "Starting Solana transfer at $(date)" >> solana_transfer.log
    solana withdraw-from-nonce-account 2rEawiYnokG1r94tFVSztTxZDqWzDQGgLv26EBMEanqn 9d1wmu6jpXEmXwPaZCABdESSyJ7HsM5HabNqZHyT93hK 0.001 --keypair payer.json >> solana_transfer.log 2>&1
    echo "Waiting 10 seconds..." >> solana_transfer.log
    sleep 10 # Wait for 10 seconds
done
