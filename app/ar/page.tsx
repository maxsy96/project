import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ClipboardCheck, Handshake, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { HomeMediaSlider, type HomeSlide } from "@/components/home-media-slider";

export const metadata: Metadata = {
  title: "الصفحة العربية",
  description: "النسخة العربية لمنصة نادي كلية الزراعة والطب البيطري وفرص الطلبة.",
};

const arabicSlides: HomeSlide[] = [
  {
    title: "تنظيم أسبوع كلية الزراعة والطب البيطري",
    eyebrow: "أسبوع الكلية",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-01.jpeg",
    href: "/media#cavm-week-2026",
    imagePosition: "center 38%",
  },
  {
    title: "مشاركة طلبة الكلية في المعرض الزراعي",
    eyebrow: "تمثيل طلابي",
    imageUrl: "/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg",
    href: "/events/uae-agricultural-conference-and-sector-exhibition-2026",
  },
  {
    title: "حوار الشباب في الاستدامة",
    eyebrow: "الاستدامة",
    imageUrl: "/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg",
    href: "/events/youth-in-sustainability-dialogue-session",
  },
  {
    title: "زيارة تعليمية إلى مزرعة أبحاث الفوعة",
    eyebrow: "تعلم ميداني",
    imageUrl: "/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg",
    href: "/events/uaeu-chancellor-s-visit-to-al-foah-research-farm",
  },
];

const valueCards = [
  {
    title: "وصول أوسع",
    text: "تجمع المنصة الفرص في مكان واحد حتى يتمكن الطلبة من الاطلاع والتقديم بثقة بعيداً عن تشتت الإعلانات أو محدودية الوصول.",
    Icon: ShieldCheck,
  },
  {
    title: "مشاركة وجوه جديدة",
    text: "تساعد المنصة على إشراك عدد أكبر من طلبة الكلية في الأنشطة والزيارات والفرص الخارجية بصورة أكثر شفافية.",
    Icon: UsersRound,
  },
  {
    title: "مطابقة أذكى",
    text: "يمكن للطلبة تسجيل اهتماماتهم الأكاديمية والمهنية ليتمكن النادي من متابعة الفرص الأكثر ارتباطاً بأهدافهم.",
    Icon: Building2,
  },
];

const quickLinks = [
  {
    title: "تسجيل الاهتمام",
    text: "سجل مجالات اهتمامك ليتمكن فريق النادي من متابعتك عند توفر فرص مناسبة.",
    href: "/ar/register-interest",
    Icon: ClipboardCheck,
  },
  {
    title: "الشراكة مع النادي",
    text: "للجهات والمؤسسات الراغبة في مشاركة فرص تدريب أو زيارات أو برامج مع طلبة الكلية.",
    href: "/ar/partners",
    Icon: Handshake,
  },
  {
    title: "التواصل والروابط",
    text: "البريد الرسمي، حسابات التواصل، وروابط الوصول السريع إلى صفحات النادي.",
    href: "/ar/contact",
    Icon: Mail,
  },
];

export default function ArabicHomePage() {
  return (
    <div dir="rtl" lang="ar" className="text-right">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-emerald-300">المنصة الرسمية لنادي الكلية</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              نادي كلية الزراعة والطب البيطري: فرص أوضح، مشاركة أوسع، وأثر طلابي مستدام.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              توفر هذه المنصة حضوراً رسمياً ومنظماً للنادي، وتعرض الأنشطة والإنجازات والأعضاء والخريجين والأرشيف الإعلامي، إلى جانب منصة فرص مركزية تخدم طلبة الكلية والشركاء الخارجيين.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ar/opportunities" className="rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                استكشاف منصة الفرص
              </Link>
              <Link href="/ar/register-interest" className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50">
                تسجيل الاهتمام
              </Link>
              <Link href="/ar/partners" className="rounded-md border border-emerald-300 px-5 py-3 text-sm font-semibold text-emerald-200 hover:bg-white/10">
                الشراكة معنا
              </Link>
            </div>
          </div>
          <HomeMediaSlider slides={arabicSlides} />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">منصة الفرص</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">بوابة مركزية لفرص طلبة الكلية.</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              تجمع منصة الفرص التدريب العملي، التطوع، أدوار مساعد البحث، الزيارات الميدانية، الوظائف، البرامج التدريبية، المنح، المسابقات، المؤتمرات، الفرص الحكومية، والبرامج خارج الدولة في مساحة واحدة واضحة ومنظمة.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {valueCards.map(({ title, text, Icon }) => (
              <article key={title} className="rounded-lg bg-emerald-50 p-5">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {quickLinks.map(({ title, text, href, Icon }) => (
            <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <Icon className="h-7 w-7 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
