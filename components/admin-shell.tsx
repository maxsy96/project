import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminSession, currentAdminUsername } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit-log";

const adminLinks = [
  ["Overview", "/admin"],
  ["Opportunities", "/admin/opportunities"],
  ["Students", "/admin/students"],
  ["Events", "/admin/events"],
  ["Achievements", "/admin/achievements"],
  ["Media", "/admin/media"],
  ["Members", "/admin/members"],
  ["Alumni", "/admin/alumni"],
  ["Partner submissions", "/admin/partner-submissions"],
  ["Contact messages", "/admin/contact-submissions"],
  ["Audit log", "/admin/audit-log"],
];

async function logoutAction() {
  "use server";
  const actor = await currentAdminUsername();
  await logAuditEvent({ actor, action: "logged out", entityType: "Auth" });
  await clearAdminSession();
  redirect("/admin/login");
}

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[260px_1fr] md:px-8">
      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="px-3 text-sm font-semibold uppercase text-emerald-700">Admin</p>
        <nav className="mt-3 grid gap-1">
          {adminLinks.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              {label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-4 border-t border-slate-200 pt-4">
          <button className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Logout
          </button>
        </form>
      </aside>
      <main>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase text-emerald-700">CAVM Club Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
