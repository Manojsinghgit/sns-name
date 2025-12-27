#!/bin/bash
# EC2 Setup Script - Run this on your EC2 instance

echo "🚀 Setting up SNS Name Buyer API on EC2..."

# Update system
sudo yum update -y

# Install Node.js 18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18

# Install Git
sudo yum install git -y

# Install PM2 globally
npm install -g pm2

# Clone repository (update with your repo URL)
# git clone https://github.com/YOUR_USERNAME/sns-name-buyer.git
# cd sns-name-buyer

# Or if code already there, just install dependencies
npm install

# Create .env file
cat > .env << EOF
NETWORK=testnet
PORT=3000
NODE_ENV=production
TESTNET_RPC_URL=https://api.testnet.solana.com
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
EOF

# Start with PM2
pm2 start server.js --name sns-api
pm2 save
pm2 startup

echo "✅ Setup complete!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs sns-api"
echo "🌐 Your API should be running on port 3000"

