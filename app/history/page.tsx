import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink, PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "History" };

const chapters = [
  {
    period: "Late 2024",
    title: "A student identity becomes visible",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg",
    body:
      "The club's public record begins with UAE National Day flower planting and Global Food Week 2024, connecting CAVM identity with national pride, sustainability, and food security.",
  },
  {
    period: "January-March 2025",
    title: "From welcome events to campus action",
    imageUrl: "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-012.jpg",
    body:
      "Orientation, waste-management learning, CAVM Week, sports participation, Ramadan Majlis visits, and Iftar volunteering turned the club into a steady platform for service, wellbeing, and practical engagement.",
  },
  {
    period: "April-July 2025",
    title: "Agriculture moved into public spaces",
    imageUrl: "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-001.jpg",
    body:
      "Waste-management awareness, the Emirates Agriculture Conference, World Environment Day, school workshops, and Liwa Date Festival participation expanded the club's reach beyond campus.",
    href: "/events/liwa-date-festival-participation",
  },
  {
    period: "August-November 2025",
    title: "Representation, heritage, and global exchange",
    imageUrl: "/images/archive/future-plus-2025/future-plus-2025-001.jpg",
    body:
      "ADIHEX, ADIFE, SDG debates, National Day workshops, Al Foah gathering, AAIHEX, and Future+ showed a wider version of CAVM: one that represents agriculture, veterinary medicine, culture, innovation, and youth leadership.",
    href: "/events/future-international-exchange",
  },
  {
    period: "January-February 2026",
    title: "Community responsibility became institutional",
    imageUrl: "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-001.jpg",
    body:
      "The club supported the Emirates Red Crescent initiative, hosted a Chinese student delegation, welcomed new students, joined Al Wathba Plant Festival, and represented students during key visits at Al Foah and Dana Al Ain.",
    href: "/events/al-foah-gathering",
  },
  {
    period: "April-June 2026",
    title: "Research, date palm innovation, and international academic visibility",
    imageUrl: "/images/archive/future-plus-2025/future-plus-2025-096.jpg",
    body:
      "The 2026 record includes the UAE Agricultural Conference, the International Date Palm Conference, a CAVM academic delegation to China, and date-palm research showcases with the Khalifa International Award secretariat.",
  },
];

const pillars = [
  ["Fair Access", "Opportunities should be visible to everyone, not only to those who already know where to look."],
  ["Public Memory", "Photos, PDFs, timelines, and event records preserve the club's work and make it easier for future committees to build on."],
  ["External Trust", "A clear record of the club's activities helps partners understand its value before offering visits, roles, or collaborations."],
  ["Student Growth", "More students can find pathways into field learning, volunteering, research, leadership, and representation."],
];

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="History"
        title="CAVM Club's story is a record of students turning participation into public impact."
        description="The club grew from campus activities into exhibitions, research showcases, cultural exchange, sustainability forums, farm learning, and an organized Opportunity Hub for fair student access."
      >
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-white/10 p-4 text-white ring-1 ring-white/15">
          {[
            ["33", "achievements"],
            ["260", "archived photos"],
            ["2024-2026", "documented timeline"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-md bg-emerald-400/15 p-3 ring-1 ring-emerald-300/25">
              <p className="text-2xl font-semibold text-emerald-100">{value}</p>
              <p className="mt-1 text-xs uppercase text-emerald-200/90">{label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <SectionHeader
          eyebrow="Narrative"
          title="A richer timeline shaped by the club's records and achievements"
          description="This timeline highlights the club's growth and impact across service, sustainability, food security, veterinary relevance, agriculture, research, and public representation."
        />
        <div className="mt-10 grid gap-6">
          {chapters.map((chapter, index) => (
            <article key={chapter.period} className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:grid-cols-[330px_1fr]">
              <div className="relative min-h-64 bg-slate-100">
                <Image src={chapter.imageUrl} alt={chapter.title} fill sizes="(min-width: 768px) 330px, 100vw" className="object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold uppercase text-emerald-700">{chapter.period}</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{chapter.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{chapter.body}</p>
                {chapter.href ? (
                  <Link href={chapter.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    Open related event <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
                <p className="mt-6 text-sm font-semibold text-slate-400">Chapter {index + 1}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <SectionHeader
            eyebrow="Why the hub matters"
            title="The website turns club history into an access system"
            description="The hub is more than a public display. It helps current students, alumni, faculty, and external partners understand the club's impact, explore past achievements, and discover where new opportunities can grow."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {pillars.map(([title, text]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/achievements">View all 33 achievements</ButtonLink>
            <ButtonLink href="/media" variant="secondary">Open media archive</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
