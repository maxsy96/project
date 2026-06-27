import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { officialLinks } from "@/lib/constants";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Official Links" };

export default function LinksPage() {
  return (
    <>
      <PageHero
        eyebrow="Official links"
        title="CAVM Club links, organized professionally."
        description="A Linktree-style page for quick access to social channels, forms, events, alumni, partners, and the Opportunity Hub."
      />
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8">
        <div className="grid gap-3">
          {officialLinks.map((link) => (
            <a key={link.href} href={link.href} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300">
              <span>
                <span className="block text-lg font-semibold text-slate-950">{link.label}</span>
                <span className="mt-1 block text-sm text-slate-500">{link.note}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
