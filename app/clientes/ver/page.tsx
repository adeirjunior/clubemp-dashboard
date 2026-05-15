import Link from "next/link";
import {
  asRecord,
  asRecordArray,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/clientes/ver",
    await searchParams,
    "/clientes/ver",
  );
  const customer = asRecord(data.item || data.customer);
  const linkedCompanies = asRecordArray(customer.linked_companies_list);

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">
                {String(customer.name || "-")}
              </h2>
              <p className="text-sm text-base-content/60">
                {String(customer.email || "-")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="badge badge-outline">
                  {String(customer.customer_type_label || "-")}
                </span>
                <span className="badge badge-outline">
                  {String(customer.status_label || "-")}
                </span>
              </div>
            </div>
            <Link className="btn btn-outline btn-sm" href="/clientes">
              Voltar
            </Link>
          </div>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Compras registradas", String(customer.purchases_count || 0)],
          ["Total movimentado", String(customer.purchases_total || "R$ 0,00")],
          ["Empresas vinculadas", String(customer.linked_companies_count || 0)],
          ["Criado em", String(customer.created_at || "-")],
        ].map(([label, value]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <p className="text-lg font-bold">{value}</p>
            </div>
          </article>
        ))}
      </section>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["Telefone", String(customer.phone || "-")],
              ["ID do usuário", String(customer.user_id || "-")],
              ["Perfil de acesso", String(customer.user_account_type || "-")],
              ["Código do cartão", String(customer.card_code || "-")],
              ["Tipo do cartão", String(customer.card_type_label || "-")],
              ["QR slug", String(customer.qr_code_slug || "-")],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wide text-base-content/55">
                  {label}
                </p>
                <p className="mt-1 break-all text-sm text-base-content/80">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <h3 className="mb-4 text-base font-bold">Empresas vinculadas</h3>
          {linkedCompanies.length === 0 ? (
            <p className="text-sm text-base-content/65">
              Este cliente ainda não possui empresa conveniada vinculada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Tipo</th>
                    <th>Vínculo</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedCompanies.map((company) => (
                    <tr
                      key={String(
                        company.id || company.name || JSON.stringify(company),
                      )}
                    >
                      <td>{String(company.name || "-")}</td>
                      <td>{String(company.company_type_label || "-")}</td>
                      <td>{String(company.link_type || "-")}</td>
                      <td>{String(company.status || "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
