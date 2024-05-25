import requests
import pandas as pd

def fetch_wallet(address):
    url = "https://api.mainnet-beta.solana.com"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            address,
            {
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
                "encoding": "jsonParsed"
            }]
        }
    
    response = requests.post(url, json=payload, headers=headers)
    response_data = response.json()

    mint_addresses = []
    amounts = []

    if 'result' in response_data and 'value' in response_data['result']:
        for item in response_data['result']['value']:
            mint_address = item['account']['data']['parsed']['info']['mint']
            balance = item['account']['data']['parsed']['info']['tokenAmount']['uiAmount']
            if balance > 0:
                mint_addresses.append(mint_address)
                amounts.append(f"{balance:.9f}")

    df = pd.DataFrame({'Mint Address ' : mint_addresses, 'Amount ' : amounts})

    return df


address = "GarWUNUsUuGta5ooYacgKYdTDjrgKyDthmmAfMTLQf47"
dataFrame = fetch_wallet(address)
print(dataFrame)
