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
        <thead><tr><AdminTh>Message</AdminTh><AdminTh>Status</AdminTh><AdminTh>Open</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {messages.map((message) => (
            <tr key={message.id} className={message.status === "unread" ? "bg-emerald-50/40 transition hover:bg-emerald-50" : "transition hover:bg-slate-50"}>
              <AdminTd>
                <p className="font-semibold text-slate-950">{message.status === "unread" ? "New: " : ""}{message.subject}</p>
                <p className="text-xs text-slate-500">{message.name} - {message.email} - {formatDateTime(message.createdAt)}</p>
              </AdminTd>
              <AdminTd><StatusBadge status={message.status} /></AdminTd>
              <AdminTd>
                <details>
                  <summary className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                    Open submission
                  </summary>
                  <div className="mt-3 max-w-2xl rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <p className="whitespace-pre-wrap">{message.message}</p>
                    <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`} className="mt-3 inline-flex rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                      Reply by email
                    </a>
                  </div>
                </details>
              </AdminTd>
              <AdminTd>
                <div className="flex flex-wrap gap-2">
                  <form action={markContactReadAction.bind(null, message.id, "read")}><button title="Mark this submission as read" className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50">Read</button></form>
                  <form action={markContactReadAction.bind(null, message.id, "unread")}><button title="Mark this submission as unread" className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-slate-50">Unread</button></form>
                  <form action={deleteContactAction.bind(null, message.id)}><button title="Delete this submission" className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-50">Delete</button></form>
                </div>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
