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

Choose checks for the files and behavior changed. The commands below cover code
changes; documentation-only edits need a diff and reference review, not a full
build. Keep required CI checks in place and report any checks that could not run.

```bash
npm run type-check
npm run build
```

When changing exported contract shapes or hook return contracts, run checks for
affected consumers when available. If a consumer is unavailable, document the
compatibility risk and rely on its CI or follow-up validation; do not make access
to every consuming repo a prerequisite for updating these contracts.
