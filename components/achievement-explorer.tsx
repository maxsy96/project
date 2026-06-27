"use client";

import { useState } from "react";
import { achievementCategories } from "@/lib/constants";
import { AchievementCard } from "@/components/cards";

type Achievement = {
  id: number;
  title: string;
  description: string;
  category: string;
  year: number;
  imageUrl: string;
};

export function AchievementExplorer({ achievements }: { achievements: Achievement[] }) {
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const years = Array.from(new Set(achievements.map((achievement) => achievement.year))).sort((a, b) => b - a);

  const filtered = achievements.filter((achievement) => {
    return (!year || String(achievement.year) === year) && (!category || achievement.category === category);
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="">All years</option>
          {years.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
          <option value="">All categories</option>
          {achievementCategories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((achievement) => <AchievementCard key={achievement.id} achievement={achievement} />)}
      </div>
    </div>
  );
}
