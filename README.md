# @orgx/data

TypeScript contracts + React hooks for every Sovereign Execution surface. Single source of truth for wire shape between server routes and consumers (useorgx.com, Tauri shell, plugin dashboards, MCP widgets).

## Contracts

`PreFlightMatch`, `PreFlightPreviewResponse`, `ExecutionReceipt`, `ProofStripTotals`, `VaultKey`, `WorkspaceBudget`, `BudgetDecision`, `RunReview`, `ReviewResolveInput`, `LiveRun`, `PlanVersion`, `SovexecFlags`, `AuditRow`.

## Hooks

All hooks follow the same shape: `{ data, error, loading, refresh }`. They fetch lazily (no-op when the required argument is null) and revalidate on `refresh()`.

| Hook | Endpoint |
|---|---|
| `useProofStrip(wsId, days)` | `/api/v1/proof-strip` |
| `useVaultProviders(wsId)` | `/api/v1/vault/providers` |
| `useBudgets(wsId)` | `/api/v1/budgets` |
| `usePendingBudgetDecisions(wsId)` | `/api/v1/budget-decisions?status=pending` |
| `useReceipts(wsId, days)` | `/api/v1/execution/receipts` |
| `useReviewQueue(wsId)` | `/api/v1/reviews?status=pending` |
| `useRuns(limit)` | `/api/v1/runs?status=all` |
| `useAuditLog(wsId, entityType?)` | `/api/v1/audit-log` |
| `useSovexecFlags(wsId)` | `/api/v1/feature-flags` |

## Realtime

SWR + Supabase Realtime adapter ships with the first plugin peer adoption. Current hooks are poll-safe; wrapping a consumer with `setInterval(refresh, N)` is supported explicitly.

## Status

Alpha. Shipping as part of the Sovereign Execution initiative (`993cabeb`).
