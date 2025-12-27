# SNS Name Buyer Backend API

Simple and fast backend API for buying Solana Name Service (SNS) names on Solana blockchain.

## 🚀 Features

- ✅ Buy SNS names via REST API
- ✅ Check name availability before purchase
- ✅ Verify transaction status
- ✅ Verify name registration
- ✅ Check SOL balance
- ✅ Testnet and Mainnet support
- ✅ Multiple private key formats support
- ✅ Easy configuration
- ✅ Fast and lightweight

## 📦 Installation

```bash
# Install dependencies
npm install
```

## ⚙️ Configuration

1. Copy `env.example` to `.env`:
```bash
cp env.example .env
```

2. Edit `.env` file:
```env
# Network: 'testnet' or 'mainnet'
NETWORK=testnet

# RPC URLs (optional - defaults provided)
TESTNET_RPC_URL=https://api.testnet.solana.com
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com

# Server Port
PORT=3000
```

## 🎯 Usage

### Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start on `http://localhost:3000` (or your configured PORT).

## 📡 API Endpoints

### 1. Buy SNS Name

Purchase a new SNS name on Solana.

**Endpoint:** `POST /api/buy-sns-name`

**Request Body:**
```json
{
  "name": "myname",
  "privateKey": "YOUR_PRIVATE_KEY",
  "payerPrivateKey": "OPTIONAL_PAYER_KEY",  // Optional: Different wallet to pay fee
  "ownerAddress": "OPTIONAL_OWNER_ADDRESS"    // Optional: Different address to assign name
}
```

**Parameters:**
- `name` (required): SNS name to purchase
- `privateKey` (required): Private key for owner (if ownerAddress not provided)
- `payerPrivateKey` (optional): Private key of wallet that will pay the fee
- `ownerAddress` (optional): Solana address to assign the name to (different from payer)

**Private Key Formats Supported:**
- Base58 string (recommended): `"2HcA3h9fmeD51GDYEJgM4br8Y19pyJ5qP5q7xRnazikhaS43qTk8nF8eiVRNQJXLyP2wjjX4vjrKbrTA8iEqxbzY"`
- Array: `[1,2,3,...]`
- Comma-separated string: `"1,2,3,..."`
- JSON array string: `"[1,2,3,...]"`

**Use Cases:**
1. **Same payer and owner** (default):
   ```json
   {
     "name": "myname",
     "privateKey": "YOUR_KEY"
   }
   ```

2. **Different payer, same owner**:
   ```json
   {
     "name": "myname",
     "privateKey": "OWNER_KEY",
     "payerPrivateKey": "PAYER_KEY"
   }
   ```

3. **Different payer and owner**:
   ```json
   {
     "name": "myname",
     "privateKey": "OWNER_KEY",
     "payerPrivateKey": "PAYER_KEY",
     "ownerAddress": "DIFFERENT_OWNER_ADDRESS"
   }
   ```

**Response:**
```json
{
  "success": true,
  "message": "SNS name purchase initiated",
  "data": {
    "name": "myname",
    "nameAccount": "5ngKhX24Nb3aisHiYesZNypyPmd1ZHMPZX8X6orutATT",
    "payerAddress": "GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY",
    "ownerAddress": "GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY",
    "isDifferentOwner": false,
    "transactionSignature": "4e3BV4RyQZDiDdM8YW4tfMpemKYjakk9mDvMDjd4jVRQzm3aq2Dsfck27UL9cy3yA8w1LzdnhX7Eyd3NqzTGfuZM",
    "network": "testnet",
    "explorerUrl": "https://solscan.io/tx/...?cluster=testnet",
    "payerExplorerUrl": "https://solscan.io/account/...?cluster=testnet",
    "ownerExplorerUrl": "https://solscan.io/account/...?cluster=testnet"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Insufficient balance. Need at least 0.01 SOL, but you have 0.0000 SOL",
  "balance": "0.0000",
  "required": "0.01",
  "address": "GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY",
  "network": "testnet",
  "faucetUrl": "https://faucet.solana.com"
}
```

**cURL Examples:**

**Example 1: Same payer and owner (default)**
```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "myname",
    "privateKey": "2HcA3h9fmeD51GDYEJgM4br8Y19pyJ5qP5q7xRnazikhaS43qTk8nF8eiVRNQJXLyP2wjjX4vjrKbrTA8iEqxbzY"
  }'
```

**Example 2: Different payer (company pays, employee owns)**
```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "employee-name",
    "privateKey": "EMPLOYEE_PRIVATE_KEY",
    "payerPrivateKey": "COMPANY_PRIVATE_KEY"
  }'
```

**Example 3: Different payer and owner (gift scenario)**
```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "gift-name",
    "privateKey": "OWNER_PRIVATE_KEY",
    "payerPrivateKey": "GIFTER_PRIVATE_KEY",
    "ownerAddress": "RECIPIENT_WALLET_ADDRESS"
  }'
```

---

### 2. Check Name Availability

Check if a name is available for registration.

**Endpoint:** `GET /api/check-name/:name`

**Example:**
```bash
curl http://localhost:3000/api/check-name/myname
```

**Response:**
```json
{
  "success": true,
  "name": "myname",
  "available": true,
  "nameAccount": "5ngKhX24Nb3aisHiYesZNypyPmd1ZHMPZX8X6orutATT"
}
```

---

### 3. Verify Name Registration

Verify if a name is registered and get registration details.

**Endpoint:** `GET /api/verify-name/:name`

**Example:**
```bash
curl http://localhost:3000/api/verify-name/ronit78
```

**Response (Registered):**
```json
{
  "success": true,
  "name": "ronit78",
  "registered": true,
  "available": false,
  "nameAccount": "5ngKhX24Nb3aisHiYesZNypyPmd1ZHMPZX8X6orutATT",
  "owner": "namesLPneVptA9Z5rqUDD9tMTWEJwofgaYwp8cawRkX",
  "balance": "0.010000000",
  "dataLength": 0,
  "network": "testnet",
  "explorerUrl": "https://solscan.io/account/...?cluster=testnet"
}
```

**Response (Not Registered):**
```json
{
  "success": true,
  "name": "newname",
  "registered": false,
  "available": true,
  "nameAccount": "...",
  "message": "Name is not registered yet"
}
```

---

### 4. Verify Transaction

Verify transaction status and get transaction details.

**Endpoint:** `GET /api/verify-transaction/:signature`

**Example:**
```bash
curl http://localhost:3000/api/verify-transaction/4e3BV4RyQZDiDdM8YW4tfMpemKYjakk9mDvMDjd4jVRQzm3aq2Dsfck27UL9cy3yA8w1LzdnhX7Eyd3NqzTGfuZM
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "signature": "4e3BV4RyQZDiDdM8YW4tfMpemKYjakk9mDvMDjd4jVRQzm3aq2Dsfck27UL9cy3yA8w1LzdnhX7Eyd3NqzTGfuZM",
    "confirmed": true,
    "status": "success",
    "error": null,
    "slot": 123456789,
    "blockTime": "2024-01-01T00:00:00.000Z",
    "fee": 0.000005,
    "accounts": ["...", "..."]
  },
  "network": "testnet",
  "explorerUrl": "https://solscan.io/tx/...?cluster=testnet"
}
```

---

### 5. Check Balance

Check SOL balance for a wallet address.

**Endpoint:** `GET /api/check-balance/:address`

**Example:**
```bash
curl http://localhost:3000/api/check-balance/GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY
```

**Response:**
```json
{
  "success": true,
  "address": "GobhrJqK1JnBb94NdR3zAvbQxwGN6EBukHBCZ9oZSJUY",
  "balance": "1.5000",
  "balanceLamports": 1500000000,
  "required": "0.01",
  "sufficient": true,
  "network": "testnet",
  "faucetUrl": "https://faucet.solana.com"
}
```

---

### 6. Health Check

Check server status and network configuration.

**Endpoint:** `GET /api/health`

**Example:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "network": "testnet",
  "rpcUrl": "https://api.testnet.solana.com"
}
```

---

## 🧪 Testing

### Testnet Testing

1. Set `NETWORK=testnet` in `.env`
2. Get testnet SOL from faucet:
   - Official Faucet: https://faucet.solana.com
   - Enter your wallet address (public key)
3. Use testnet private key
4. Minimum balance required: **0.01 SOL** (for testnet)

**Get Testnet SOL:**
```bash
# Using Solana CLI (if installed)
solana airdrop 1 YOUR_WALLET_ADDRESS --url testnet

# Or visit: https://faucet.solana.com
```

### Mainnet Deployment

1. Set `NETWORK=mainnet` in `.env`
2. Use your own RPC provider (recommended) or public RPC
3. Ensure sufficient SOL balance: **0.1 SOL minimum**
4. Use mainnet private key

**Recommended RPC Providers:**
- Helius: https://www.helius.dev/
- QuickNode: https://www.quicknode.com/
- Alchemy: https://www.alchemy.com/

---

## 💰 Balance Requirements

| Network | Minimum Balance | Registration Fee |
|---------|----------------|------------------|
| Testnet | 0.01 SOL       | 0.01 SOL         |
| Mainnet | 0.1 SOL        | 0.1 SOL          |

---

## 🔐 Private Key Formats

The API supports multiple private key formats for convenience:

### 1. Base58 String (Recommended)
```json
{
  "privateKey": "2HcA3h9fmeD51GDYEJgM4br8Y19pyJ5qP5q7xRnazikhaS43qTk8nF8eiVRNQJXLyP2wjjX4vjrKbrTA8iEqxbzY"
}
```

### 2. Array Format
```json
{
  "privateKey": [1,2,3,4,5,...]
}
```

### 3. Comma-Separated String
```json
{
  "privateKey": "1,2,3,4,5,..."
}
```

### 4. JSON Array String
```json
{
  "privateKey": "[1,2,3,4,5,...]"
}
```

---

## 📝 Complete Example Workflow

### Step 1: Check Name Availability
```bash
curl http://localhost:3000/api/check-name/myname
```

### Step 2: Check Your Balance
```bash
curl http://localhost:3000/api/check-balance/YOUR_WALLET_ADDRESS
```

### Step 3: Buy SNS Name
```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "myname",
    "privateKey": "YOUR_PRIVATE_KEY"
  }'
```

### Step 4: Verify Transaction
```bash
curl http://localhost:3000/api/verify-transaction/TRANSACTION_SIGNATURE
```

### Step 5: Verify Name Registration
```bash
curl http://localhost:3000/api/verify-name/myname
```

---

## 🔒 Security Notes

⚠️ **Important Security Considerations:**

- **Never expose private keys in production**
- Use environment variables for sensitive data
- Consider adding authentication/rate limiting
- Use HTTPS in production
- Validate all inputs server-side
- Never commit `.env` file to version control
- Use secure RPC endpoints in production
- Implement proper error handling
- Add request logging and monitoring

---

## 🛠️ Development

### Project Structure
```
sns nmame/
├── server.js          # Main API server
├── package.json       # Dependencies
├── .env              # Environment variables (not in git)
├── env.example       # Environment template
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### Dependencies
- `express` - Web framework
- `@solana/web3.js` - Solana JavaScript SDK
- `bs58` - Base58 encoding/decoding
- `dotenv` - Environment variables
- `cors` - CORS middleware

---

## 📊 API Response Codes

| Code | Description |
|------|-------------|
| 200  | Success     |
| 400  | Bad Request (validation error, insufficient balance, etc.) |
| 404  | Not Found (transaction not found) |
| 500  | Internal Server Error |

---

## 🐛 Troubleshooting

### Issue: "Invalid private key format"
**Solution:** Make sure your private key is in one of the supported formats (base58 string, array, etc.)

### Issue: "Insufficient balance"
**Solution:** 
- For testnet: Get SOL from https://faucet.solana.com
- For mainnet: Ensure you have at least 0.1 SOL

### Issue: "Name is already taken"
**Solution:** Try a different name. Use `/api/check-name/:name` to verify availability first.

### Issue: "Transaction not found"
**Solution:** Wait a few seconds and try again. Transaction might still be processing.

---

## 📚 Additional Resources

- [Solana Documentation](https://docs.solana.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Solscan Explorer](https://solscan.io/)
- [SNS Documentation](https://sns.id/)

---

## 📄 License

MIT

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## ⚠️ Disclaimer

This is a simplified implementation for educational purposes. For production use, you should:
- Add proper SNS program interaction
- Implement additional validation
- Add comprehensive error handling
- Add authentication and rate limiting
- Add logging and monitoring
- Use secure RPC endpoints
- Implement proper transaction handling

---

**Made with ❤️ for Solana Developers**
