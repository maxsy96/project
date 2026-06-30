import { requireAdmin } from "@/lib/auth";
import { getAllOpportunities, getAllStudentInterests } from "@/lib/runtime-store";
import { fromJsonList, matchScore } from "@/lib/utils";
import { sectors, opportunityTypes } from "@/lib/constants";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { Pill } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<{ sector?: string; type?: string }> }) {
  await requireAdmin();
  const { sector = "", type = "" } = await searchParams;
  const [students, opportunities] = await Promise.all([
    getAllStudentInterests(),
    getAllOpportunities(),
  ]);
  students.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const approvedOpportunities = opportunities.filter((opportunity) => opportunity.approvalStatus === "approved" && opportunity.status !== "closed");
  const filtered = students.filter((student) => {
    const studentSectors = fromJsonList(student.interests);
    const prefs = fromJsonList(student.opportunityPreferences);
    return (!sector || studentSectors.includes(sector)) && (!type || prefs.includes(type));
  });

  return (
    <AdminShell title="Student Interest Registrations">
      <form className="mb-5 flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <select name="sector" defaultValue={sector} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">All sectors</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select>
        <select name="type" defaultValue={type} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">All preferences</option>{opportunityTypes.map((item) => <option key={item}>{item}</option>)}</select>
        <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Filter</button>
        <a href="/admin/students/export" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">Export CSV</a>
      </form>
      <AdminTable>
        <thead><tr><AdminTh>Student</AdminTh><AdminTh>Interests</AdminTh><AdminTh>Preferences</AdminTh><AdminTh>Matches</AdminTh></tr></thead>
        <tbody className="divide-y divide-slate-200">
          {filtered.map((student) => {
            const matches = approvedOpportunities
              .map((opportunity) => ({
                opportunity,
                score: matchScore(fromJsonList(student.interests), fromJsonList(student.opportunityPreferences), fromJsonList(opportunity.sectors), opportunity.type),
              }))
              .filter((item) => item.score !== "No match")
              .slice(0, 3);
            return (
              <tr key={student.id} className="transition hover:bg-emerald-50/40">
                <AdminTd><p className="font-semibold text-slate-950">{student.fullName}</p><p className="text-xs text-slate-500">{student.email} - {student.academicYear} - {student.major}</p></AdminTd>
                <AdminTd><div className="flex flex-wrap gap-1">{fromJsonList(student.interests).map((item) => <Pill key={item}>{item}</Pill>)}</div></AdminTd>
                <AdminTd><div className="flex flex-wrap gap-1">{fromJsonList(student.opportunityPreferences).map((item) => <Pill key={item}>{item}</Pill>)}</div></AdminTd>
                <AdminTd>
                  <details>
                    <summary className="cursor-pointer rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                      {matches.length} top matches
                    </summary>
                    <div className="mt-3 grid gap-2">
                      {matches.map(({ opportunity, score }) => (
                        <div key={opportunity.id} className="rounded-md bg-slate-50 p-3">
                          <p className="font-semibold text-slate-950">{opportunity.title}</p>
                          <p className="text-xs text-slate-500">{score} - {opportunity.type}</p>
                        </div>
                      ))}
                      {!matches.length ? <p className="text-xs text-slate-500">No current open matches.</p> : null}
                    </div>
                  </details>
                </AdminTd>
              </tr>
            );
          })}
        </tbody>
      </AdminTable>
    </AdminShell>
  );
}
