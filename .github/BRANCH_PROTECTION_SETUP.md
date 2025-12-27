# 🔒 Branch Protection Rules Setup

## JSON File Import Karna

GitHub pe branch protection rules import karne ke liye:

### Option 1: GitHub CLI se (Recommended)

```bash
# GitHub CLI install (agar nahi hai)
brew install gh

# Login
gh auth login

# Branch protection apply karein (Simple version)
echo '{"required_pull_request_reviews":{"required_approving_review_count":1,"dismiss_stale_reviews":true},"required_conversation_resolution":true,"allow_force_pushes":false,"allow_deletions":false}' | \
gh api repos/:owner/:repo/branches/main/protection --method PUT --input -

# Ya phir jq use karein (agar installed hai)
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --input <(cat .github/branch-protection.json | jq '.simple')
```

### Option 2: GitHub API se Direct

```bash
# Token generate karein: GitHub > Settings > Developer settings > Personal access tokens
# "repo" permission required

# Simple version use karein
curl -X PUT \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/YOUR_USERNAME/sns-name-buyer/branches/main/protection \
  -d '{"required_pull_request_reviews":{"required_approving_review_count":1,"dismiss_stale_reviews":true},"required_conversation_resolution":true,"allow_force_pushes":false,"allow_deletions":false}'
```

### Option 3: GitHub Web UI se (Easiest)

1. Repository > Settings > Branches
2. "Add rule" click karein
3. Branch name: `main`
4. Settings enable karein:
   - ✅ Require a pull request before merging
     - Require approvals: **1**
     - Dismiss stale pull request approvals
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing
5. Save

## JSON File Details

### `branch-protection.json`
- **`simple`** object: Minimum required settings (recommended)
  - 1 approval required
  - PR required before merge
  - Force push blocked
  
- **`complete`** object: Full protection settings
  - Multiple branches support
  - Admin enforcement
  - All security features

## Settings Explained

| Setting | Description |
|---------|-------------|
| `required_approving_review_count` | Minimum approvals needed (1) |
| `dismiss_stale_reviews` | Auto-dismiss old approvals on new commits |
| `require_code_owner_reviews` | Require code owner approval |
| `required_conversation_resolution` | All PR comments must be resolved |
| `allow_force_pushes` | Block force pushes (security) |
| `allow_deletions` | Block branch deletion |
| `enforce_admins` | Apply rules to admins too |

## Quick Setup

```bash
# Simple setup (recommended)
# Pehle simple object extract karein
cat .github/branch-protection.json | jq '.simple' > /tmp/simple-rules.json
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --input /tmp/simple-rules.json

# Ya direct JSON bhejein
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_conversation_resolution=true \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

**Replace:**
- `:owner` = Your GitHub username
- `:repo` = Repository name

## Verify

```bash
# Check protection status
gh api repos/:owner/:repo/branches/main/protection
```

## Result

✅ Koi bhi directly main branch pe push nahi kar sakta
✅ Pull Request required
✅ Minimum 1 approval required
✅ Secure workflow enabled

---

**Note:** GitHub CLI use karna easiest hai. Web UI se bhi kar sakte hain manually.

