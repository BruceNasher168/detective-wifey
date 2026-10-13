# Workspace Rules for .agents

- Enforce all Global Principles from [AGENTS.md](../../AGENTS.md).
- Prioritize `.agents/skills/` as the primary workspace skills directory and `.agents/agents/` as the primary subagents directory.
- Always use `ask_question` for interactive clarification questions.
- Execute automation scripts via `run_command` using PowerShell (`powershell -NoProfile -File .agents/skills/<skill>/scripts/<script>.ps1`).
