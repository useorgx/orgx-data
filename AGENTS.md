# AGENTS.md

Guidelines for Codex and other agents working in `useorgx/orgx-data`.

## Project

This repo contains shared TypeScript contracts and React hooks for OrgX Sovereign Execution surfaces.

## Setup

For Codex cloud, use:

```bash
bash .codex/setup-cloud.sh
```

Maintenance script for cached environments:

```bash
bash .codex/maintenance-cloud.sh
```

## Verification

```bash
npm run type-check
npm run build
```

Run downstream consumer checks when changing exported contract shapes or hook return contracts.
