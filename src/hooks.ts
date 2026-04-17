'use client';

/**
 * React hooks that consume the Sovereign Execution endpoints. SWR-style
 * with credentials-scoped fetch; Realtime subscription lands alongside
 * the first plugin peer.
 *
 * Hooks defer the fetch implementation to a thin wrapper so that
 * server components or non-browser consumers can substitute their own.
 */

import { useEffect, useState } from 'react';

import type {
  AuditRow,
  BudgetDecision,
  ExecutionReceipt,
  LiveRun,
  ProofStripTotals,
  RunReview,
  SovexecFlags,
  VaultKey,
  WorkspaceBudget,
} from './contracts';

type FetchState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  refresh: () => void;
};

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { credentials: 'include' });
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return (await r.json()) as T;
}

function useEndpoint<T>(
  key: string,
  url: string | null
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchJson<T>(url)
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key, url, tick]);

  return { data, error, loading, refresh: () => setTick((t) => t + 1) };
}

function qs(base: string, params: Record<string, string | null | undefined>) {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== null && v !== undefined && v !== '') u.set(k, v);
  }
  const s = u.toString();
  return s ? `${base}?${s}` : base;
}

export function useProofStrip(workspaceId: string | null, days = 1) {
  return useEndpoint<{ totals: ProofStripTotals }>(
    `proof-strip:${workspaceId}:${days}`,
    workspaceId
      ? qs('/api/v1/proof-strip', {
          workspace_id: workspaceId,
          days: String(days),
        })
      : null
  );
}

export function useVaultProviders(workspaceId: string | null) {
  return useEndpoint<{ providers: VaultKey[] }>(
    `vault-providers:${workspaceId}`,
    workspaceId ? qs('/api/v1/vault/providers', { workspace_id: workspaceId }) : null
  );
}

export function useBudgets(workspaceId: string | null) {
  return useEndpoint<{ budgets: WorkspaceBudget[] }>(
    `budgets:${workspaceId}`,
    workspaceId ? qs('/api/v1/budgets', { workspace_id: workspaceId }) : null
  );
}

export function usePendingBudgetDecisions(workspaceId: string | null) {
  return useEndpoint<{ decisions: BudgetDecision[] }>(
    `budget-decisions:${workspaceId}`,
    workspaceId
      ? qs('/api/v1/budget-decisions', {
          workspace_id: workspaceId,
          status: 'pending',
        })
      : null
  );
}

export function useReceipts(workspaceId: string | null, days = 30) {
  return useEndpoint<{ receipts: ExecutionReceipt[] }>(
    `receipts:${workspaceId}:${days}`,
    workspaceId
      ? qs('/api/v1/execution/receipts', {
          workspace_id: workspaceId,
          days: String(days),
        })
      : null
  );
}

export function useReviewQueue(workspaceId: string | null) {
  return useEndpoint<{ reviews: RunReview[] }>(
    `reviews:${workspaceId}`,
    workspaceId
      ? qs('/api/v1/reviews', { workspace_id: workspaceId, status: 'pending' })
      : null
  );
}

export function useRuns(limit = 50) {
  return useEndpoint<{ runs: LiveRun[] }>(
    `runs:${limit}`,
    qs('/api/v1/runs', { status: 'all', limit: String(limit) })
  );
}

export function useAuditLog(workspaceId: string | null, entityType?: string) {
  return useEndpoint<{ rows: AuditRow[]; next_cursor: string | null }>(
    `audit-log:${workspaceId}:${entityType ?? 'all'}`,
    workspaceId
      ? qs('/api/v1/audit-log', {
          workspace_id: workspaceId,
          entity_type: entityType,
          limit: '100',
        })
      : null
  );
}

export function useSovexecFlags(workspaceId: string | null) {
  return useEndpoint<{ flags: SovexecFlags }>(
    `flags:${workspaceId}`,
    workspaceId ? qs('/api/v1/feature-flags', { workspace_id: workspaceId }) : null
  );
}
