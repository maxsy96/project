import { createAchievementAction, deleteAchievementAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoredAchievements, storedAchievementToView } from "@/lib/admin-content-store";
import { AdminShell } from "@/components/admin-shell";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin-table";
import { SimpleContentForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await requireAdmin();
  const [databaseAchievements, storedAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: [{ year: "desc" }, { createdAt: "desc" }] }),
    getStoredAchievements(),
  ]);
  const achievements = [
    ...storedAchievements.map(storedAchievementToView),
    ...databaseAchievements,
  ].sort((a, b) => b.year - a.year || b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <AdminShell title="Achievements Management">
      <div className="grid gap-6">
        <SimpleContentForm kind="achievement" action={createAchievementAction} />
        <AdminTable>
          <thead><tr><AdminTh>Achievement</AdminTh><AdminTh>Category</AdminTh><AdminTh>Actions</AdminTh></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <AdminTd><p className="font-semibold text-slate-950">{achievement.title}</p><p className="text-xs text-slate-500">{achievement.year}</p></AdminTd>
                <AdminTd>{achievement.category}</AdminTd>
                <AdminTd><form action={deleteAchievementAction.bind(null, achievement.id)}><button className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-800">Delete</button></form></AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminShell>
  );
}
