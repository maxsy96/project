import type { Metadata } from "next";
import { InterestRegistrationForm } from "@/components/forms";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Register Interest" };

export default function RegisterInterestPage() {
  return (
    <>
      <PageHero
        eyebrow="Student registration"
        title="Tell CAVM Club what opportunities match your goals."
        description="Register your interests in veterinary medicine, agriculture, food science, environment, research, or government pathways so the club can surface better-matched opportunities."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Privacy note</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Your registration is saved privately for opportunity matching and club follow-up. It is visible only in the protected admin area and should not be published publicly.
          </p>
        </aside>
        <InterestRegistrationForm />
      </section>
    </>
  );
}
