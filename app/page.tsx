import type { Metadata } from "next";
import { ArrowRight, Building2, CalendarDays, Handshake, Newspaper, ShieldCheck, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  getDeletedAchievementIds,
  getDeletedEventSlugs,
  getStoredAchievements,
  getStoredEvents,
  storedAchievementToView,
  storedEventToView,
} from "@/lib/admin-content-store";
import { getAllOpportunities } from "@/lib/runtime-store";
import { isActiveEventStatus, mergeEventsBySlug, sortEventsForDisplay } from "@/lib/event-utils";
import { ButtonLink, SectionHeader } from "@/components/ui";
import { OpportunityCard, EventCard, AchievementCard } from "@/components/cards";
import { officialLinks } from "@/lib/constants";
import { HomeMediaSlider, type HomeSlide } from "@/components/home-media-slider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
};

const features = [
  ["Club Activities", "Workshops, field visits, forums, volunteering, and student-led public engagement.", CalendarDays],
  ["Student Opportunities", "Internships, research roles, training, conferences, scholarships, and programs abroad.", ShieldCheck],
  ["Alumni Network", "Stories, advice, and professional pathways from CAVM graduates.", UsersRound],
  ["Events and Media", "A polished archive of CAVM activities, achievements, photos, and reports.", Newspaper],
  ["External Partnerships", "A professional entry point for farms, clinics, labs, companies, NGOs, and government entities.", Handshake],
];

const homeHeroSlides: HomeSlide[] = [
  {
    title: "CAVM Week Festival Organization",
    eyebrow: "CAVM Week",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-01.jpeg",
    href: "/events/cavm-week-festival",
    imagePosition: "center 38%",
  },
  {
    title: "Student Engagement During CAVM Week",
    eyebrow: "Festival week",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-05.jpeg",
    href: "/media#cavm-week-2026",
    imagePosition: "center 42%",
  },
  {
    title: "CAVM Students at the UAE Agricultural Conference",
    eyebrow: "Agriculture",
    imageUrl: "/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg",
    href: "/events/uae-agricultural-conference-and-sector-exhibition-2026",
  },
  {
    title: "Youth in Sustainability Dialogue",
    eyebrow: "Sustainability",
    imageUrl: "/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg",
    href: "/events/youth-in-sustainability-dialogue-session",
  },
  {
    title: "Date Palm Product Showcase",
    eyebrow: "Horticulture",
    imageUrl: "/images/home-submitted/date-palm-student-team.jpeg",
    href: "/media",
  },
  {
    title: "Al Foah Field Learning Visit",
    eyebrow: "Farm visit",
    imageUrl: "/images/home-submitted/al-foah-field-visit-group.jpeg",
    href: "/achievements",
  },
  {
    title: "Student Harvest and Date-Palm Activities",
    eyebrow: "Hands-on learning",
    imageUrl: "/images/home-submitted/date-harvest-team.jpeg",
    href: "/media",
  },
  {
    title: "Community Planting Workshop",
    eyebrow: "Community impact",
    imageUrl: "/images/home-submitted/community-planting-workshop-01.jpeg",
    href: "/achievements",
    imagePosition: "center 45%",
  },
  {
    title: "UAEU Exhibition Representation",
    eyebrow: "Public engagement",
    imageUrl: "/images/home-submitted/uaeu-exhibition-team.jpeg",
    href: "/achievements",
  },
  {
    title: "Al Foah Research Farm Group Visit",
    eyebrow: "Research farm",
    imageUrl: "/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg",
    href: "/events/uaeu-chancellor-s-visit-to-al-foah-research-farm",
  },
  {
    title: "Veterinary Medicine Booth Team",
    eyebrow: "Veterinary medicine",
    imageUrl: "/images/home-submitted/veterinary-booth-team.png",
    href: "/media",
  },
  {
    title: "Veterinary Laboratory Learning Visit",
    eyebrow: "Clinical learning",
    imageUrl: "/images/home-submitted/veterinary-lab-visit-team.png",
    href: "/opportunities",
  },
  {
    title: "Camel Field Learning Experience",
    eyebrow: "Animal science",
    imageUrl: "/images/home-submitted/camel-field-learning.png",
    href: "/opportunities",
  },
  {
    title: "Ostrich Farm Learning Visit",
    eyebrow: "Animal production",
    imageUrl: "/images/home-submitted/ostrich-farm-learning.png",
    href: "/opportunities",
  },
  {
    title: "Poultry Learning Visit",
    eyebrow: "Veterinary practice",
    imageUrl: "/images/home-submitted/poultry-learning-visit.png",
    href: "/opportunities",
  },
  {
    title: "Animal Science Practical Training",
    eyebrow: "Training visit",
    imageUrl: "/images/home-submitted/animal-science-lab-team.jpg",
    href: "/opportunities",
  },
  {
    title: "Food Science Booth Engagement",
    eyebrow: "Food science",
    imageUrl: "/images/home-submitted/food-science-booth.jpeg",
    href: "/achievements",
    imagePosition: "center 35%",
  },
];

const featuredAchievementTitles = [
  "CAVM Week Festival Organization",
  "UAEU Chancellor's Visit to Al Foah Research Farm",
  "UAE Agricultural Conference and Sector Exhibition 2026",
  "Youth in Sustainability Dialogue Session",
  "Date Palm Research and Products Showcase",
  "ADIFE 2025 / Global Food Week Engagement",
];

export default async function Home() {
  const [
    opportunityRows,
    databaseEvents,
    storedEvents,
    deletedEventSlugs,
    databaseAchievementRows,
    storedAchievements,
    deletedAchievementIds,
  ] = await Promise.all([
    getAllOpportunities(),
    prisma.event.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 3 }),
    getStoredEvents(),
    getDeletedEventSlugs(),
    prisma.achievement.findMany({ where: { title: { in: featuredAchievementTitles } } }),
    getStoredAchievements(),
    getDeletedAchievementIds(),
  ]);
  const opportunities = opportunityRows
    .filter((opportunity) => opportunity.approvalStatus === "approved")
    .sort((a, b) => {
      const statusOrder = ["open", "closing soon", "closed"];
      const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusDiff) return statusDiff;
      return (a.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER) - (b.deadline?.getTime() ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, 3);
  const deletedEvents = new Set(deletedEventSlugs);
  const events = [
    ...storedEvents.map(storedEventToView),
    ...databaseEvents.filter((event) => !deletedEvents.has(event.slug)),
  ];
  const visibleEvents = sortEventsForDisplay(mergeEventsBySlug(events)).filter((event) => isActiveEventStatus(event.status)).slice(0, 3);
  const deletedAchievements = new Set(deletedAchievementIds);
  const achievementRows = [
    ...storedAchievements.map(storedAchievementToView),
    ...databaseAchievementRows.filter((achievement) => !deletedAchievements.has(achievement.id)),
  ];
  const achievementMap = new Map(achievementRows.map((achievement) => [achievement.title, achievement]));
  const achievements = featuredAchievementTitles
    .map((title) => achievementMap.get(title))
    .filter((achievement): achievement is NonNullable<typeof achievement> => Boolean(achievement));

  return (
    <>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase text-emerald-300">Official CAVM Club platform</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              CAVM Club: Connecting Students, Opportunities, and Impact
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
              The official digital home for CAVM Club, showcasing our activities, achievements, members, alumni, events, media, and a centralized Opportunity Hub for students and partners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/opportunities">Explore Opportunities</ButtonLink>
              <ButtonLink href="/register-interest" variant="secondary">Register Your Interests</ButtonLink>
              <ButtonLink href="/partners" variant="ghost">Partner With Us</ButtonLink>
            </div>
          </div>
          <HomeMediaSlider slides={homeHeroSlides} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {features.map(([title, text, Icon]) => (
            <article key={title as string} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-slate-950">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:px-8">
          <SectionHeader
            eyebrow="Fair access"
            title="Opportunities should be easy to find, transparent, and accessible."
            description="The CAVM Opportunity Hub gathers internships, volunteering roles, research positions, farm visits, jobs, training programs, scholarships, competitions, conferences, government opportunities, and programs abroad in one organized platform."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Wider access", "More students can see what is available, apply with confidence, and take part without missing hidden or scattered opportunities."],
              ["New faces", "The hub helps more students get noticed, participate, and become involved in college activities and external opportunities."],
              ["Smarter matching", "Students can find opportunities that fit their interests, skills, academic level, and career goals more quickly."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg bg-emerald-50 p-5">
                <Building2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeader eyebrow="Opportunity Hub" title="Featured opportunities" description="A preview of current student pathways across clinical, agricultural, environmental, research, and public-sector interests." />
          <ButtonLink href="/opportunities" variant="ghost">View all</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <SectionHeader eyebrow="Events" title="Upcoming club activity" description="Field learning, workshops, and public-facing activities connected to CAVM student development." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {visibleEvents.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <SectionHeader eyebrow="Achievements" title="Recent CAVM Club highlights" description="Real achievements and public activities from the provided CAVM archive and event timeline." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {achievements.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />)}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <SectionHeader eyebrow="Official links" title="Fast access for students and partners" />
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {officialLinks.slice(0, 6).map((link) => (
              <a key={link.href} href={link.href} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300">
                <span>
                  <span className="block font-semibold text-slate-950">{link.label}</span>
                  <span className="mt-1 block text-sm text-slate-500">{link.note}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
