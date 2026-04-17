/**
 * Sovereign Execution — API contracts (request + response shapes).
 *
 * This file is the single source of truth for the wire shape each
 * surface expects. Both server routes and client hooks / components
 * import from here.
 */

// ─── Pre-flight ────────────────────────────────────────────────────────────

export type PreFlightMatch = {
  skill_id: string;
  skill_name: string;
  confidence: number;
  ascension_state:
    | 'learning'
    | 'converged_pending'
    | 'promoted'
    | 'locked'
    | 'regressed';
  rationale: string;
  suggestion: 'accept' | 'confirm' | 'review';
};

export type PreFlightTaskDraft = {
  title: string;
  description?: string | null;
  repo_path?: string | null;
  workstream_id?: string | null;
  initiative_id?: string | null;
};

export type PreFlightPreviewResponse = {
  matches: PreFlightMatch[];
  preview_token: string;
  preview_token_issued_at: string;
  enforcement: 'off' | 'advisory' | 'blocking';
  confidence_floor: number;
};

// ─── Receipts ──────────────────────────────────────────────────────────────

export type ExecutionReceipt = {
  id: string;
  run_id: string;
  workspace_id: string;
  provider: 'anthropic' | 'openai' | 'other';
  source_sub_type: 'subscription' | 'api_key' | 'enterprise_key';
  source_driver: string;
  api_key_id: string | null;
  started_at: string;
  first_response_at: string | null;
  completed_at: string;
  tokens_used: number;
  cost_estimate_cents: number;
  saved_estimate_cents: number;
  outcome_kind: 'shipped' | 'blocked' | 'abandoned' | 'awaiting_review' | null;
  gateway_connection_id: string | null;
};

export type ProofStripTotals = {
  window_start: string;
  window_end: string;
  spent_cents: number;
  saved_cents: number;
  tokens_used: number;
  shipped_count: number;
  by_provider: Array<{
    provider: string;
    spent_cents: number;
    saved_cents: number;
    count: number;
  }>;
};

// ─── Vault + Budgets ───────────────────────────────────────────────────────

export type VaultKey = {
  api_key_id: string;
  provider: 'anthropic' | 'openai' | 'other';
  fingerprint: string;
  status: 'active' | 'invalid' | 'revoked';
  is_enterprise: boolean;
  added_at: string;
  rotated_at: string | null;
  last_validated_at: string | null;
};

export type WorkspaceBudget = {
  id: string;
  workspace_id: string;
  provider: 'anthropic' | 'openai' | 'any';
  daily_spend_cap_cents: number;
  monthly_spend_cap_cents: number | null;
  soft_cap: boolean;
  per_agent_cap_cents: Record<string, number>;
  requires_approval_above: number | null;
};

export type BudgetDecision = {
  id: string;
  workspace_id: string;
  budget_id: string | null;
  run_id: string | null;
  user_id: string;
  reason_code:
    | 'daily_cap_exceeded'
    | 'monthly_cap_exceeded'
    | 'per_agent_cap'
    | 'above_approval_threshold';
  requested_cents: number;
  decision_status: 'pending' | 'approved' | 'rejected';
  resolved_by: string | null;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
};

// ─── Reviews ───────────────────────────────────────────────────────────────

export type RunReview = {
  id: string;
  run_id: string;
  workspace_id: string;
  sample_band: 'below_70' | 'band_70_85' | 'random_above';
  judge_score: number | null;
  status: 'pending' | 'agreed' | 'disagreed';
  reviewed_at: string | null;
  disagreement_md: string | null;
  created_at: string;
};

export type ReviewResolveInput = {
  decision: 'agree' | 'disagree';
  disagreement_md?: string;
  rubric_diff?: {
    skill_id?: string | null;
    diff: Record<string, unknown>;
  };
};

// ─── Runs ──────────────────────────────────────────────────────────────────

export type RunStatus =
  | 'planned'
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'blocked'
  | 'awaiting_review';

export type LiveRun = {
  id: string;
  title: string;
  status: RunStatus;
  source_driver: 'claude_code' | 'codex' | 'opencode' | 'server_api' | null;
  started_at: string | null;
  completed_at: string | null;
  outcome_kind:
    | 'shipped'
    | 'blocked'
    | 'abandoned'
    | 'awaiting_review'
    | null;
  quality_score: number | null;
  preview_token: string | null;
};

// ─── Plans ─────────────────────────────────────────────────────────────────

export type PlanVersion = {
  id: string;
  version: number;
  status: 'draft' | 'approved' | 'archived' | 'superseded';
  authored_at: string;
  approved_at: string | null;
};

// ─── Feature flags ─────────────────────────────────────────────────────────

export type SovexecFlags = {
  preflight_enforcement: 'off' | 'advisory' | 'blocking';
  planning_canvas_v2: boolean;
  parallel_runs_board: boolean;
};

// ─── Gateway telemetry ─────────────────────────────────────────────────────

export type AuditRow = {
  id: string;
  actor_user_id: string | null;
  workspace_id: string;
  org_id: string | null;
  entity_type: string;
  entity_id: string | null;
  event_kind: string;
  reason: string | null;
  related_decision_id: string | null;
  created_at: string;
};
