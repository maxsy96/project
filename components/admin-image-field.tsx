"use client";

import Image from "next/image";
import { useState } from "react";

const imageOptions = [
  ["/images/brand/cavm-logo.png", "CAVM Club logo"],
  ["/images/archive/cavm-week-2026/cavm-week-2026-01.jpeg", "CAVM Week Festival"],
  ["/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg", "UAEU Chancellor visit"],
  ["/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg", "Agriculture conference"],
  ["/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg", "Youth sustainability dialogue"],
  ["/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-029.jpg", "Liwa Date Festival"],
  ["/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-018.jpg", "Al Foah gathering"],
  ["/images/archive/future-plus-2025/future-plus-2025-038.jpg", "Future+ exchange"],
  ["/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg", "Official exhibition visit"],
  ["/images/archive/uae-national-day-cavm-booth-2025/uae-national-day-cavm-booth-2025-01.jpeg", "UAE National Day booth"],
  ["/images/archive/walaw-bishaq-tamrah-giving-initiative-2026/walaw-bishaq-tamrah-giving-initiative-2026-01.jpeg", "Giving initiative"],
  ["/images/archive/china-cavm-delegation-visit-2026/china-cavm-delegation-visit-2026-01.jpeg", "China delegation visit"],
  ["/images/external/seaworld-research-rescue.jpg", "SeaWorld Research & Rescue"],
  ["/images/external/ektifa-saba-sanabel.jpg", "Ektifa organic systems"],
  ["/images/external/bustanica-vertical-farm.jpg", "Bustanica hydroponics"],
  ["/images/home-submitted/food-science-booth.jpeg", "Food science booth"],
  ["/images/home-submitted/date-palm-student-team.jpeg", "Date palm student team"],
  ["/images/home-submitted/slaughterhouse-visit-group.jpeg", "Animal science visit"],
] as const;

export function AdminImageField({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <label className="block text-sm font-semibold text-slate-800">
        {label}
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/images/archive/example/photo.jpeg"
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
        />
      </label>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <select
          value=""
          onChange={(event) => {
            if (event.target.value) setValue(event.target.value);
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
          aria-label={`Choose ${label.toLowerCase()} from existing photos`}
        >
          <option value="">Choose existing site photo</option>
          {imageOptions.map(([path, optionLabel]) => (
            <option key={path} value={path}>{optionLabel}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setValue("")}
          className="rounded-md border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-50"
        >
          Clear image
        </button>
      </div>
      {value && value.startsWith("/") ? (
        <div className="mt-3 overflow-hidden rounded-md border border-slate-200 bg-white">
          <Image src={value} alt="" width={700} height={360} className="h-36 w-full object-cover" />
        </div>
      ) : value ? (
        <p className="mt-3 rounded-md bg-white p-3 text-xs font-medium text-slate-500">External image URL saved. Preview is shown for local site images only.</p>
      ) : (
        <p className="mt-3 rounded-md bg-white p-3 text-xs font-medium text-slate-500">No image selected.</p>
      )}
    </div>
  );
}
