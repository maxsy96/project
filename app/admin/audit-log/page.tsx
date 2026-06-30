import Link from "next/link";
import { readAuditLog } from "@/lib/audit-log";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { EmptyState, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

const typeFilters = ["All", "Auth", "Opportunity", "Event", "Achievement", "Media", "Member", "Alumni", "Partner submission", "Contact message"];

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  await requireAdmin();
  const { type } = await searchParams;
  const entries = await readAuditLog();
  const filtered = type && type !== "All" ? entries.filter((entry) => entry.entityType === type) : entries;

  return (
    <AdminShell title="Audit Log">
      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Admin activity history</h2>
            <p className="mt-1 text-sm text-slate-600">Tracks admin logins and content changes. The newest actions appear first.</p>
          </div>
          <p className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{entries.length} saved entries</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {typeFilters.map((item) => {
            const active = (type || "All") === item;
            const href = item === "All" ? "/admin/audit-log" : `/admin/audit-log?type=${encodeURIComponent(item)}`;
            return (
              <Link
                key={item}
                href={href}
                className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${active ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                {item}
              </Link>
            );
          })}
        </div>
      </section>

      {filtered.length ? (
        <AdminTable>
          <thead>
            <tr>
              <AdminTh>Action</AdminTh>
              <AdminTh>Admin</AdminTh>
              <AdminTh>Item</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Details</AdminTh>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((entry) => (
              <tr key={entry.id} className="transition hover:bg-emerald-50/50">
                <AdminTd>
                  <p className="font-semibold text-slate-950">{entry.action}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(new Date(entry.createdAt))}</p>
                </AdminTd>
                <AdminTd>
                  <p className="font-medium text-slate-800">{entry.actor}</p>
                  {entry.ipAddress ? <p className="text-xs text-slate-500">{entry.ipAddress}</p> : null}
                </AdminTd>
                <AdminTd>
                  <p className="font-medium text-slate-800">{entry.entityName || entry.entityType}</p>
                  <p className="text-xs text-slate-500">{entry.entityType}{entry.entityId ? ` #${entry.entityId}` : ""}</p>
                </AdminTd>
                <AdminTd><StatusBadge status={entry.status} /></AdminTd>
                <AdminTd>
                  {Object.keys(entry.details).length ? (
                    <details>
                      <summary className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                        View details
                      </summary>
                      <dl className="mt-3 grid gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-700">
                        {Object.entries(entry.details).map(([key, value]) => (
                          <div key={key}>
                            <dt className="font-semibold text-slate-500">{key}</dt>
                            <dd className="mt-0.5 break-words">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  ) : (
                    <span className="text-xs text-slate-500">No extra details</span>
                  )}
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : (
        <EmptyState title="No audit entries found" description="Admin changes will appear here after the next saved action." />
      )}
    </AdminShell>
  );
}
