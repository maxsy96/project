import Link from "next/link";
import { notFound } from "next/navigation";
import { updateAchievementAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getDeletedAchievementIds, getStoredAchievements, storedAchievementToView } from "@/lib/admin-content-store";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin-shell";
import { AchievementAdminForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const stored = (await getStoredAchievements()).find((item) => item.id === id);
  const achievement = stored ? storedAchievementToView(stored) : await prisma.achievement.findUnique({ where: { id } });
  if (!achievement || (await getDeletedAchievementIds()).includes(id)) notFound();

  return (
    <AdminShell title="Edit Achievement">
      <div className="grid gap-5">
        <Link href="/admin/achievements" className="w-fit rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-50">
          Back to achievements
        </Link>
        <AchievementAdminForm action={updateAchievementAction.bind(null, id)} achievement={achievement} />
      </div>
    </AdminShell>
  );
}
