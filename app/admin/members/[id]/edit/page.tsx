import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMemberAction } from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { getMemberById } from "@/lib/runtime-store";
import { AdminShell } from "@/components/admin-shell";
import { MemberAdminForm } from "@/components/admin-forms";

export const dynamic = "force-dynamic";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) notFound();

  const member = await getMemberById(id);
  if (!member) notFound();

  return (
    <AdminShell title="Edit Member">
      <div className="grid gap-5">
        <Link href="/admin/members" className="w-fit rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold">
          Back to members
        </Link>
        <MemberAdminForm action={updateMemberAction.bind(null, id)} member={member} />
      </div>
    </AdminShell>
  );
}
