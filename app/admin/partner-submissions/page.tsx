import { approvePartnerSubmissionAction, deletePartnerSubmissionAction, rejectPartnerSubmissionAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getAllPartnerSubmissions } from "@/lib/runtime-store";
import { fromJsonList, formatDate } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { Pill, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PartnerSubmissionsPage() {
  await requireAdmin();
  const submissions = (await getAllPartnerSubmissions()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return (
    <AdminShell title="Partner Submissions">
      <AdminTable>
        <thead><tr><AdminTh>Submission</AdminTh><AdminTh>Sectors</AdminTh><AdminTh>Status</AdminTh><AdminTh>Open</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {submissions.map((submission) => (
            <tr key={submission.id} className={submission.approvalStatus === "pending" ? "bg-amber-50/30 transition hover:bg-amber-50" : "transition hover:bg-slate-50"}>
              <AdminTd>
                <p className="font-semibold text-slate-950">{submission.opportunityTitle}</p>
                <p className="text-xs text-slate-500">{submission.organizationName} - {submission.contactPerson} - {submission.email}</p>
                <p className="mt-1 text-xs text-slate-500">Deadline: {formatDate(submission.deadline)}</p>
              </AdminTd>
              <AdminTd><div className="flex flex-wrap gap-1">{fromJsonList(submission.sectors).map((item) => <Pill key={item}>{item}</Pill>)}</div></AdminTd>
              <AdminTd><StatusBadge status={submission.approvalStatus} /></AdminTd>
              <AdminTd>
                <details>
                  <summary className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                    Open submission
                  </summary>
                  <div className="mt-3 grid max-w-2xl gap-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <p className="whitespace-pre-wrap">{submission.description}</p>
                    <p><span className="font-semibold">Eligibility:</span> {submission.eligibility}</p>
                    <p><span className="font-semibold">Location:</span> {submission.location}</p>
                    {submission.notes ? <p><span className="font-semibold">Notes:</span> {submission.notes}</p> : null}
                    {submission.applicationUrl ? <a href={submission.applicationUrl} className="font-semibold text-emerald-700 hover:text-emerald-900">Open application link</a> : null}
                    <a href={`mailto:${submission.email}?subject=Re: ${encodeURIComponent(submission.opportunityTitle)}`} className="inline-flex w-fit rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                      Email partner
                    </a>
                  </div>
                </details>
              </AdminTd>
              <AdminTd>
                <div className="flex flex-wrap gap-2">
                  <form action={approvePartnerSubmissionAction.bind(null, submission.id)}><button title="Approve and create opportunity" className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50">Approve</button></form>
                  <form action={rejectPartnerSubmissionAction.bind(null, submission.id)}><button title="Reject this partner submission" className="rounded-md border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-50">Reject</button></form>
                  <form action={deletePartnerSubmissionAction.bind(null, submission.id)}><button title="Delete this partner submission" className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-50">Delete</button></form>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
