export const opportunityStatuses = [
  "open", "closing soon", "closed", "completed", "cancelled", "awaiting confirmation",
] as const;

export type OpportunityAvailability = {
  status: string;
  deadline: Date | string | null;
  approvalStatus: string;
};

const acceptingStatuses = new Set(["open", "closing soon"]);

/** Evaluate the latest merged record; never write a derived status over an admin edit. */
export function getOpportunityStatus(opportunity: OpportunityAvailability, now = Date.now()) {
  const status = opportunity.status.trim().toLowerCase();
  if (!acceptingStatuses.has(status)) {
    return opportunityStatuses.some((value) => value === status) ? status : "closed";
  }
  if (opportunity.deadline !== null) {
    const deadline = new Date(opportunity.deadline).getTime();
    // Invalid deadlines cannot authorize applications. An explicit null permits rolling intake.
    if (!Number.isFinite(deadline) || deadline <= now) return "closed";
  }
  if (opportunity.approvalStatus !== "approved") return "awaiting confirmation";
  return status;
}

export function isOpportunityOpen(opportunity: OpportunityAvailability, now = Date.now()) {
  return acceptingStatuses.has(getOpportunityStatus(opportunity, now));
}

export function sortOpportunitiesForDisplay<T extends OpportunityAvailability>(opportunities: T[], now = Date.now()) {
  const rank = (opportunity: T) => opportunityStatuses.indexOf(getOpportunityStatus(opportunity, now) as typeof opportunityStatuses[number]);
  const deadline = (opportunity: T) => opportunity.deadline === null ? Number.MAX_SAFE_INTEGER : new Date(opportunity.deadline).getTime();
  return [...opportunities].sort((a, b) => rank(a) - rank(b) || deadline(a) - deadline(b));
}
