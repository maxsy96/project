"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { officialLinks } from "@/lib/constants";

const navItemsEn = [
  ["Home", "/"],
  ["About", "/about"],
  ["History", "/history"],
  ["Alumni & Achievements", "/achievements"],
  ["Events", "/events"],
  ["Media", "/media"],
  ["Members", "/members"],
  ["Opportunity Hub", "/opportunities"],
  ["Partners", "/partners"],
  ["Contact & Links", "/contact"],
];

const navItemsAr = [
  ["الرئيسية", "/ar"],
  ["عن النادي", "/about"],
  ["تاريخ النادي", "/history"],
  ["الخريجون والإنجازات", "/achievements"],
  ["الفعاليات", "/events"],
  ["الأرشيف الإعلامي", "/media"],
  ["الأعضاء", "/members"],
  ["منصة الفرص", "/ar/opportunities"],
  ["الشركاء", "/ar/partners"],
  ["التواصل والروابط", "/ar/contact"],
];

const officialLinksAr: Record<string, { label: string; note: string }> = {
  Instagram: { label: "إنستغرام", note: "أخبار النادي وأبرز الأنشطة" },
  TikTok: { label: "تيك توك", note: "مقاطع قصيرة من فعاليات الطلبة" },
  Email: { label: "البريد الإلكتروني", note: "البريد الرسمي للنادي" },
  "Opportunity Hub": { label: "منصة الفرص", note: "تصفح الفرص والبرامج والزيارات" },
  "Register Interest": { label: "تسجيل الاهتمام", note: "سجل اهتماماتك للمتابعة المناسبة" },
  Events: { label: "الفعاليات", note: "أنشطة النادي القادمة والسابقة" },
  "Alumni & Achievements": { label: "الخريجون والإنجازات", note: "قصص الخريجين وأثر النادي" },
  "Partner With Us": { label: "الشراكة معنا", note: "إرسال فرص موجهة للطلبة" },
  Contact: { label: "التواصل", note: "الاستفسارات وطلبات التعاون" },
};

function isArabicPath(pathname: string) {
  return pathname === "/ar" || pathname.startsWith("/ar/");
}

function englishPathFor(pathname: string) {
  if (pathname === "/ar") return "/";
  if (pathname.startsWith("/ar/")) return pathname.replace(/^\/ar/, "") || "/";
  return pathname || "/";
}

function arabicPathFor(pathname: string) {
  if (pathname === "/") return "/ar";
  if (pathname === "/register-interest" || pathname.startsWith("/register-interest/")) return `/ar${pathname}`;
  if (pathname === "/partners" || pathname === "/contact" || pathname === "/links" || pathname === "/opportunities") return `/ar${pathname}`;
  return "/ar";
}

function localizedOfficialHref(href: string, isArabic: boolean) {
  if (!isArabic) return href;
  if (href === "/opportunities" || href === "/register-interest" || href === "/partners" || href === "/contact" || href === "/links") return `/ar${href}`;
  return href;
}

export function Navbar() {
  const pathname = usePathname();
  const isArabic = isArabicPath(pathname);
  const navItems = isArabic ? navItemsAr : navItemsEn;
  const registerHref = isArabic ? "/ar/register-interest" : "/register-interest";
  const languageHref = isArabic ? englishPathFor(pathname) : arabicPathFor(pathname);
  const languageLabel = isArabic ? "English" : "العربية";
  const registerLabel = isArabic ? "تسجيل الاهتمام" : "Register Interest";

  return (
    <header dir={isArabic ? "rtl" : "ltr"} className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-[92rem] grid-cols-[auto_auto] items-center justify-between gap-4 px-5 py-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-8">
        <Link href={isArabic ? "/ar" : "/"} className="flex shrink-0 items-center gap-3" aria-label="CAVM Club home">
          <Image src="/images/brand/cavm-logo.png" alt="" width={68} height={68} className="h-16 w-16 rounded-full bg-white object-contain" />
          <span className="leading-tight">
            <span className="block text-base font-bold text-slate-950">{isArabic ? "نادي كلية الزراعة والطب البيطري" : "CAVM Club"}</span>
            <span className="block text-sm font-medium text-slate-500">{isArabic ? "منصة الفرص" : "Opportunity Hub"}</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-start gap-1 overflow-x-auto md:flex xl:justify-center" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-md px-2 py-2 text-xs font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 hover:ring-1 hover:ring-emerald-100 lg:px-2.5 lg:text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Link
            href={registerHref}
            className="rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 lg:px-4 lg:text-sm"
          >
            {registerLabel}
          </Link>
          <Link
            href={languageHref}
            className="rounded-md border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 lg:text-sm"
            lang={isArabic ? "en" : "ar"}
          >
            {languageLabel}
          </Link>
        </div>

        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded-md border border-slate-200 p-2 text-slate-700">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className={`absolute mt-3 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-xl ${isArabic ? "left-0" : "right-0"}`}>
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800">
                {label}
              </Link>
            ))}
            <Link
              href={registerHref}
              className="mt-2 block rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {registerLabel}
            </Link>
            <Link
              href={languageHref}
              className="mt-2 block rounded-md border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              lang={isArabic ? "en" : "ar"}
            >
              {languageLabel}
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  const pathname = usePathname();
  const isArabic = isArabicPath(pathname);
  const links = officialLinks.slice(0, 5).map((link) => ({
    ...link,
    label: isArabic ? officialLinksAr[link.label]?.label || link.label : link.label,
    href: localizedOfficialHref(link.href, isArabic),
  }));

  return (
    <footer dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr_1fr] md:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/images/brand/cavm-logo.png" alt="" width={68} height={68} className="h-16 w-16 rounded-full bg-white object-contain" />
            <div>
              <p className="font-semibold">{isArabic ? "نادي كلية الزراعة والطب البيطري" : "CAVM Club"}</p>
              <p className="text-sm text-slate-300">{isArabic ? "كلية الزراعة والطب البيطري" : "College of Agriculture and Veterinary Medicine"}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            {isArabic
              ? "منصة رسمية منظمة تعرض أنشطة النادي وإنجازاته وخريجيه وشركاءه وفرص الطلبة بأسلوب واضح ومهني."
              : "A professional public presence for CAVM Club activities, achievements, alumni, partners, and student opportunities."}
          </p>
          <a href="mailto:Clubcavm@gmail.com" className="inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Clubcavm@gmail.com
          </a>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-300">{isArabic ? "روابط رسمية" : "Official Links"}</p>
          <div className="grid gap-2 text-sm text-slate-300">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-300">{isArabic ? "ملاحظة الخصوصية" : "Privacy Note"}</p>
          <p className="text-sm leading-6 text-slate-300">
            {isArabic
              ? "تُحفظ بيانات اهتمام الطلبة لاستخدامها في مطابقة الفرص والمتابعة من قبل النادي فقط، ولا تُعرض على الصفحات العامة."
              : "Student interest data is stored for matching and club follow-up only. It is not shown on public pages."}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function MediaMosaic() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {["/images/events/cavm-event-01.jpg", "/images/events/cavm-event-06.jpg", "/images/events/cavm-event-09.jpg", "/images/media/seaworld-internship-1.jpg"].map((src, index) => (
        <div key={src} className={index === 0 ? "col-span-2 overflow-hidden rounded-lg" : "overflow-hidden rounded-lg"}>
          <Image
            src={src}
            alt="CAVM Club activity"
            width={900}
            height={620}
            className="h-full min-h-36 w-full object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
