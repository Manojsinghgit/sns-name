# ☁️ AWS Deployment Guide

AWS pe deploy karne ke liye multiple options hain. Sabse easy aur best options:

## Option 1: AWS Elastic Beanstalk (Recommended - Sabse Easy) ⭐

### Why Elastic Beanstalk?
- ✅ Free tier available (EC2 t2.micro free for 12 months)
- ✅ Auto-scaling
- ✅ Load balancing
- ✅ Easy deployment
- ✅ Environment management

### Steps:

#### 1. AWS Account Setup
- AWS account banaein: https://aws.amazon.com
- Free tier eligible ho to 12 months free EC2

#### 2. EB CLI Install Karein
```bash
# macOS
brew install aws-elasticbeanstalk

# Or pip se
pip install awsebcli
```

#### 3. AWS Configure
```bash
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1 (ya apna region)
# - Default output format: json
```

#### 4. Project Setup
```bash
cd /Users/apple/Desktop/sns\ nmame

# EB init
eb init -p node.js-18 sns-name-buyer --region us-east-1

# Environment create karein
eb create sns-name-buyer-env

# Environment variables set karein
eb setenv NETWORK=testnet PORT=8080 TESTNET_RPC_URL=https://api.testnet.solana.com MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

#### 5. Deploy
```bash
eb deploy
```

#### 6. URL Mil Jayega
```bash
eb open
# Ya
eb status
```

**Free Tier:**
- ✅ t2.micro EC2 instance (750 hours/month free for 12 months)
- ✅ 30GB storage
- ✅ Auto-scaling

---

## Option 2: AWS EC2 (Traditional Server)

### Steps:

#### 1. EC2 Instance Launch
- AWS Console > EC2 > Launch Instance
- Settings:
  - **AMI:** Amazon Linux 2023 (free tier eligible)
  - **Instance Type:** t2.micro (free tier)
  - **Key Pair:** Create new (download .pem file)
  - **Security Group:** 
    - SSH (port 22) - Your IP
    - HTTP (port 80) - 0.0.0.0/0
    - Custom TCP (port 3000) - 0.0.0.0/0

#### 2. Connect to EC2
```bash
# SSH se connect
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

#### 3. Server Setup
```bash
# Node.js install
sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Git install
sudo yum install git -y

# Code clone karein
git clone https://github.com/YOUR_USERNAME/sns-name-buyer.git
cd sns-name-buyer

# Dependencies install
npm install

# PM2 install (process manager)
npm install -g pm2
```

#### 4. Environment Variables
```bash
# .env file banaein
nano .env

# Add:
NETWORK=testnet
PORT=3000
TESTNET_RPC_URL=https://api.testnet.solana.com
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

#### 5. Start Server
```bash
# PM2 se start (auto-restart on crash)
pm2 start server.js --name sns-api
pm2 save
pm2 startup  # Auto-start on reboot
```

#### 6. Nginx Setup (Optional - Production)
```bash
# Nginx install
sudo yum install nginx -y

# Config file
sudo nano /etc/nginx/conf.d/sns-api.conf

# Add:
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

**Free Tier:**
- ✅ t2.micro instance (750 hours/month for 12 months)
- ✅ 30GB EBS storage

---

## Option 3: AWS Lambda + API Gateway (Serverless)

### Changes Required:
Lambda ke liye code thoda modify karna hoga. Main separate file bana deta hoon.

**Pros:**
- ✅ Pay per request (very cheap)
- ✅ Auto-scaling
- ✅ No server management

**Cons:**
- ⚠️ Code changes required
- ⚠️ Cold start latency

---

## Option 4: AWS App Runner (Container-based)

### Steps:

#### 1. Dockerfile Create (already created below)

#### 2. ECR (Elastic Container Registry) pe push
```bash
# Docker build
docker build -t sns-name-buyer .

# ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Tag
docker tag sns-name-buyer:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sns-name-buyer:latest

# Push
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sns-name-buyer:latest
```

#### 3. App Runner Service Create
- AWS Console > App Runner > Create Service
- Source: ECR
- Environment variables add karein

**Pricing:**
- Pay per use (cheap for low traffic)

---

## Recommended: Elastic Beanstalk

**Kyun?**
- ✅ Sabse easy
- ✅ Free tier available
- ✅ Auto-scaling
- ✅ No code changes needed
- ✅ Production ready

---

## Code Changes for AWS

### 1. Port Configuration
Code already flexible hai - `process.env.PORT` use karta hai.

### 2. Health Check Endpoint
Already hai: `/api/health`

### 3. Process Manager
PM2 use karein production mein.

---

## Quick Deploy (Elastic Beanstalk)

```bash
# 1. Install EB CLI
brew install aws-elasticbeanstalk

# 2. Configure AWS
aws configure

# 3. Initialize
cd /Users/apple/Desktop/sns\ nmame
eb init -p node.js-18 sns-name-buyer

# 4. Create environment
eb create sns-name-buyer-env

# 5. Set environment variables
eb setenv NETWORK=testnet PORT=8080

# 6. Deploy
eb deploy

# 7. Open
eb open
```

---

## Environment Variables (All AWS Options)

```env
NETWORK=testnet
PORT=3000
NODE_ENV=production
TESTNET_RPC_URL=https://api.testnet.solana.com
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## Security Group Settings

EC2/Elastic Beanstalk ke liye:
- **HTTP (80):** 0.0.0.0/0 (public)
- **HTTPS (443):** 0.0.0.0/0 (public)
- **Custom TCP (3000):** 0.0.0.0/0 (if direct access)
- **SSH (22):** Your IP only (security)

---

## Cost Estimation

### Free Tier (First 12 Months):
- ✅ EC2 t2.micro: 750 hours/month FREE
- ✅ 30GB EBS storage: FREE
- ✅ 15GB data transfer: FREE

### After Free Tier:
- EC2 t2.micro: ~$8-10/month
- Data transfer: Pay per GB

### Lambda (Serverless):
- First 1M requests: FREE
- After that: $0.20 per 1M requests

---

## Monitoring

### CloudWatch
- AWS Console > CloudWatch
- Logs automatically collect hote hain
- Metrics dekh sakte hain

### PM2 Monitoring (EC2)
```bash
pm2 monit
pm2 logs
```

---

## Troubleshooting

### Issue: Port already in use
**Solution:**
```bash
# Check port
lsof -i :3000
# Kill process
kill -9 PID
```

### Issue: Cannot connect to EC2
**Solution:**
- Security group check karein
- Key pair sahi hai?
- Public IP sahi hai?

### Issue: App not starting
**Solution:**
- Check logs: `pm2 logs` (EC2)
- Check EB logs: `eb logs` (Elastic Beanstalk)
- Environment variables sahi hain?

---

## Production Best Practices

1. **Use Load Balancer** (Elastic Beanstalk auto provides)
2. **Enable HTTPS** (SSL certificate from ACM)
3. **Use RDS** for database (if needed later)
4. **CloudWatch Alarms** setup karein
5. **Auto-scaling** configure karein
6. **Backup** strategy banaein

---

## Next Steps

1. Choose option (Elastic Beanstalk recommended)
2. Follow steps above
3. Deploy!
4. Test API endpoints
5. Monitor in CloudWatch

---

**Happy Deploying on AWS! ☁️**

