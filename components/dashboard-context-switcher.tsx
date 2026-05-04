"use client";

import { BackendForm } from "./backend-form";

type DashboardContext = {
  badge?: string;
  key?: string;
  label?: string;
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
      <div className="flex flex-col gap-2 rounded-2xl border border-base-300 bg-base-100/80 px-3 py-2 shadow-sm">
        <div className="hidden xl:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-base-content/45">
            Visualização
          </p>
          <p className="text-xs font-semibold text-base-content">
            {currentLabel}
          </p>
        </div>
        <label className="form-control min-w-[12rem] sm:min-w-[14rem]">
          <span className="sr-only">Trocar modo do dashboard</span>
          <select
            className="select select-bordered select-sm w-full"
            defaultValue={activeContextKey}
            name="context_key"
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            {contexts.map((context, index) => (
              <option key={context.key || index} value={context.key || ""}>
                {context.label}
                {context.badge ? ` (${context.badge})` : ""}
              </option>
            ))}
          </select>
        </label>
        <a
          className="btn btn-outline btn-xs sm:btn-sm w-full"
          href={addCompanyHref}
        >
          Adicionar empresa ou concluir convite
        </a>
      </div>
    </BackendForm>
  );
}
