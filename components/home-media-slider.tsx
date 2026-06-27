"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export type HomeSlide = {
  title: string;
  eyebrow: string;
  imageUrl: string;
  href: string;
  imagePosition?: string;
};

export function HomeMediaSlider({ slides }: { slides: HomeSlide[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-2xl">
      {slides.map((slide, index) => (
        <Link
          key={`${slide.href}-${slide.imageUrl}`}
          href={slide.href}
          className={`absolute inset-0 transition-opacity duration-700 ${index === active ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-label={`Open ${slide.title}`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
            style={{ objectPosition: slide.imagePosition ?? "center" }}
            priority={index === 0}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
          <span className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
            <span className="inline-flex rounded-md bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {slide.eyebrow}
            </span>
            <span className="mt-4 flex items-end justify-between gap-4">
              <span className="max-w-md text-2xl font-semibold leading-tight text-white">{slide.title}</span>
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-slate-950 sm:flex">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </span>
          </span>
        </Link>
      ))}
      <div className="absolute right-5 top-5 flex gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.imageUrl}
            type="button"
            aria-label={`Show ${slide.title}`}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-emerald-300" : "w-2.5 bg-white/70 hover:bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
}
