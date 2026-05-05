import { DashboardShell } from "@/components/dashboard-shell";
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
    "/dashboard/central/saude",
    await searchParams,
    "/central/saude",
  );
  const metrics = asRecord(data.metrics);
  const rows = asRecordArray(metrics.requests_by_route);

  return (
    <DashboardShell
      activeMenu="health"
      headerIcon="activity"
      headerTitle="Saúde do sistema"
    >
      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Requests", String(metrics.requests_total || 0)],
          ["Erros 4xx", String(metrics.errors_4xx || 0)],
          ["Erros 5xx", String(metrics.errors_5xx || 0)],
        ].map(([label, value]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </article>
        ))}
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <p className="text-xs uppercase text-base-content/55">Latência</p>
            <p className="text-sm text-base-content/70">
              Média: {String(metrics.avg_duration_ms || 0)} ms
            </p>
            <p className="text-sm text-base-content/70">
              P95: {String(metrics.p95_duration_ms || 0)} ms
            </p>
          </div>
        </article>
      </section>

      <section className="card mt-4 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-base-content/65">
              Requests por rota
            </h2>
            <span className="text-xs text-base-content/55">
              Atualizado em {String(metrics.generated_at || "-")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>Rota</th>
                  <th className="text-right">Requests</th>
                  <th className="text-right">Erros 4xx</th>
                  <th className="text-right">Erros 5xx</th>
                  <th className="text-right">Média (ms)</th>
                  <th className="text-right">P95 (ms)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="text-center text-base-content/60"
                      colSpan={6}
                    >
                      Sem dados de métricas ainda.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={String(row.route || row.id || JSON.stringify(row))}
                    >
                      <td className="font-mono text-xs">
                        {String(row.route || "/")}
                      </td>
                      <td className="text-right">
                        {String(row.requests || 0)}
                      </td>
                      <td className="text-right">
                        {String(row.errors_4xx || 0)}
                      </td>
                      <td className="text-right">
                        {String(row.errors_5xx || 0)}
                      </td>
                      <td className="text-right">
                        {String(row.avg_duration_ms || 0)}
                      </td>
                      <td className="text-right">
                        {String(row.p95_duration_ms || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
