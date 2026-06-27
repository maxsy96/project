import { createMediaAction, deleteMediaAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdmin();
  const media = await prisma.mediaItem.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Media Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="media" action={createMediaAction} />
        <AdminTable>
          <thead><tr><AdminTh>Media</AdminTh><AdminTh>Type</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {media.map((item) => (
              <tr key={item.id}>
                <AdminTd><p className="font-semibold text-slate-950">{item.title}</p><p className="text-xs text-slate-500">{item.category}</p></AdminTd>
                <AdminTd>{item.mediaType}</AdminTd>
                <AdminTd><form action={deleteMediaAction.bind(null, item.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
