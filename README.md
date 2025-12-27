# SNS Name Buyer Backend

Simple and fast backend API for buying Solana Name Service (SNS) names.

## Features

- ✅ Buy SNS names via API
- ✅ Check name availability
- ✅ Testnet and Mainnet support
- ✅ Easy configuration
- ✅ Fast and lightweight

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file:
```env
NETWORK=testnet  # or 'mainnet' for production
PORT=3000
```

## Usage

### Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### API Endpoints

#### 1. Buy SNS Name
```bash
POST /api/buy-sns-name
Content-Type: application/json

{
  "name": "myname",
  "privateKey": [1,2,3,...]  # or comma-separated string
}
```

**Response:**
```json
{
  "success": true,
  "message": "SNS name purchase initiated",
  "data": {
    "name": "myname",
    "nameAccount": "...",
    "userAddress": "...",
    "transactionSignature": "...",
    "network": "testnet",
    "explorerUrl": "..."
  }
}
```

#### 2. Check Name Availability
```bash
GET /api/check-name/myname
```

**Response:**
```json
{
  "success": true,
  "name": "myname",
  "available": true,
  "nameAccount": "..."
}
```

#### 3. Health Check
```bash
GET /api/health
```

## Testing

### Testnet Testing

1. Set `NETWORK=testnet` in `.env`
2. Get testnet SOL from faucet: https://faucet.solana.com
3. Use testnet private key

### Mainnet Deployment

1. Set `NETWORK=mainnet` in `.env`
2. Use your own RPC provider (recommended) or public RPC
3. Ensure sufficient SOL balance

## Example Request

```bash
curl -X POST http://localhost:3000/api/buy-sns-name \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testname",
    "privateKey": [1,2,3,...]
  }'
```

## Security Notes

⚠️ **Important:**
- Never expose private keys in production
- Use environment variables for sensitive data
- Consider adding authentication/rate limiting
- Use HTTPS in production
- Validate all inputs server-side

## Notes

- Private key can be provided as:
  - Array: `[1,2,3,...]`
  - Comma-separated string: `"1,2,3,..."`
  - JSON string: `"[1,2,3,...]"`

- Minimum balance required: 0.1 SOL (adjustable in code)

- This is a simplified implementation. For production, you may need to:
  - Add proper SNS program interaction
  - Implement additional validation
  - Add error handling
  - Add logging
  - Add authentication

