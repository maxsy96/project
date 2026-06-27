import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin-login-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Protected CAVM Club workspace."
        description="Use the admin credentials from environment variables to manage opportunities, students, events, achievements, media, members, alumni, partner submissions, and contact messages."
      />
      <section className="px-5 py-14 md:px-8">
        <AdminLoginForm />
      </section>
    </>
  );
}
