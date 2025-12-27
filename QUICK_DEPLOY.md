# ⚡ Quick Deploy Guide - 5 Minutes Mein

## Sabse Fast Way: Render.com

### Step 1: GitHub pe Code Push (2 minutes)

```bash
# Terminal mein yeh commands run karein:
cd /Users/apple/Desktop/sns\ nmame

# Git initialize (agar nahi hai)
git init

# Sab files add karein
git add .

# Commit karein
git commit -m "SNS Name Buyer API - Ready to deploy"

# GitHub pe new repository banaein:
# 1. https://github.com/new pe jao
# 2. Repository name: "sns-name-buyer" (ya kuch bhi)
# 3. Public select karein
# 4. Create repository click karein

# Phir yeh commands run karein (YOUR_USERNAME aur REPO_NAME apne hisab se):
git remote add origin https://github.com/YOUR_USERNAME/sns-name-buyer.git
git branch -M main
git push -u origin main
```

### Step 2: Render.com pe Deploy (3 minutes)

1. **Sign Up:**
   - https://render.com pe jao
   - "Get Started for Free" click karein
   - GitHub se sign up karein (easiest)

2. **New Web Service:**
   - Dashboard se "New +" button
   - "Web Service" select karein
   - Apni GitHub repository select karein

3. **Settings Fill Karein:**
   ```
   Name: sns-name-buyer
   Environment: Node
   Region: Singapore (ya closest)
   Branch: main
   Root Directory: (blank rakhein)
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Environment Variables Add Karein:**
   - "Advanced" section mein "Add Environment Variable" click karein
   - Add these one by one:
     ```
     NETWORK = testnet
     PORT = 10000
     TESTNET_RPC_URL = https://api.testnet.solana.com
     MAINNET_RPC_URL = https://api.mainnet-beta.solana.com
     ```

5. **Deploy:**
   - "Create Web Service" click karein
   - 2-3 minutes mein deploy ho jayega
   - URL milega: `https://sns-name-buyer.onrender.com`

### Step 3: Test Karein

```bash
# Health check
curl https://sns-name-buyer.onrender.com/api/health

# Name check
curl https://sns-name-buyer.onrender.com/api/check-name/testname
```

## ✅ Done! 

Aapka API ab live hai aur free mein host ho raha hai!

**API URL:** `https://sns-name-buyer.onrender.com`

**Endpoints:**
- `POST https://sns-name-buyer.onrender.com/api/buy-sns-name`
- `GET https://sns-name-buyer.onrender.com/api/check-name/:name`
- `GET https://sns-name-buyer.onrender.com/api/health`

---

## Alternative: Railway (Even Faster)

1. https://railway.app pe jao
2. GitHub se sign up
3. "New Project" > "Deploy from GitHub"
4. Repository select karein
5. Environment variables add karein
6. Done! (Auto-deploy)

---

## Important Notes

⚠️ **Free Tier:**
- Render: 15 min inactivity pe sleep (first request slow)
- Railway: $5/month credit (usually enough)

💡 **Tip:**
- Agar app sleep ho jaye, to first request slow hoga (wake up time)
- Production ke liye paid plan better hai

---

**Happy Deploying! 🚀**

