import type { Metadata } from "next";
import Link from "next/link";
import { Award, BriefcaseBusiness, Building2, CalendarDays, FlaskConical, Globe2, Leaf, Microscope, Plane, Stethoscope, UsersRound } from "lucide-react";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "منصة الفرص",
  description: "مقدمة عربية لمنصة فرص طلبة كلية الزراعة والطب البيطري.",
};

const opportunityGroups = [
  ["الطب البيطري", "تدريب، زيارات سريرية، ومهارات ميدانية مرتبطة بالممارسة البيطرية.", Stethoscope],
  ["الزراعة", "زيارات مزارع، إنتاج نباتي، تقنيات زراعية، واستدامة الموارد.", Leaf],
  ["علوم الغذاء", "فرص في سلامة الغذاء، التصنيع، الابتكار، والمعارض المتخصصة.", FlaskConical],
  ["البيئة والاستدامة", "برامج ومبادرات تعزز الوعي البيئي والعمل المجتمعي.", Globe2],
  ["البحث العلمي", "أدوار مساعد بحث، مختبرات، مشاريع تطبيقية، ومؤتمرات.", Microscope],
  ["القطاع الحكومي", "فرص وبرامج مع جهات حكومية ومؤسسات وطنية ذات صلة.", Building2],
];

const opportunityTypes = [
  ["تدريب عملي", BriefcaseBusiness],
  ["تطوع", UsersRound],
  ["مساعد بحث", Microscope],
  ["زيارات ميدانية", Leaf],
  ["منح ومسابقات", Award],
  ["مؤتمرات وبرامج خارج الدولة", Plane],
];

export default function ArabicOpportunitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="منصة فرص CAVM"
        title="منصة منظمة لفرص طلبة كلية الزراعة والطب البيطري."
        description="تساعد المنصة الطلبة على الوصول إلى التدريب العملي، التطوع، أدوار مساعد البحث، الزيارات الميدانية، الوظائف، البرامج التدريبية، المنح، المسابقات، المؤتمرات، الفرص الحكومية، والبرامج خارج الدولة من مكان واحد واضح."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {opportunityGroups.map(([title, text, Icon]) => (
            <article key={title as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-slate-950">{title as string}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text as string}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">كيف تعمل المنصة؟</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">الهدف هو الشفافية وتوسيع الوصول.</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              يستطيع الطالب تسجيل اهتماماته، ثم يستخدم فريق النادي هذه المعلومات لمتابعة الفرص الأكثر ارتباطاً بمجاله الأكاديمي ومرحلته الدراسية وأهدافه المهنية. هذا لا يستبدل المتطلبات الرسمية لكل جهة، لكنه يجعل الوصول إلى الفرص أكثر وضوحاً وعدلاً.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ar/register-interest" className="rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                تسجيل الاهتمام
              </Link>
              <Link href="/opportunities" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-emerald-300">
                عرض قائمة الفرص الحالية
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {opportunityTypes.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg bg-emerald-50 p-4">
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-900">{label as string}</p>
              </div>
            ))}
            <div className="rounded-lg bg-slate-950 p-4 text-white sm:col-span-2">
              <CalendarDays className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              <p className="mt-3 text-sm leading-7 text-slate-200">
                يتم تحديث الفرص والفعاليات بحسب ما يرد إلى النادي من الكلية، الشركاء، الخريجين، والجهات الخارجية.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
