import { randomUUID } from "node:crypto";
import { pool } from "./db.js";
import { evaluateOpportunity, buildEngineeringPlan, reviewDelivery, revenueDisposition } from "./domain.js";
import { analyzePublicText } from "./model.js";

async function audit(taskId, eventType, actor, details = {}) {
  await pool.query(
    "INSERT INTO runtime.audit_events (id, task_id, event_type, actor, details) VALUES ($1,$2,$3,$4,$5::jsonb)",
    [randomUUID(), taskId, eventType, actor, JSON.stringify(details)]
  );
}

async function message(taskId, from, to, type, payload) {
  await pool.query(
    "INSERT INTO runtime.agent_messages (id, task_id, correlation_id, from_agent, to_agent, message_type, payload) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb)",
    [randomUUID(), taskId, taskId, from, to, type, JSON.stringify(payload)]
  );
}

async function recordOpportunity(taskId, candidate, decision) {
  await pool.query(
    "INSERT INTO runtime.opportunity_candidates (id, task_id, source, title, url, funding_status, eligibility_status, evidence) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)",
    [
      randomUUID(), taskId, candidate.source ?? "unknown", candidate.title ?? "Untitled",
      candidate.source_url ?? null,
      candidate.actual_funding_verified === true ? "EVIDENCE_PROVIDED" : "UNVERIFIED",
      decision.decision, JSON.stringify({ checks: decision.checks, synthetic_test: candidate.synthetic_test === true })
    ]
  );
}

function syntheticCandidate() {
  return {
    synthetic_test: true,
    source: "SYNTHETIC_TEST_FIXTURE",
    title: "Agent Integration Engineering Pack: controlled pilot fixture",
    sponsor: "Synthetic test sponsor (not a real buyer)",
    source_url: "https://example.invalid/opportunity-fixture",
    funded_amount: 100,
    currency: "USD",
    actual_funding_verified: true,
    funding_evidence_url: "https://example.invalid/funding-fixture",
    ai_participation_allowed: true,
    india_eligibility_verified: true,
    entry_fee: 0,
    deposit_required: false,
    owner_funded_gas_required: false,
    deadline: "2099-12-31T23:59:00Z",
    scope: "Synthetic demonstration of an agent-to-agent engineering delivery workflow."
  };
}

export async function executePipeline(task) {
  const taskId = task.id;
  const candidate = task.task_type === "demo_e2e"
    ? syntheticCandidate()
    : task.payload?.candidate ?? {};

  const timeline = [];
  const runAgent = async (agentId, nextAgent, type, payload) => {
    const record = { agent_id: agentId, to: nextAgent, type, payload, at: new Date().toISOString() };
    timeline.push(record);
    await message(taskId, agentId, nextAgent, type, payload);
    await audit(taskId, "AGENT_STEP_COMPLETED", agentId, { next_agent: nextAgent, message_type: type });
    return payload;
  };

  const discovery = await runAgent("opportunity-discovery", "eligibility-analyst", "CANDIDATE_DISCOVERED", {
    count: 1, candidate_title: candidate.title, source: candidate.source ?? "provided_payload"
  });

  const eligibility = evaluateOpportunity(candidate);
  await recordOpportunity(taskId, candidate, eligibility);
  await runAgent("eligibility-analyst", "scope-planner", "ELIGIBILITY_DECISION", eligibility);

  const plan = eligibility.decision === "QUALIFIED_FOR_HUMAN_REVIEW"
    ? buildEngineeringPlan(candidate)
    : { title: candidate.title ?? "Unqualified candidate", scope: "No engineering execution permitted until hard checks pass", work_packages: [], blocked_reason: "Eligibility evidence incomplete" };
  await runAgent("scope-planner", "engineering-agent", "WORK_PLAN", plan);

  const modelSummary = await analyzePublicText(
    `Summarise this public opportunity for internal review only. Do not submit, sign, pay or claim revenue. Candidate: ${JSON.stringify(candidate)}`
  );

  const artifact = {
    scope: plan.scope,
    plan,
    model_summary: modelSummary,
    financial_actions_enabled: false,
    submission_enabled: false,
    generated_at: new Date().toISOString()
  };
  await runAgent("engineering-agent", "independent-qa", "DELIVERABLE_DRAFT", {
    title: artifact.plan.title,
    work_packages: artifact.plan.work_packages.length,
    model_provider: modelSummary.provider
  });

  const qa = reviewDelivery(artifact, candidate);
  await runAgent("independent-qa", "delivery-packager", "QA_RESULT", qa);

  const delivery = {
    artifact_id: randomUUID(),
    status: qa.passed ? "PACKAGED_FOR_HUMAN_REVIEW" : "BLOCKED_BY_QA",
    title: artifact.plan.title,
    scope: artifact.scope,
    work_packages: artifact.plan.work_packages,
    qa
  };
  await runAgent("delivery-packager", "revenue-verifier", "DELIVERY_PACKAGE", delivery);

  const revenue = revenueDisposition(task.payload?.receipt ?? {});
  await runAgent("revenue-verifier", "mission-control", "REVENUE_DISPOSITION", {
    status: revenue,
    realised_net_revenue: 0,
    independent_verification_required: true
  });

  const result = {
    pipeline: "crypto-ai-holdco-pilot-v0.1",
    mode: task.task_type === "demo_e2e" ? "SYNTHETIC_END_TO_END_TEST" : "OPPORTUNITY_REVIEW",
    completed_at: new Date().toISOString(),
    candidate: {
      title: candidate.title ?? null,
      synthetic_test: candidate.synthetic_test === true,
      eligibility: eligibility.decision,
      checks: eligibility.checks,
      autonomous_submission_allowed: false
    },
    engineering_plan: plan,
    qa,
    delivery,
    revenue,
    realised_net_revenue: 0,
    timeline,
    safety: {
      live_submissions_enabled: false,
      wallet_signing_enabled: false,
      payments_enabled: false,
      trading_enabled: false
    }
  };

  await audit(taskId, "PIPELINE_COMPLETED", "mission-control", {
    mode: result.mode,
    qa: qa.decision,
    revenue,
    synthetic_test: candidate.synthetic_test === true
  });
  return result;
}