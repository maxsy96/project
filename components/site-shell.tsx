import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { officialLinks } from "@/lib/constants";

const navItems = [
  ["Home", "/"],
  ["About", "/about"],
  ["History", "/history"],
  ["Achievements", "/achievements"],
  ["Events", "/events"],
  ["Media", "/media"],
  ["Members", "/members"],
  ["Alumni", "/alumni"],
  ["Opportunity Hub", "/opportunities"],
  ["Partners", "/partners"],
  ["Official Links", "/links"],
  ["Contact", "/contact"],
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-[92rem] grid-cols-[auto_auto] items-center justify-between gap-4 px-5 py-3 md:px-8 2xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="CAVM Club home">
          <Image src="/images/brand/cavm-logo.png" alt="" width={68} height={68} className="h-16 w-16 rounded-full bg-white object-contain" />
          <span className="leading-tight">
            <span className="block text-base font-bold text-slate-950">CAVM Club</span>
            <span className="block text-sm font-medium text-slate-500">Opportunity Hub</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center justify-center gap-1 2xl:flex" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-950 ${label === "Home" ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100" : "text-slate-700"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/register-interest"
          className="hidden shrink-0 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 2xl:inline-flex"
        >
          Register Interest
        </Link>

        <details className="relative 2xl:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded-md border border-slate-200 p-2 text-slate-700">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {label}
              </Link>
            ))}
            <Link
              href="/register-interest"
              className="mt-2 block rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Register Interest
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.1fr_1fr_1fr] md:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image src="/images/brand/cavm-logo.png" alt="" width={68} height={68} className="h-16 w-16 rounded-full bg-white object-contain" />
            <div>
              <p className="font-semibold">CAVM Club</p>
              <p className="text-sm text-slate-300">College of Agriculture and Veterinary Medicine</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            A professional public presence for CAVM Club activities, achievements, alumni, partners, and student opportunities.
          </p>
          <a href="mailto:Clubcavm@gmail.com" className="inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200">
            Clubcavm@gmail.com
          </a>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-300">Official Links</p>
          <div className="grid gap-2 text-sm text-slate-300">
            {officialLinks.slice(0, 5).map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-emerald-300">Privacy Note</p>
          <p className="text-sm leading-6 text-slate-300">
            Student interest data is stored for matching and club follow-up only. It is not shown on public pages.
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
