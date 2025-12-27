# 🎁 Gift Scenario - cURL Examples

## Gift Scenario: Aap Pay Karein, Kisi Aur Ke Address Pe Name Assign

### Example 1: Complete Gift Scenario

```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "giftname123",
    "privateKey": "RECIPIENT_PRIVATE_KEY",
    "payerPrivateKey": "YOUR_PRIVATE_KEY",
    "ownerAddress": "RECIPIENT_WALLET_ADDRESS"
  }'
```

### Example 2: With Real Format (Base58 Keys)

```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "giftname123",
    "privateKey": "2HcA3h9fmeD51GDYEJgM4br8Y19pyJ5qP5q7xRnazikhaS43qTk8nF8eiVRNQJXLyP2wjjX4vjrKbrTA8iEqxbzY",
    "payerPrivateKey": "YOUR_PAYER_PRIVATE_KEY_BASE58",
    "ownerAddress": "GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY"
  }'
```

### Example 3: Minimal (Only Payer and Owner Address)

```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "giftname123",
    "privateKey": "YOUR_PAYER_PRIVATE_KEY",
    "ownerAddress": "RECIPIENT_WALLET_ADDRESS"
  }'
```

## Parameters Explained

- **`name`**: SNS name jo buy karna hai (e.g., "giftname123")
- **`privateKey`**: Owner ka private key (recipient ka)
- **`payerPrivateKey`**: Aapka private key (jo pay karega) - **Optional**
- **`ownerAddress`**: Recipient ka wallet address (jis address pe name assign hoga)

## Response Example

```json
{
  "success": true,
  "message": "SNS name purchase initiated",
  "data": {
    "name": "giftname123",
    "nameAccount": "5ngKhX24Nb3aisHiYesZNypyPmd1ZHMPZX8X6orutATT",
    "payerAddress": "YOUR_WALLET_ADDRESS",
    "ownerAddress": "RECIPIENT_WALLET_ADDRESS",
    "isDifferentOwner": true,
    "transactionSignature": "4e3BV4RyQZDiDdM8YW4tfMpemKYjakk9mDvMDjd4jVRQzm3aq2Dsfck27UL9cy3yA8w1LzdnhX7Eyd3NqzTGfuZM",
    "network": "testnet",
    "explorerUrl": "https://solscan.io/tx/...?cluster=testnet",
    "payerExplorerUrl": "https://solscan.io/account/YOUR_WALLET?cluster=testnet",
    "ownerExplorerUrl": "https://solscan.io/account/RECIPIENT_WALLET?cluster=testnet"
  }
}
```

## Real-World Example

```bash
# Aap gift de rahe hain apne friend ko
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "friendname",
    "privateKey": "YOUR_PRIVATE_KEY_BASE58",
    "ownerAddress": "FriendWalletAddress1234567890ABCDEF"
  }'
```

**Note:** 
- `payerPrivateKey` optional hai - agar nahi diya to `privateKey` se hi pay hoga
- `ownerAddress` required hai agar aap kisi aur ko name assign karna chahte hain
- Payer wallet mein sufficient SOL balance hona chahiye

## Testnet Example

```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testgift",
    "privateKey": "YOUR_TESTNET_PRIVATE_KEY",
    "ownerAddress": "RECIPIENT_TESTNET_ADDRESS"
  }'
```

## Mainnet Example

```bash
curl -X POST https://your-api-url.com/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "realgift",
    "privateKey": "YOUR_MAINNET_PRIVATE_KEY",
    "payerPrivateKey": "YOUR_PAYER_MAINNET_KEY",
    "ownerAddress": "RECIPIENT_MAINNET_ADDRESS"
  }'
```

