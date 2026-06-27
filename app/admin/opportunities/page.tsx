import Link from "next/link";
import { archiveOpportunityAction, deleteOpportunityAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fromJsonList, matchScore } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { ButtonLink, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminOpportunitiesPage() {
  await requireAdmin();
  const [opportunities, students] = await Promise.all([
    prisma.opportunity.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.studentInterest.findMany(),
  ]);

  return (
    <AdminShell title="Opportunities">
      <div className="mb-5 flex justify-end">
        <ButtonLink href="/admin/opportunities/new">Create opportunity</ButtonLink>
      </div>
      <AdminTable>
        <thead><tr><AdminTh>Opportunity</AdminTh><AdminTh>Status</AdminTh><AdminTh>Matches</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {opportunities.map((opportunity) => {
            const matching = students.filter((student) => matchScore(fromJsonList(student.interests), fromJsonList(student.opportunityPreferences), fromJsonList(opportunity.sectors), opportunity.type) !== "No match").length;
            return (
              <tr key={opportunity.id}>
                <AdminTd>
                  <p className="font-semibold text-slate-950">{opportunity.title}</p>
                  <p className="text-xs text-slate-500">{opportunity.organization} - {opportunity.type}</p>
                </AdminTd>
                <AdminTd><StatusBadge status={opportunity.status} /></AdminTd>
                <AdminTd>{matching} students</AdminTd>
                <AdminTd>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/opportunities/${opportunity.id}/edit`} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold">Edit</Link>
                    <form action={archiveOpportunityAction.bind(null, opportunity.id)}><button className="rounded-md border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800">Archive</button></form>
                    <form action={deleteOpportunityAction.bind(null, opportunity.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form>
                  </div>
                </AdminTd>
              </tr>
            );
          })}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
