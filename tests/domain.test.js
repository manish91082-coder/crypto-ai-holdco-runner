import test from "node:test";
import assert from "node:assert/strict";
import { evaluateOpportunity, buildEngineeringPlan, reviewDelivery, revenueDisposition } from "../src/domain.js";

const validCandidate = {
  title: "Agent Integration Engineering Pack",
  sponsor: "Verified test sponsor",
  source_url: "https://example.com/opportunity",
  funded_amount: 1000,
  currency: "USD",
  actual_funding_verified: true,
  funding_evidence_url: "https://example.com/funding-proof",
  ai_participation_allowed: true,
  india_eligibility_verified: true,
  entry_fee: 0,
  deposit_required: false,
  owner_funded_gas_required: false,
  deadline: "2099-01-01T00:00:00Z",
  scope: "Build a bounded API integration and test suite."
};

test("valid evidence candidate passes hard qualification checks", () => {
  const result = evaluateOpportunity(validCandidate);
  assert.equal(result.decision, "QUALIFIED_FOR_HUMAN_REVIEW");
  assert.equal(result.autonomousSubmissionAllowed, false);
});

test("unknown AI permission and owner-funded gas fail closed", () => {
  const result = evaluateOpportunity({
    ...validCandidate,
    ai_participation_allowed: false,
    owner_funded_gas_required: true
  });
  assert.equal(result.decision, "BLOCKED_OR_UNVERIFIED");
  assert.equal(result.checks.aiPermission, false);
  assert.equal(result.checks.zeroUpfront, false);
});

test("engineering plan prohibits wallet signing", () => {
  const plan = buildEngineeringPlan(validCandidate);
  assert.ok(plan.prohibited_without_separate_authorization.includes("wallet signing"));
});

test("QA rejects financial actions and external submissions", () => {
  const ok = reviewDelivery({
    scope: "integration build",
    financial_actions_enabled: false,
    submission_enabled: false
  }, validCandidate);
  assert.equal(ok.passed, true);
  const blocked = reviewDelivery({
    scope: "integration build",
    financial_actions_enabled: true,
    submission_enabled: true
  }, validCandidate);
  assert.equal(blocked.passed, false);
});

test("revenue verifier never self-certifies a receipt", () => {
  assert.equal(revenueDisposition({ tx_hash: "0xabc" }), "RECEIPT_REQUIRES_INDEPENDENT_VERIFICATION");
  assert.equal(revenueDisposition({}), "NO_REVENUE_CLAIM");
});