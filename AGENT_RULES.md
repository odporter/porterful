# AGENT RULES — Porterful

## CRITICAL: Verify Before Any Action

Before editing, building, or deploying, you MUST verify:

```python
def verify_porterful_context():
    checks = {
        'pwd': 'Must be ~/Documents/porterful (lowercase)',
        'vercel_project': 'cat .vercel/project.json must show "porterful"',
        'git_remote': 'git remote get-url origin must be git@github.com:odporter/porterful.git',
        'branch': 'git branch --show-current must be main'
    }
    
    for check, requirement in checks.items():
        if not verify(check):
            raise Exception(f'ABORT: {requirement}')
    
    return True
```

## STOP Conditions

STOP and ask if ANY of these are true:

1. Current directory is NOT ~/Documents/porterful
2. .vercel/project.json shows "porterful-app" instead of "porterful"
3. Git remote is NOT git@github.com:odporter/porterful.git
4. Unsure which project is being edited

## Deployment Protocol

1. Verify context (see above)
2. npm run build
3. If build succeeds: npx vercel --prod
4. Copy deployment URL
5. npx vercel alias set [url] porterful.com
6. curl https://porterful.com to verify live

## Prohibited Actions

- NEVER edit files in ~/Documents/Porterful (uppercase)
- NEVER edit files in ~/Documents/porterful/porterful-app
- NEVER deploy without verifying .vercel/project.json
- NEVER assume current folder is correct without checking
