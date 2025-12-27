# 🚀 Free Hosting Deployment Guide

Is backend ko free mein host karne ke liye multiple options hain. Sabse easy aur best options:

## Option 1: Render (Recommended - Sabse Easy) ⭐

### Steps:

1. **GitHub pe code push karein:**
```bash
# Pehle git initialize karein (agar nahi hai)
git init
git add .
git commit -m "Initial commit"

# GitHub pe repository banaein aur push karein
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Render.com pe account banaein:**
   - Visit: https://render.com
   - Sign up karein (GitHub se sign up karein - easy hai)

3. **New Web Service create karein:**
   - Dashboard se "New +" button click karein
   - "Web Service" select karein
   - Apni GitHub repository connect karein
   - Settings:
     - **Name:** `sns-name-buyer` (ya kuch bhi)
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** `Free`

4. **Environment Variables add karein:**
   - Settings > Environment Variables
   - Add these:
     ```
     NETWORK=testnet
     PORT=10000
     TESTNET_RPC_URL=https://api.testnet.solana.com
     MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
     ```

5. **Deploy:**
   - "Create Web Service" click karein
   - Automatic deploy ho jayega
   - URL milega: `https://sns-name-buyer.onrender.com` (ya aapka custom name)

**Free Tier Limits:**
- ✅ 750 hours/month free
- ✅ Auto-sleep after 15 min inactivity (wake up on request)
- ✅ SSL certificate included
- ✅ Custom domain support

---

## Option 2: Railway (Fast & Easy)

### Steps:

1. **GitHub pe code push karein** (same as above)

2. **Railway.com pe account banaein:**
   - Visit: https://railway.app
   - Sign up with GitHub

3. **New Project create karein:**
   - "New Project" click karein
   - "Deploy from GitHub repo" select karein
   - Apni repository select karein

4. **Environment Variables add karein:**
   - Variables tab mein:
     ```
     NETWORK=testnet
     PORT=3000
     TESTNET_RPC_URL=https://api.testnet.solana.com
     MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
     ```

5. **Deploy:**
   - Automatic deploy ho jayega
   - URL milega: `https://sns-name-buyer.up.railway.app`

**Free Tier:**
- ✅ $5 credit/month (enough for small apps)
- ✅ No sleep (always on)
- ✅ Fast deployment

---

## Option 3: Fly.io (Good Performance)

### Steps:

1. **Fly.io CLI install karein:**
```bash
# macOS
curl -L https://fly.io/install.sh | sh

# Or download from: https://fly.io/docs/getting-started/installing-flyctl/
```

2. **Login karein:**
```bash
fly auth login
```

3. **App create karein:**
```bash
cd /Users/apple/Desktop/sns\ nmame
fly launch
```

4. **Environment variables set karein:**
```bash
fly secrets set NETWORK=testnet
fly secrets set PORT=3000
fly secrets set TESTNET_RPC_URL=https://api.testnet.solana.com
fly secrets set MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

5. **Deploy:**
```bash
fly deploy
```

**Free Tier:**
- ✅ 3 shared-cpu VMs
- ✅ 3GB persistent volume
- ✅ 160GB outbound data transfer

---

## Option 4: Cyclic (Node.js Specific)

### Steps:

1. **GitHub pe code push karein**

2. **Cyclic.sh pe account banaein:**
   - Visit: https://cyclic.sh
   - Sign up with GitHub

3. **Deploy:**
   - "Deploy Now" click karein
   - Repository select karein
   - Automatic deploy

4. **Environment Variables:**
   - Dashboard se environment variables add karein

**Free Tier:**
- ✅ Always on
- ✅ Auto-deploy from GitHub
- ✅ Custom domain

---

## Quick Setup (Render - Recommended)

### Step-by-Step:

1. **GitHub Repository banaein:**
```bash
cd /Users/apple/Desktop/sns\ nmame
git init
git add .
git commit -m "SNS Name Buyer API"
# GitHub pe new repo banaein aur push karein
```

2. **Render.com pe:**
   - Sign up: https://render.com
   - New Web Service
   - GitHub repo connect karein
   - Settings:
     - Build: `npm install`
     - Start: `npm start`
   - Environment Variables add karein
   - Deploy!

3. **URL mil jayega:**
   - Example: `https://sns-name-buyer.onrender.com`
   - API: `https://sns-name-buyer.onrender.com/api/buy-sns-name`

---

## Environment Variables (All Platforms)

Sabhi platforms pe yeh variables add karein:

```env
NETWORK=testnet
PORT=3000
TESTNET_RPC_URL=https://api.testnet.solana.com
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

**Mainnet ke liye:**
```env
NETWORK=mainnet
PORT=3000
MAINNET_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## Testing After Deployment

Deploy hone ke baad test karein:

```bash
# Health check
curl https://YOUR-APP-URL.onrender.com/api/health

# Check name
curl https://YOUR-APP-URL.onrender.com/api/check-name/testname
```

---

## Custom Domain (Optional)

Agar aapka domain hai:
- Render: Settings > Custom Domain
- Railway: Settings > Domains
- Fly.io: `fly domains add yourdomain.com`

---

## Important Notes

⚠️ **Free Tier Limitations:**
- Render: 15 min inactivity pe sleep (first request slow)
- Railway: $5/month credit limit
- Fly.io: Resource limits
- Cyclic: Usage limits

💡 **Best Practice:**
- Production ke liye paid plan consider karein
- RPC provider use karein (public RPC rate limited hai)
- Monitoring add karein

---

## Troubleshooting

### Issue: App sleep ho rahi hai (Render)
**Solution:** Free tier pe normal hai. First request slow hoga, phir wake up ho jayega.

### Issue: Build fail ho raha hai
**Solution:** 
- Check `package.json` sahi hai
- Node version check karein
- Build logs dekhin

### Issue: Environment variables kaam nahi kar rahe
**Solution:**
- Platform pe variables properly set karein
- Restart service karein
- `.env` file commit mat karein (security)

---

## Recommended: Render

**Kyun Render?**
- ✅ Sabse easy setup
- ✅ Free tier available
- ✅ Good documentation
- ✅ Auto-deploy from GitHub
- ✅ SSL included

**Quick Start:**
1. GitHub pe code push
2. Render.com pe sign up
3. Connect repo
4. Deploy!

---

**Happy Deploying! 🚀**

