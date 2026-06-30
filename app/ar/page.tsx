import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "الصفحة العربية" };

const arabicLinks = [
  ["منصة الفرص", "/opportunities", "التدريب، التطوع، البحث، الزيارات، الوظائف، البرامج، والمنح."],
  ["الفعاليات", "/events", "الأنشطة القادمة والسابقة مع حالة التسجيل لكل فعالية."],
  ["الإنجازات والخريجون", "/achievements", "أرشيف إنجازات النادي وقصص الخريجين."],
  ["الأرشيف الإعلامي", "/media", "صور وملفات النادي مرتبة حسب كل فعالية."],
  ["تسجيل الاهتمام", "/register-interest", "سجل اهتماماتك ليتمكن فريق النادي من متابعة الفرص المناسبة."],
  ["التواصل والروابط", "/contact", "البريد الرسمي وروابط التواصل وشركاء النادي."],
] as const;

export default function ArabicPage() {
  return (
    <div dir="rtl" lang="ar">
      <PageHero
        eyebrow="نادي كلية الزراعة والطب البيطري"
        title="منصة منظمة لفرص وأنشطة طلبة الكلية."
        description="هذه الصفحة العربية تساعد الطلبة والشركاء على الوصول بسرعة إلى الفرص، الفعاليات، الإنجازات، الأرشيف الإعلامي، وروابط التواصل الرسمية للنادي."
      >
        <div className="rounded-lg bg-white p-5 text-slate-950 shadow-sm">
          <p className="text-sm leading-7 text-slate-600">
            للتفاصيل الكاملة والنماذج الإدارية، يمكن استخدام الصفحات الإنجليزية الحالية. سيتم توسيع المحتوى العربي تدريجيا.
          </p>
          <Link href="/" className="mt-4 inline-flex rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            English
          </Link>
        </div>
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {arabicLinks.map(([title, href, description]) => (
            <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
