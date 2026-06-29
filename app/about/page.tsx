import type { Metadata } from "next";
import { FlaskConical, HandHeart, Leaf, Microscope, ShieldCheck, Sprout } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

const values = [
  ["Transparency", "Opportunities should be visible, organized, and easier to access.", ShieldCheck],
  ["Student development", "Activities should build confidence, skills, and professional readiness.", Sprout],
  ["Community engagement", "The club connects college knowledge with people, farms, schools, and public events.", HandHeart],
  ["Professional growth", "Students practice communication, leadership, field conduct, and teamwork.", Leaf],
  ["Research and innovation", "Projects, posters, and assistant roles help students explore serious academic pathways.", Microscope],
  ["Sustainability", "Food security, environment, waste reduction, and responsible production shape the club identity.", FlaskConical],
];

const siteReasons = [
  ["Fair Access", "Opportunities should be visible to everyone, not only to those who already know where to look.", ShieldCheck],
  ["Public Memory", "Photos, PDFs, timelines, and event records preserve the club's work and make it easier for future committees to build on.", Sprout],
  ["External Trust", "A clear record of the club's activities helps partners understand its value before offering visits, roles, or collaborations.", HandHeart],
  ["Student Growth", "More students can find pathways into field learning, volunteering, research, leadership, and representation.", Leaf],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About CAVM Club"
        title="A student club built for service, learning, and professional opportunity."
        description="CAVM Club supports students across agriculture, veterinary medicine, food science, environment, research, and public-sector pathways through events, partnerships, media, and organized access to opportunities."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <SectionHeader
          eyebrow="Mission and vision"
          title="More than a social channel"
          description="The website exists to give the club a more official, trustworthy, and searchable public presence than social media alone."
        />
        <div className="grid gap-5">
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Mission</h2>
            <p className="mt-3 leading-7 text-slate-600">
              To connect CAVM students with meaningful learning, service, research, and career-building opportunities while representing the college with professionalism and impact.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Vision</h2>
            <p className="mt-3 leading-7 text-slate-600">
              To become a trusted student-led platform where opportunities, achievements, alumni stories, and partnerships are easy to discover and easy to act on.
            </p>
          </article>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <SectionHeader
            eyebrow="Why the site exists"
            title="A public record and a fairer access point"
            description="The hub is more than a public display. It helps current students, alumni, faculty, and external partners understand the club's impact, explore past achievements, and discover where new opportunities can grow."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {siteReasons.map(([title, text, Icon]) => (
              <article key={title as string} className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <SectionHeader eyebrow="Values" title="The principles behind the platform" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map(([title, text, Icon]) => (
              <article key={title as string} className="rounded-lg border border-slate-200 p-5">
                <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <SectionHeader eyebrow="Who we serve" title="CAVM students and partners" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Veterinary medicine students", "Agriculture students", "Food science students", "Environment-focused students", "Research-focused students", "Government and public-sector pathways"].map((item) => (
            <div key={item} className="rounded-lg bg-slate-100 p-5 text-sm font-semibold text-slate-800">{item}</div>
          ))}
        </div>
      </section>
    </>
  );
}
