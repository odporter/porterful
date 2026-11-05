# DEPLOY CONFIRMATION — Porterful

## Pre-Deploy Checklist

Run these commands and confirm output:

```bash
# 1. Location
cd ~/Documents/porterful && pwd
# Expected: /Users/sentinel/Documents/porterful

# 2. Vercel Project
cat .vercel/project.json | grep projectName
# Expected: "porterful" (NOT "porterful-app")

# 3. Git Remote
git remote get-url origin
# Expected: git@github.com:odporter/porterful.git

# 4. Branch
git branch --show-current
# Expected: main

# 5. Clean Build
npm run build 2>&1 | grep -E "Error|failed|✓ Generating"
# Expected: No errors, ✓ Generating static pages

# 6. Deploy
npx vercel --prod
# Copy the production URL

# 7. Alias
npx vercel alias set [production-url] porterful.com

# 8. Verify
curl -s https://porterful.com | head -1
# Expected: <!DOCTYPE html>...
```

## Post-Deploy Verification

- [ ] Deployment URL loads without 500 errors
- [ ] porterful.com alias points to new deployment
- [ ] Homepage shows correct content (no Nikee/Rob/etc.)
- [ ] /store shows buyer-facing copy
- [ ] /artists returns 200

## Rollback

If issues detected:
```bash
npx vercel alias set [previous-deployment-url] porterful.com
```
