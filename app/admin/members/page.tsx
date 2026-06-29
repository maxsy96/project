import { createMemberAction, deleteMemberAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getAllMembers } from "@/lib/runtime-store";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  await requireAdmin();
  const members = (await getAllMembers()).sort((a, b) => a.order - b.order);
  return (
    <AdminShell title="Members Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="member" action={createMemberAction} />
        <AdminTable>
          <thead><tr><AdminTh>Member</AdminTh><AdminTh>Committee</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member) => (
              <tr key={member.id}>
                <AdminTd>
                  <p className="font-semibold text-slate-950">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role} - {member.areaOfInterest}</p>
                  {member.email ? <p className="text-xs font-medium text-emerald-700">{member.email}</p> : null}
                </AdminTd>
                <AdminTd>{member.committee}</AdminTd>
                <AdminTd><form action={deleteMemberAction.bind(null, member.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
