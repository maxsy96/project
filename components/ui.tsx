import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase text-emerald-700">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold text-slate-950 md:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:px-8 lg:py-20">
        <div className="space-y-6">
          {eyebrow ? <p className="text-sm font-semibold uppercase text-emerald-300">{eyebrow}</p> : null}
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-200">{description}</p>
        </div>
        {children ? <div className="self-end">{children}</div> : null}
      </div>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition",
        variant === "primary" && "bg-emerald-600 text-white hover:bg-emerald-700",
        variant === "secondary" && "bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50",
        variant === "ghost" && "text-emerald-700 hover:text-emerald-900",
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const tone = normalized.includes("open")
    ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
    : normalized.includes("soon")
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : normalized.includes("pending")
        ? "bg-sky-50 text-sky-800 ring-sky-200"
        : normalized.includes("approved")
          ? "bg-teal-50 text-teal-800 ring-teal-200"
          : "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold ring-1", tone)}>{status}</span>;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {children}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <Search className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-2 text-sm font-medium text-red-700">{errors[0]}</p>;
}
