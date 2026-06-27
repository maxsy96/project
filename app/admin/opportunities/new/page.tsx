import { createOpportunityAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";
import { OpportunityAdminForm } from "@/components/admin-forms";

export default async function NewOpportunityPage() {
  await requireAdmin();
  return (
    <AdminShell title="Create Opportunity">
      <OpportunityAdminForm action={createOpportunityAction} />
    </AdminShell>
  );
}
