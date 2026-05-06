# DeerFlow 2.0 — Post-Launch Evaluation

**Bookmarked:** 2026-05-05  
**Source:** https://github.com/bytedance/deer-flow  
**Status:** Not integrated. Evaluate after Porterful commerce is proven end-to-end.

## What It Is
ByteDance's open-source SuperAgent harness. LangGraph-based. Local-first. Orchestrates sub-agents with memory, sandboxes, skills.

## Why It Matters for Porterful
- Local-first = matches Od's privacy preference
- Could automate: content generation, PR reviews, QA smoke tests, artist bio writing
- NOT for: fixing checkout webhooks (overkill for one-line fixes)

## Integration Path (When Ready)
1. `git clone https://github.com/bytedance/deer-flow.git ~/deerflow`
2. `cd ~/deerflow && make setup`
3. Add `skills/porterful/SKILL.md` with Porterful-specific commands
4. Use for: content, QA, documentation maintenance

## Blocker
Do NOT integrate until Porterful $1 checkout test passes end-to-end (order + music_purchase + email + playback).
