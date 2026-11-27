const truthy = (value) => value === true;

export function evaluateOpportunity(candidate = {}) {
  const checks = {
    sourceUrl: typeof candidate.source_url === "string" && candidate.source_url.startsWith("https://"),
    namedSponsor: typeof candidate.sponsor === "string" && candidate.sponsor.trim().length > 1,
    actualFunding: truthy(candidate.actual_funding_verified) &&
      Number(candidate.funded_amount ?? 0) > 0 &&
      typeof candidate.currency === "string" &&
      typeof candidate.funding_evidence_url === "string" &&
      candidate.funding_evidence_url.startsWith("https://"),
    aiPermission: truthy(candidate.ai_participation_allowed),
    indiaEligibility: truthy(candidate.india_eligibility_verified),
    zeroUpfront: candidate.entry_fee === 0 &&
      candidate.deposit_required === false &&
      candidate.owner_funded_gas_required === false,
    deadlineKnown: typeof candidate.deadline === "string" && candidate.deadline.length > 5,
    scopeKnown: typeof candidate.scope === "string" && candidate.scope.trim().length > 10
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  return {
    checks,
    passed,
    total,
    decision: passed === total ? "QUALIFIED_FOR_HUMAN_REVIEW" : "BLOCKED_OR_UNVERIFIED",
    autonomousSubmissionAllowed: false
  };
}

export function buildEngineeringPlan(candidate = {}) {
  return {
    title: candidate.title ?? "Unspecified work item",
    scope: candidate.scope ?? "Scope not established",
    work_packages: [
      "Confirm buyer authority, scope, acceptance and IP terms",
      "Create a reproducible implementation plan",
      "Build only in an isolated workspace",
      "Run automated tests and static security checks",
      "Independent review before any external delivery"
    ],
    prohibited_without_separate_authorization: [
      "external submission",
      "wallet signing",
      "trading or token transfer",
      "payment or deposit",
      "production credential access"
    ]
  };
}

export function reviewDelivery(artifact = {}, candidate = {}) {
  const checks = {
    artifactPresent: Boolean(artifact && typeof artifact === "object"),
    scopedWork: typeof artifact.scope === "string" && artifact.scope.length > 0,
    noFinancialAuthority: artifact.financial_actions_enabled === false,
    noExternalSubmission: artifact.submission_enabled === false,
    opportunityNotMisrepresented: candidate.synthetic_test === true ||
      (candidate.actual_funding_verified === true && candidate.funding_evidence_url?.startsWith("https://"))
  };
  return {
    checks,
    passed: Object.values(checks).every(Boolean),
    decision: Object.values(checks).every(Boolean) ? "QA_PASS" : "QA_BLOCK"
  };
}

export function revenueDisposition(receipt = {}) {
  // A pilot agent never self-certifies revenue. This is only a hand-off to an independent verifier.
  if (!receipt || Object.keys(receipt).length === 0) return "NO_REVENUE_CLAIM";
  return "RECEIPT_REQUIRES_INDEPENDENT_VERIFICATION";
}