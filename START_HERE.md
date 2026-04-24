# START HERE — Porterful Development

## Before You Do Anything

1. **Verify you're in the right folder:**
   ```bash
   pwd
   # Should output: /Users/sentinel/Documents/porterful
   ```

2. **Verify Vercel project:**
   ```bash
   cat .vercel/project.json
   # Should show: "projectName":"porterful", NOT "porterful-app"
   ```

3. **Verify Git remote:**
   ```bash
   git remote get-url origin
   # Should show: git@github.com:odporter/porterful.git
   ```

4. **Verify branch:**
   ```bash
   git branch --show-current
   # Should show: main
   ```

## Quick Commands

```bash
# Install dependencies
npm install

# Local dev
npm run dev

# Build
npm run build

# Deploy to Vercel
npx vercel --prod
```

## Deployment Checklist

- [ ] In ~/Documents/porterful (lowercase)
- [ ] .vercel/project.json shows "porterful" not "porterful-app"
- [ ] git status shows clean or intentional changes
- [ ] npm run build succeeds with 0 errors
- [ ] npx vercel --prod deploys successfully
- [ ] npx vercel alias set [deployment-url] porterful.com
- [ ] curl https://porterful.com returns 200
