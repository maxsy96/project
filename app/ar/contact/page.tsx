import type { Metadata } from "next";
import type { SVGProps } from "react";
import { ArrowUpRight, Award, BriefcaseBusiness, CalendarDays, ClipboardCheck, Handshake, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/ui";
import { officialLinks } from "@/lib/constants";

export const metadata: Metadata = {
  title: "التواصل والروابط",
  description: "التواصل مع نادي كلية الزراعة والطب البيطري والروابط الرسمية.",
};

const linkCopyAr: Record<string, { label: string; note: string }> = {
  Instagram: { label: "إنستغرام", note: "أخبار النادي وأبرز الأنشطة" },
  TikTok: { label: "تيك توك", note: "مقاطع قصيرة من فعاليات الطلبة" },
  Email: { label: "البريد الإلكتروني", note: "البريد الرسمي للنادي" },
  "Opportunity Hub": { label: "منصة الفرص", note: "تصفح الفرص والبرامج والزيارات" },
  "Register Interest": { label: "تسجيل الاهتمام", note: "تسجيل اهتمامات الطلبة للمتابعة" },
  Events: { label: "الفعاليات", note: "أنشطة النادي القادمة والسابقة" },
  "Alumni & Achievements": { label: "الخريجون والإنجازات", note: "قصص الخريجين وأثر النادي" },
  "Partner With Us": { label: "الشراكة معنا", note: "إرسال فرص موجهة للطلبة" },
  Contact: { label: "التواصل", note: "الاستفسارات وطلبات التعاون" },
};

function InstagramMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 4v10.1a4.1 4.1 0 1 1-3.8-4.1" />
      <path d="M14 4c.8 3 2.8 4.8 5.5 5.1" />
    </svg>
  );
}

const linkIcons = {
  Instagram: InstagramMark,
  TikTok: TikTokMark,
  Email: Mail,
  "Opportunity Hub": BriefcaseBusiness,
  "Register Interest": ClipboardCheck,
  Events: CalendarDays,
  "Alumni & Achievements": Award,
  "Partner With Us": Handshake,
  Contact: MessageCircle,
};

function localizedHref(href: string) {
  if (href === "/opportunities" || href === "/register-interest" || href === "/partners" || href === "/contact" || href === "/links") return `/ar${href}`;
  return href;
}

export default function ArabicContactPage() {
  return (
    <>
      <PageHero
        eyebrow="التواصل والروابط"
        title="تواصلوا مع نادي الكلية وادخلوا إلى الروابط الرسمية."
        description="تُستخدم هذه الصفحة للاستفسارات، طلبات التعاون، قصص الخريجين، تحديثات الأرشيف الإعلامي، ملاحظات منصة الفرص، والوصول السريع إلى قنوات النادي الرسمية."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside>
          <SectionHeader
            title="بيانات التواصل الرسمية"
            description="يرجى استخدام البريد الرسمي للنادي للاستفسارات الطلابية، التعاون مع الشركاء، تحديثات الأرشيف الإعلامي، والمتابعة المرتبطة بمنصة الفرص."
          />
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
            <p><strong className="text-slate-950">البريد الإلكتروني:</strong> <a href="mailto:Clubcavm@gmail.com" className="font-semibold text-emerald-700">Clubcavm@gmail.com</a></p>
            <p><strong className="text-slate-950">الموقع:</strong> كلية الزراعة والطب البيطري، جامعة الإمارات العربية المتحدة</p>
            <p><strong className="text-slate-950">حسابات التواصل:</strong> إنستغرام وتيك توك ضمن الروابط الرسمية أدناه.</p>
          </div>
          <div className="mt-8">
            <SectionHeader title="الروابط الرسمية" description="حسابات التواصل، نماذج الطلبة، صفحة الشركاء، الفعاليات، الأرشيف، ومنصة الفرص في مكان واحد." />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
              {officialLinks.filter((link) => link.href !== "/contact").map((link) => {
                const Icon = linkIcons[link.label as keyof typeof linkIcons] || ArrowUpRight;
                const copy = linkCopyAr[link.label] || { label: link.label, note: link.note };
                return (
                  <a key={link.href} href={localizedHref(link.href)} className="flex aspect-square flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-slate-950">{copy.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{copy.note}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </aside>
        <ContactForm locale="ar" />
      </section>
    </>
  );
}
