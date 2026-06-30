export function isOpportunityOpen(status: string) {
  return !status.toLowerCase().includes("closed");
}
