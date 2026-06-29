import { deleteContactAction, markContactReadAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getAllContactSubmissions } from "@/lib/runtime-store";
import { formatDateTime } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ContactSubmissionsPage() {
  await requireAdmin();
  const messages = (await getAllContactSubmissions()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return (
    <AdminShell title="Contact Messages">
      <AdminTable>
        <thead><tr><AdminTh>Message</AdminTh><AdminTh>Status</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {messages.map((message) => (
            <tr key={message.id}>
              <AdminTd>
                <p className="font-semibold text-slate-950">{message.subject}</p>
                <p className="text-xs text-slate-500">{message.name} - {message.email} - {formatDateTime(message.createdAt)}</p>
                <p className="mt-2 max-w-2xl text-sm">{message.message}</p>
              </AdminTd>
              <AdminTd><StatusBadge status={message.status} /></AdminTd>
              <AdminTd>
                <div className="flex flex-wrap gap-2">
                  <form action={markContactReadAction.bind(null, message.id, "read")}><button className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800">Read</button></form>
                  <form action={markContactReadAction.bind(null, message.id, "unread")}><button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold">Unread</button></form>
                  <form action={deleteContactAction.bind(null, message.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
