import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/privacidade/ver",
    await searchParams,
    "/central/privacidade/ver",
  );
  const request = asRecord(data.item || data.privacyRequest);
  const statusOptions = asRecord(data.statusOptions);

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">
                {String(request.full_name || "-")}
              </h2>
              <p className="text-sm text-base-content/60">
                {String(request.email || "-")}
              </p>
            </div>
            <Link
              className="btn btn-outline btn-sm"
              href="/central/privacidade"
            >
              Voltar
            </Link>
          </div>
        </div>
      </article>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h3 className="mb-4 text-base font-bold">Dados do pedido</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Tipo", String(request.request_type_label || "-")],
                ["Status", String(request.status_label || "-")],
                ["Solicitado em", String(request.created_at || "-")],
                ["Resolvido em", String(request.resolved_at || "-")],
                [
                  "IP / Navegador",
                  `${String(request.request_ip || "-")}\n${String(request.request_user_agent || "-")}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={label === "IP / Navegador" ? "md:col-span-2" : ""}
                >
                  <p className="text-xs uppercase tracking-wide text-base-content/55">
                    {label}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-base-content/80">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h3 className="mb-4 text-base font-bold">Atualizar tratamento</h3>
            <BackendForm
              backendPath="/dashboard/central/privacidade/status"
              className="space-y-4"
            >
              <input
                name="request_id"
                type="hidden"
                value={String(request.id || "")}
              />
              <label className="form-control">
                <span className="label-text font-semibold">Novo status</span>
                <select className="select select-bordered" name="status">
                  {Object.entries(statusOptions).map(([key, label]) => (
                    <option
                      key={key}
                      selected={String(request.status || "") === key}
                      value={key}
                    >
                      {String(label)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-control">
                <span className="label-text font-semibold">
                  Notas internas / resposta
                </span>
                <textarea
                  className="textarea textarea-bordered min-h-32"
                  defaultValue={String(request.resolution_notes || "")}
                  name="resolution_notes"
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Salvar andamento
              </button>
            </BackendForm>
          </div>
        </article>
      </section>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <h3 className="mb-4 text-base font-bold">
            Descrição enviada pelo titular
          </h3>
          <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm leading-relaxed text-base-content/80">
            {String(request.request_message || "-")}
          </div>
        </div>
      </article>
    </section>
  );
}
