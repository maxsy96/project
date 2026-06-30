import { createAchievementAction, deleteAchievementAction } from "@/lib/admin-actions";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDeletedAchievementIds, getStoredAchievements, storedAchievementToView } from "@/lib/admin-content-store";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await requireAdmin();
  const [databaseAchievements, storedAchievements, deletedAchievementIds] = await Promise.all([
    prisma.achievement.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] }),
    getStoredAchievements(),
    getDeletedAchievementIds(),
  ]);
  const deleted = new Set(deletedAchievementIds);
  const storedIds = new Set(storedAchievements.map((achievement) => achievement.id));
  const achievements = [
    ...storedAchievements.map(storedAchievementToView),
    ...databaseAchievements.filter((achievement) => !deleted.has(achievement.id) && !storedIds.has(achievement.id)),
  ].sort((a, b) => b.year - a.year || b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <AdminShell title="Achievements Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="achievement" action={createAchievementAction} />
        <AdminTable>
          <thead><tr><AdminTh>Achievement</AdminTh><AdminTh>Category</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {achievements.map((achievement) => (
              <tr key={achievement.id} className="transition hover:bg-emerald-50/40">
                <AdminTd><p className="font-semibold text-slate-950">{achievement.title}</p><p className="text-xs text-slate-500">{achievement.year}</p></AdminTd>
                <AdminTd>{achievement.category}</AdminTd>
                <AdminTd><div className="flex flex-wrap gap-2"><Link href={`/admin/achievements/${achievement.id}/edit`} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold transition hover:bg-emerald-50 hover:text-emerald-800">Edit</Link><form action={deleteAchievementAction.bind(null, achievement.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-50">Delete</button></form></div></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
