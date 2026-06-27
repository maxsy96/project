"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { opportunityTypes, sectors } from "@/lib/constants";
import { fromJsonList } from "@/lib/utils";
import { EmptyState, StatusBadge } from "@/components/ui";
import { OpportunityCard } from "@/components/cards";

type Opportunity = {
  id: number;
  title: string;
  slug: string;
  organization: string;
  type: string;
  sectors: string;
  location: string;
  isRemote: boolean;
  isAbroad: boolean;
  isGovernmentRelated: boolean;
  paidStatus: string;
  deadline: Date | null;
  description: string;
  eligibility: string;
  applicationUrl: string;
  status: string;
  imageUrl: string;
};

const paidOptions = ["Paid", "Unpaid", "Funded", "Certificate"];
const statusOptions = ["open", "closing soon", "closed"];

export function OpportunityExplorer({ opportunities }: { opportunities: Opportunity[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [paid, setPaid] = useState("");
  const [government, setGovernment] = useState(false);
  const [abroad, setAbroad] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return opportunities.filter((opportunity) => {
      const list = fromJsonList(opportunity.sectors);
      const haystack = [opportunity.title, opportunity.organization, opportunity.description, opportunity.location, opportunity.type, ...list]
        .join(" ")
        .toLowerCase();
      return (
        (!q || haystack.includes(q)) &&
        (!type || opportunity.type === type) &&
        (!sector || list.includes(sector)) &&
        (!status || opportunity.status === status) &&
        (!location || opportunity.location.toLowerCase().includes(location.toLowerCase())) &&
        (!paid || opportunity.paidStatus.toLowerCase().includes(paid.toLowerCase())) &&
        (!government || opportunity.isGovernmentRelated) &&
        (!abroad || opportunity.isAbroad)
      );
    });
  }, [opportunities, query, type, sector, status, location, paid, government, abroad]);

  return (
    <div className="grid gap-8">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          <label className="relative md:col-span-2">
            <span className="sr-only">Search opportunities</span>
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by keyword, organization, sector..."
              className="w-full rounded-md border border-slate-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
            <option value="">All types</option>
            {opportunityTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={sector} onChange={(event) => setSector(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
            <option value="">All sectors</option>
            {sectors.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
            <option value="">Any status</option>
            {statusOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Location"
            className="rounded-md border border-slate-300 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
          <select value={paid} onChange={(event) => setPaid(event.target.value)} className="rounded-md border border-slate-300 px-3 py-3 text-sm">
            <option value="">Paid/funded</option>
            {paidOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={government} onChange={(event) => setGovernment(event.target.checked)} className="h-4 w-4 accent-emerald-700" />
            Government-related
          </label>
          <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-3 text-sm text-slate-700">
            <input type="checkbox" checked={abroad} onChange={(event) => setAbroad(event.target.checked)} className="h-4 w-4 accent-emerald-700" />
            Abroad
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{filtered.length} opportunities shown</p>
        <div className="flex gap-2">
          <StatusBadge status="open" />
          <StatusBadge status="closing soon" />
          <StatusBadge status="closed" />
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}
        </div>
      ) : (
        <EmptyState title="No matching opportunities" description="Try widening the sector, type, location, or keyword filters." />
      )}
    </div>
  );
}
