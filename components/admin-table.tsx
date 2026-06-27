export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table>
    </div>
  );
}

export function AdminTh({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">{children}</th>;
}

export function AdminTd({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top text-slate-700">{children}</td>;
}
