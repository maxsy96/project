import type { Metadata } from "next";
import Link from "next/link";
import { getAllOpportunities, getStudentInterestById } from "@/lib/runtime-store";
import { fromJsonList, matchScore } from "@/lib/utils";
import { OpportunityCard } from "@/components/cards";
import { PageHero, Pill } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "تم تسجيل الاهتمام" };

export default async function ArabicRegisterSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const student = id ? await getStudentInterestById(Number(id)) : null;
  const opportunities = (await getAllOpportunities())
    .filter((opportunity) => opportunity.approvalStatus === "approved" && opportunity.status !== "closed")
    .sort((a, b) => (a.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER));
  const matches = student
    ? opportunities
        .map((opportunity) => ({
          opportunity,
          score: matchScore(fromJsonList(student.interests), fromJsonList(student.opportunityPreferences), fromJsonList(opportunity.sectors), opportunity.type),
        }))
        .filter((item) => item.score !== "No match")
        .slice(0, 6)
    : [];

  return (
    <>
      <PageHero
        eyebrow="تم حفظ التسجيل"
        title="تم استلام تسجيل اهتمامك."
        description="شكراً لإرسال بياناتك. سيقوم فريق نادي الكلية بمتابعة الفرص المناسبة والتواصل عند الحاجة."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {student ? (
          <div className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-xl font-semibold text-slate-950">شكراً، {student.fullName}</h2>
            <p className="mt-2 text-sm leading-7 text-emerald-900">
              تم حفظ نموذج الاهتمام. يستطيع فريق النادي مراجعة مجالات اهتمامك ومتابعتك عند توفر فرصة مناسبة.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {fromJsonList(student.interests).map((interest) => <Pill key={interest}>{interest}</Pill>)}
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-2xl font-semibold text-slate-950">فرص قد تكون مناسبة حالياً</h2>
          <Link href="/opportunities" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-emerald-300">
            تصفح جميع الفرص
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {matches.map(({ opportunity, score }) => (
            <div key={opportunity.id} className="grid gap-3">
              <Pill>{score}</Pill>
              <OpportunityCard opportunity={opportunity} />
            </div>
          ))}
        </div>
        {!matches.length ? (
          <p className="mt-6 rounded-md bg-slate-100 p-4 text-sm font-medium text-slate-700">
            لا توجد مطابقات مباشرة حالياً. بياناتك محفوظة للمتابعة المستقبلية من قبل نادي الكلية.
          </p>
        ) : null}
      </section>
    </>
  );
}
