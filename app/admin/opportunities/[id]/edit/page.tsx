import { notFound } from "next/navigation";
import { updateOpportunityAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { OpportunityAdminForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({ where: { id: Number(id) } });
  if (!opportunity) notFound();
  return (
    <AdminShell title="Edit Opportunity">
      <OpportunityAdminForm action={updateOpportunityAction.bind(null, opportunity.id)} opportunity={opportunity} />
    </AdminShell>
  );
}
