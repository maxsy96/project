import type { Metadata } from "next";
import type { SVGProps } from "react";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  Handshake,
  Mail,
  MessageCircle,
} from "lucide-react";
import { officialLinks } from "@/lib/constants";
import { ContactForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Contact & Links" };

const faqs = [
  ["Is the Opportunity Hub public?", "Opportunity listings are public, but student registrations are private and visible only in admin."],
  ["Can partners submit opportunities?", "Yes. Submissions are saved as pending review before they become public listings."],
  ["Can students choose more than one sector?", "Yes. Students can select multiple interests and opportunity preferences for better matching."],
  ["Do forms notify the club?", "Yes. Website forms are saved in admin and can send email notifications to the official CAVM Club inbox when email delivery is configured."],
];

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

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Links"
        title="Reach CAVM Club and access official links."
        description="Use this page for questions, collaboration requests, alumni stories, media updates, Opportunity Hub feedback, and quick access to official CAVM Club channels."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside>
          <SectionHeader title="Club contact details" description="Use the official CAVM Club mailbox for student questions, partner collaborations, media updates, and Opportunity Hub follow-up." />
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
            <p><strong className="text-slate-950">Email:</strong> <a href="mailto:Clubcavm@gmail.com" className="font-semibold text-emerald-700">Clubcavm@gmail.com</a></p>
            <p><strong className="text-slate-950">Location:</strong> College of Agriculture and Veterinary Medicine, UAEU</p>
            <p><strong className="text-slate-950">Social:</strong> Instagram and TikTok are listed below with the rest of the official links.</p>
          </div>
          <div className="mt-8">
            <SectionHeader title="Official links" description="Social channels, student forms, partner access, events, media, and the Opportunity Hub in one place." />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
              {officialLinks.filter((link) => link.href !== "/contact").map((link) => (
                <a key={link.href} href={link.href} className="flex aspect-square flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50">
                  <span className="flex items-start justify-between gap-2">
                    {(() => {
                      const Icon = linkIcons[link.label as keyof typeof linkIcons] || ArrowUpRight;
                      return (
                        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      );
                    })()}
                    <ArrowUpRight className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-950">{link.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{link.note}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold text-slate-950">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
