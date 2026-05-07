"use client";

import Link from "next/link";
import { BackendForm } from "./backend-form";
import { LucideIcon } from "./lucide-icon";

type DashboardContext = {
  badge?: string;
  key?: string;
  label?: string;
  path?: string;
};

export function DashboardContextSwitcher({
  activeContextKey,
  addCompanyHref,
  contexts,
  currentLabel,
}: {
  activeContextKey: string;
  addCompanyHref: string;
  contexts: DashboardContext[];
  currentLabel: string;
}) {
  return (
    <BackendForm backendPath="/dashboard/contexto" onSuccess="reload">
      <div className="dropdown dropdown-end">
        <button
          className="btn btn-outline btn-sm min-h-0 gap-2 rounded-full px-3"
          type="button"
        >
          <LucideIcon name="layers-3" className="h-4 w-4" />
          <span className="max-w-[10rem] truncate">{currentLabel}</span>
          <LucideIcon name="chevron-down" className="h-4 w-4 opacity-70" />
        </button>
        <div className="dropdown-content menu z-[1] mt-2 w-80 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-base-content/45">
                Visualização
              </p>
              <p className="text-xs font-semibold text-base-content">
                {currentLabel}
              </p>
            </div>
            <label className="form-control">
              <span className="sr-only">Trocar modo do dashboard</span>
              <select
                className="select select-bordered select-sm w-full"
                value={activeContextKey}
                name="context_key"
                onChange={(event) => event.currentTarget.form?.requestSubmit()}
              >
                {contexts.map((context, index) => (
                  <option
                    key={context.key || index}
                    value={context.key || ""}
                    data-path={context.path || ""}
                  >
                    {context.label}
                    {context.badge ? ` (${context.badge})` : ""}
                  </option>
                ))}
              </select>
            </label>
            <Link
              className="btn btn-primary btn-sm w-full gap-2"
              href={addCompanyHref}
            >
              <LucideIcon name="plus" className="h-4 w-4" />
              Adicionar empresa ou concluir convite
            </Link>
          </div>
        </div>
      </div>
    </BackendForm>
  );
}
