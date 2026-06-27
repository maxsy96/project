import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Contact" };

const faqs = [
  ["Is the Opportunity Hub public?", "Opportunity listings are public, but student registrations are private and visible only in admin."],
  ["Can partners submit opportunities?", "Yes. Submissions are saved as pending review before they become public listings."],
  ["Can students choose more than one sector?", "Yes. Students can select multiple interests and opportunity preferences for better matching."],
  ["Does the MVP send email?", "No paid services are required. A notification abstraction is prepared so SMTP can be added later."],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach CAVM Club."
        description="Use the contact form for questions, collaboration requests, alumni stories, media updates, and Opportunity Hub feedback."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8">
        <aside>
          <SectionHeader title="Club contact details" description="Use the official CAVM Club mailbox for student questions, partner collaborations, media updates, and Opportunity Hub follow-up." />
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600 shadow-sm">
            <p><strong className="text-slate-950">Email:</strong> <a href="mailto:Clubcavm@gmail.com" className="font-semibold text-emerald-700">Clubcavm@gmail.com</a></p>
            <p><strong className="text-slate-950">Location:</strong> College of Agriculture and Veterinary Medicine, UAEU</p>
            <p><strong className="text-slate-950">Social:</strong> Instagram and LinkedIn placeholders are available on Official Links.</p>
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
