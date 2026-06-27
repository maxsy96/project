import { approvePartnerSubmissionAction, deletePartnerSubmissionAction, rejectPartnerSubmissionAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fromJsonList, formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { Pill, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PartnerSubmissionsPage() {
  await requireAdmin();
  const submissions = await prisma.partnerSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Partner Submissions">
      <AdminTable>
        <thead><tr><AdminTh>Submission</AdminTh><AdminTh>Sectors</AdminTh><AdminTh>Status</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <AdminTd>
                <p className="font-semibold text-slate-950">{submission.opportunityTitle}</p>
                <p className="text-xs text-slate-500">{submission.organizationName} - {submission.contactPerson} - {submission.email}</p>
                <p className="mt-2 max-w-xl text-sm">{submission.description}</p>
                <p className="mt-1 text-xs text-slate-500">Deadline: {formatDate(submission.deadline)}</p>
              </AdminTd>
              <AdminTd><div className="flex flex-wrap gap-1">{fromJsonList(submission.sectors).map((item) => <Pill key={item}>{item}</Pill>)}</div></AdminTd>
              <AdminTd><StatusBadge status={submission.approvalStatus} /></AdminTd>
              <AdminTd>
                <div className="flex flex-wrap gap-2">
                  <form action={approvePartnerSubmissionAction.bind(null, submission.id)}><button className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">Approve</button></form>
                  <form action={rejectPartnerSubmissionAction.bind(null, submission.id)}><button className="rounded-md border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800">Reject</button></form>
                  <form action={deletePartnerSubmissionAction.bind(null, submission.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
