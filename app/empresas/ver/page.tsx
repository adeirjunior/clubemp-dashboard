import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import {
  asRecord,
  firstQueryValue,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const data = await loadDashboardData(
    "/dashboard/central/empresas/ver",
    query,
    "/empresas/ver",
  );
  const company = asRecord(data.company || data.item);
  const tenantId = String(company.id || firstQueryValue(query.id) || "");
  const activeTab =
    firstQueryValue(query.tab) === "estatisticas" ? "estatisticas" : "detalhes";
  const days = daysFromQuery(query);
  const analyticsData =
    activeTab === "estatisticas" && tenantId !== ""
      ? await loadDashboardData(
          `/analytics/admin/company/${encodeURIComponent(tenantId)}`,
          { days },
          "/empresas/ver",
        )
      : null;

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        {company.banner_path ? (
          <div
            aria-label={`Banner ${String(company.name || "empresa")}`}
            className="h-44 w-full bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url(${String(company.banner_path)})` }}
          />
        ) : null}
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">
                {String(company.name || "-")}
              </h2>
              <p className="text-sm text-base-content/60">
                {String(company.slug || "-")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge badge-outline">
                  {String(company.kind_label || "-")}
                </span>
                <span className="badge badge-outline">
                  {String(company.visibility_label || "-")}
                </span>
                {String(company.seal_label || "") === "Valéria Vaz" ? (
                  <span className="badge border-amber-300 bg-amber-100 text-amber-900">
                    Selo Valéria Vaz
                  </span>
                ) : null}
                {String(company.content_writer_seal || "") === "1" ? (
                  <span className="badge badge-success">Selo de escritor</span>
                ) : null}
              </div>
            </div>
            <div className="flex gap-2">
              <Link className="btn btn-outline btn-sm" href="/empresas">
                Voltar
              </Link>
              {company.public_href ? (
                <a
                  className="btn btn-primary btn-sm"
                  href={String(company.public_href)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Página pública
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <div className="tabs tabs-boxed w-fit bg-base-200">
        <Link
          className={`tab ${activeTab === "detalhes" ? "tab-active" : ""}`}
          href={`/empresas/ver?id=${encodeURIComponent(tenantId)}&tab=detalhes`}
        >
          Detalhes
        </Link>
        <Link
          className={`tab ${activeTab === "estatisticas" ? "tab-active" : ""}`}
          href={`/empresas/ver?id=${encodeURIComponent(tenantId)}&tab=estatisticas&days=${encodeURIComponent(days)}`}
        >
          Estatísticas
        </Link>
      </div>

      {activeTab === "estatisticas" && analyticsData ? (
        <AnalyticsDashboard
          data={analyticsData}
          days={days}
          isAdmin={false}
          periodFormHiddenFields={{
            id: tenantId,
            tab: "estatisticas",
          }}
          showHeader={false}
        />
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <h3 className="text-lg font-black">Selos administrativos</h3>
                <p className="text-sm text-base-content/65">
                  Empresas com selo de escritor publicam notícias e eventos sem
                  solicitação. Sem esse selo, os envios entram em revisão.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <BackendForm backendPath="/dashboard/central/empresas/selo-escritor">
                    <input
                      name="tenant_id"
                      type="hidden"
                      value={String(company.id || "")}
                    />
                    <input
                      name="content_writer_seal"
                      type="hidden"
                      value={
                        String(company.content_writer_seal || "") === "1"
                          ? "0"
                          : "1"
                      }
                    />
                    <button className="btn btn-outline w-full" type="submit">
                      {String(company.content_writer_seal || "") === "1"
                        ? "Remover selo de escritor"
                        : "Conceder selo de escritor"}
                    </button>
                  </BackendForm>
                  <BackendForm backendPath="/dashboard/central/empresas/selo-valeria-vaz">
                    <input
                      name="tenant_id"
                      type="hidden"
                      value={String(company.id || "")}
                    />
                    <input
                      name="valeria_vaz_seal"
                      type="hidden"
                      value={
                        String(company.seal_label || "") === "Valéria Vaz"
                          ? "0"
                          : "1"
                      }
                    />
                    <button className="btn btn-outline w-full" type="submit">
                      {String(company.seal_label || "") === "Valéria Vaz"
                        ? "Remover selo Valéria Vaz"
                        : "Conceder selo Valéria Vaz"}
                    </button>
                  </BackendForm>
                </div>
              </div>
            </article>

            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <h3 className="text-lg font-black">Revisões editoriais</h3>
                <p className="text-sm text-base-content/65">
                  As solicitações de notícias e eventos ficam centralizadas nas
                  páginas administrativas de listagem.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link className="btn btn-outline btn-sm" href="/noticias">
                    Ver notícias pendentes
                  </Link>
                  <Link className="btn btn-outline btn-sm" href="/eventos">
                    Ver eventos pendentes
                  </Link>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Classificação", String(company.kind_label || "-")],
              ["Vínculos internos", String(company.company_records_count || 0)],
              ["Usuários vinculados", String(company.users_count || 0)],
              [
                "Local",
                [String(company.city || ""), String(company.state || "")]
                  .filter(Boolean)
                  .join(" - ") || "-",
              ],
            ].map(([label, value]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4">
                  <p className="text-xs uppercase text-base-content/55">
                    {label}
                  </p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              </article>
            ))}
          </section>

          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Nome fantasia", String(company.trade_name || "-")],
                  ["Razão social", String(company.legal_name || "-")],
                  [
                    "Documento",
                    `${company.document_type ? `${String(company.document_type).toUpperCase()}: ` : ""}${String(company.document_number || "-")}`,
                  ],
                  ["Selo", String(company.seal_label || "-")],
                  ["E-mail de contato", String(company.contact_email || "-")],
                  ["Telefone", String(company.contact_phone || "-")],
                  [
                    "Responsável empreendedor",
                    String(company.entrepreneur_name || "-"),
                  ],
                  ["Página pública", String(company.public_href || "-")],
                  ["Descrição", String(company.description || "-")],
                  ["Serviços", String(company.services_text || "-")],
                  ["Produtos", String(company.products_text || "-")],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className={
                      label === "Descrição" ||
                      label === "Serviços" ||
                      label === "Produtos"
                        ? "md:col-span-2"
                        : ""
                    }
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
        </>
      )}
    </section>
  );
}

function daysFromQuery(query: Record<string, string | string[] | undefined>) {
  const raw = Number(firstQueryValue(query.days));
  if (!Number.isFinite(raw)) {
    return "30";
  }

  return String(Math.max(1, Math.min(365, Math.trunc(raw))));
}
