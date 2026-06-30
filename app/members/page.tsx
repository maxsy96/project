import type { Metadata } from "next";
import { getAllMembers } from "@/lib/runtime-store";
import { PageHero, SectionHeader } from "@/components/ui";
import { PersonCard } from "@/components/cards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Members" };

export default async function MembersPage() {
  const members = (await getAllMembers(false)).sort((a, b) => a.order - b.order);
  const groups = Array.from(new Set(members.map((member) => member.committee)));
  return (
    <>
      <PageHero
        eyebrow="Members"
        title="Current leadership, committees, and volunteers."
        description="Profiles should only show private student information when consent has been given. The structure below is ready for official, consent-approved club records."
      />
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        {groups.map((group) => {
          const list = members.filter((member) => member.committee === group);
          if (!list.length) return null;
          return (
            <div key={group} className="mb-12">
              <SectionHeader title={group} />
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {list.map((member) => (
                  <PersonCard
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    meta={member.areaOfInterest}
                    body={member.bio}
                    imageUrl={member.imageUrl}
                    contact={member.email || member.studentId}
                    socialUrl={member.socialUrl}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
