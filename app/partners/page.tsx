import type { Metadata } from "next";
import { Building2, FlaskConical, Globe2, GraduationCap, Leaf, Stethoscope, University, UsersRound } from "lucide-react";
import { PartnerSubmissionForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/ui";
import { partnerExamples } from "@/lib/constants";

export const metadata: Metadata = { title: "Partners" };

const partnerTypes = [
  ["Clinics", Stethoscope],
  ["Farms", Leaf],
  ["Food companies", FlaskConical],
  ["Environmental organizations", Globe2],
  ["Research labs", GraduationCap],
  ["Government entities", Building2],
  ["Universities abroad", University],
  ["NGOs", UsersRound],
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Share opportunities with CAVM students."
        description="Organizations, farms, clinics, labs, companies, alumni, faculty, government entities, and universities abroad can submit opportunities for club review."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <div>
          <SectionHeader title="Why partner with CAVM Club?" description="The club can help partners reach motivated students through a fairer, more transparent opportunity pipeline." />
          <div className="mt-6 grid gap-3">
            {partnerExamples.map((item) => (
              <div key={item} className="rounded-lg bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">{item}</div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {partnerTypes.map(([label, Icon]) => (
              <div key={label as string} className="rounded-lg border border-slate-200 bg-white p-4">
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-slate-800">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
        <PartnerSubmissionForm />
      </section>
    </>
  );
}
