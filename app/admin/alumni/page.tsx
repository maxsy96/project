import { createAlumniAction, deleteAlumniAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function AdminAlumniPage() {
  await requireAdmin();
  const alumni = await prisma.alumni.findMany({ orderBy: { graduationYear: "desc" } });
  return (
    <AdminShell title="Alumni Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="alumni" action={createAlumniAction} />
        <AdminTable>
          <thead><tr><AdminTh>Alumni</AdminTh><AdminTh>Sector</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {alumni.map((person) => (
              <tr key={person.id}>
                <AdminTd><p className="font-semibold text-slate-950">{person.name}</p><p className="text-xs text-slate-500">{person.graduationYear} - {person.currentRole}</p></AdminTd>
                <AdminTd>{person.sector}</AdminTd>
                <AdminTd><form action={deleteAlumniAction.bind(null, person.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
