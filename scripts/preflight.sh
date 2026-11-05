#!/bin/bash
# Preflight script for Porterful deployment
# Run this before any build/deploy to verify context

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== PORTERFUL PREFLIGHT CHECK ==="
echo

# Check 1: PWD
current_dir=$(pwd)
expected_dir="/Users/sentinel/Documents/porterful"
if [ "$current_dir" != "$expected_dir" ]; then
    echo "${RED}❌ FAIL: Wrong directory${NC}"
    echo "   Current: $current_dir"
    echo "   Expected: $expected_dir"
    exit 1
else
    echo "${GREEN}✓ Directory correct${NC}: $current_dir"
fi

# Check 2: Vercel Project
if [ ! -f ".vercel/project.json" ]; then
    echo "${RED}❌ FAIL: .vercel/project.json not found${NC}"
    exit 1
fi

project_name=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*"' | cut -d'"' -f4)
if [ "$project_name" != "porterful" ]; then
    echo "${RED}❌ FAIL: Wrong Vercel project${NC}"
    echo "   Project: $project_name"
    echo "   Expected: porterful"
    echo "   You may be in the porterful-app subfolder!"
    exit 1
else
    echo "${GREEN}✓ Vercel project correct${NC}: $project_name"
fi

# Check 3: Git Remote
if [ ! -d ".git" ]; then
    echo "${RED}❌ FAIL: Not a git repository${NC}"
    exit 1
fi

git_remote=$(git remote get-url origin 2>/dev/null || echo "none")
expected_remote="git@github.com:odporter/porterful.git"
if [ "$git_remote" != "$expected_remote" ]; then
    echo "${RED}❌ FAIL: Wrong git remote${NC}"
    echo "   Remote: $git_remote"
    echo "   Expected: $expected_remote"
    exit 1
else
    echo "${GREEN}✓ Git remote correct${NC}: $git_remote"
fi

# Check 4: Branch
branch=$(git branch --show-current)
if [ "$branch" != "main" ]; then
    echo "${YELLOW}⚠ WARNING: Not on main branch${NC}"
    echo "   Current branch: $branch"
    echo "   Expected: main"
else
    echo "${GREEN}✓ Branch correct${NC}: $branch"
fi

# Check 5: Verify project.json content
project_id=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*"' | cut -d'"' -f4)
org_id=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*"' | cut -d'"' -f4)
echo "${GREEN}✓ Vercel project verified:${NC}"
echo "   Project ID: $project_id"
echo "   Org ID: $org_id"

echo
echo "${GREEN}=== ALL CHECKS PASSED ===${NC}"
echo "You may proceed with build and deploy."
