import Link from "next/link";
import { notFound } from "next/navigation";
import { updateAlumniAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getAlumniById } from "@/lib/runtime-store";
import { AdminShell } from "@/components/admin-shell";
import { AlumniAdminForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function EditAlumniPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const person = await getAlumniById(id);
  if (!person) notFound();

  return (
    <AdminShell title="Edit Alumni Profile">
      <div className="grid gap-5">
        <Link href="/admin/alumni" className="w-fit rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
          Back to alumni
        </Link>
        <AlumniAdminForm action={updateAlumniAction.bind(null, id)} person={person} />
      </div>
    </AdminShell>
  );
}
