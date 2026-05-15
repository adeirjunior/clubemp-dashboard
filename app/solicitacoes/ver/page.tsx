import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function valueOrDash(value: unknown) {
  if (value === null || value === undefined) {
    return "-";
  }

  const text = String(value).trim();
  return text === "" ? "-" : text;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await loadDashboardData(
    "/dashboard/central/solicitacoes/ver",
    resolvedSearchParams,
    "/solicitacoes/ver",
  );
  const item = asRecord(data.item || data.request || data.requestItem);
  const currentStatus = String(item.status || "new");
  const requestId = String(item.id || resolvedSearchParams.id || "0");
  const statusFilter = String(resolvedSearchParams.status || "all");
  const typeFilter = String(resolvedSearchParams.type || "all");

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-black">
                Solicitação:{" "}
                {valueOrDash(
                  item.company_name || item.trade_name || item.legal_name,
                )}
              </h1>
              <p className="text-sm text-base-content/70">
                Visualização administrativa completa da proposta recebida.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-outline">
                {valueOrDash(item.request_type_label || item.request_type)}
              </span>
              <span className="badge badge-ghost">
                {valueOrDash(item.status_label || item.status)}
              </span>
              <Link className="btn btn-sm btn-outline" href="/solicitacoes">
                Voltar
              </Link>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="mb-4 text-lg font-bold">Dados da solicitação</h2>
            <dl className="grid gap-4 md:grid-cols-2">
              <Field label="Razão social" value={item.legal_name} />
              <Field
                label="Nome fantasia"
                value={item.trade_name || item.company_name}
              />
              <Field
                label="Documento"
                value={`${item.document_type ? `${String(item.document_type).toUpperCase()}: ` : ""}${valueOrDash(item.company_document)}`}
              />
              <Field
                label="Cidade / UF"
                value={
                  [item.city, item.state]
                    .filter(Boolean)
                    .map(String)
                    .join(" - ") || "-"
                }
              />
              <Field label="Contato principal" value={item.contact_name} />
              <Field
                label="Empreendedor / responsável"
                value={item.entrepreneur_name}
              />
              <Field label="E-mail comercial" value={item.email} />
              <Field label="Telefone comercial" value={item.phone} />
              <Field label="WhatsApp" value={item.whatsapp} />
              <Field label="Website" value={item.website} />
              <Field
                label="Tipo"
                value={item.request_type_label || item.request_type}
              />
              <Field
                label="Status atual"
                value={item.status_label || item.status}
              />
              <Field label="Recebido em" value={item.created_at} />
              <Field label="Atualizado em" value={item.updated_at} />
              <Field
                label="Resumo da proposta"
                value={item.message}
                span="full"
                stacked
              />
            </dl>
          </div>
        </article>

        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <h2 className="mb-2 text-lg font-bold">Atualizar status</h2>
            <p className="mb-4 text-sm text-base-content/70">
              Ao aprovar, o backend cria a conta da empresa e envia um e-mail
              com a senha temporária.
            </p>

            <BackendForm
              backendPath={`/dashboard/central/requests/${requestId}/status`}
              className="space-y-4"
              loadingLabel="Salvando status..."
              onSuccess="reload"
            >
              <input name="status_filter" type="hidden" value={statusFilter} />
              <input name="type_filter" type="hidden" value={typeFilter} />
              <input name="id" type="hidden" value={requestId} />

              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Novo status
                </span>
                <select
                  className="select select-bordered w-full"
                  defaultValue={currentStatus}
                  name="status"
                  required
                >
                  <option value="new">Novo</option>
                  <option value="approved">Aprovado</option>
                  <option value="rejected">Rejeitado</option>
                </select>
              </label>

              <div className="alert alert-info">
                <span>
                  Se o status for alterado para aprovado, o e-mail com a senha
                  temporária é enviado automaticamente.
                </span>
              </div>

              <button className="btn btn-primary w-full" type="submit">
                Salvar status
              </button>
            </BackendForm>
          </div>
        </article>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  span,
  stacked,
}: {
  label: string;
  value: unknown;
  span?: "full";
  stacked?: boolean;
}) {
  return (
    <div className={span === "full" ? "md:col-span-2" : ""}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
        {label}
      </dt>
      <dd
        className={
          stacked
            ? "mt-2 whitespace-pre-line rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm leading-6"
            : "mt-1 text-sm font-medium"
        }
      >
        {valueOrDash(value)}
      </dd>
    </div>
  );
}
