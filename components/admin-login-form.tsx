"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/lib/admin-actions";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, { message: "" });
  return (
    <form action={formAction} className="mx-auto grid max-w-md gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {state.message ? <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">{state.message}</p> : null}
      <label className="block text-sm font-semibold text-slate-800">
        Admin username
        <input name="username" type="text" required autoComplete="username" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
      </label>
      <label className="block text-sm font-semibold text-slate-800">
        Admin password
        <input name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm" />
      </label>
      <button disabled={pending} className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
