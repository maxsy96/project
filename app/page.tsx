import type { Metadata } from "next";
import { ArrowRight, Building2, CalendarDays, Handshake, Newspaper, ShieldCheck, UsersRound } from "lucide-react";
import { prisma } from "@/lib/prisma";
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
    title: "CAVM Students at the UAE Agricultural Conference",
    eyebrow: "Agriculture",
    imageUrl: "/images/home-submitted/agriculture-conference-team.jpeg",
    href: "/achievements",
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
    imageUrl: "/images/home-submitted/al-foah-research-farm-group.jpeg",
    href: "/media",
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
  "Liwa Date Festival Participation",
  "Al Foah Farm Student Gathering",
  "Future+ International Exchange Program",
];

export default async function Home() {
  const [opportunities, events, achievementRows] = await Promise.all([
    prisma.opportunity.findMany({
      where: { approvalStatus: "approved" },
      orderBy: [{ status: "asc" }, { deadline: "asc" }],
      take: 3,
    }),
    prisma.event.findMany({ where: { status: "upcoming" }, orderBy: { date: "asc" }, take: 3 }),
    prisma.achievement.findMany({ where: { title: { in: featuredAchievementTitles } } }),
  ]);
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
            {["Wider access", "New faces", "Better matching"].map((item) => (
              <div key={item} className="rounded-lg bg-emerald-50 p-5">
                <Building2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold text-slate-950">{item}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">A more organized system helps more CAVM students participate and represent the college.</p>
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
            {events.map((event) => <EventCard key={event.id} event={event} />)}
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
