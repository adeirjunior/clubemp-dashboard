import { LucideIcon } from "@/components/lucide-icon";
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
    "/saude",
  );
  const metrics = asRecord(data.metrics);
  const rows = asRecordArray(metrics.requests_by_route);

  return (
    <main className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="activity" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Saúde do Sistema</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Monitore o desempenho da API, taxas de erro e latência global em tempo real.
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total de Requests", String(metrics.requests_total || 0), "Volume de tráfego"],
          ["Erros do Cliente (4xx)", String(metrics.errors_4xx || 0), "Tentativas inválidas"],
          ["Erros do Servidor (5xx)", String(metrics.errors_5xx || 0), "Falhas críticas"],
          ["Média de Resposta", `${String(metrics.avg_duration_ms || 0)}ms`, `P95: ${String(metrics.p95_duration_ms || 0)}ms`],
        ].map(([label, value, help]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="card-body p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 group-hover:text-primary transition-colors">{label}</p>
              <p className="text-2xl font-black mt-1 group-hover:scale-105 transition-transform origin-left">{value}</p>
              <p className="text-xs text-base-content/50 mt-1 font-medium italic">{help}</p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LucideIcon className="h-4 w-4 opacity-50" name="waypoints" />
              <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">Desempenho por Rota</h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-base-content/40">
              Gerado em {String(metrics.generated_at || "-")}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/30 text-[10px] font-black uppercase tracking-[0.15em] text-base-content/60">
                  <th className="py-4 px-6 first:pl-8">Endpoint / Rota</th>
                  <th className="py-4 px-6 text-right">Reqs</th>
                  <th className="py-4 px-6 text-right">4xx</th>
                  <th className="py-4 px-6 text-right">5xx</th>
                  <th className="py-4 px-6 text-right">Avg (ms)</th>
                  <th className="py-4 px-6 pr-8 text-right">P95 (ms)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono">
                {rows.length === 0 ? (
                  <tr>
                    <td className="py-16 text-center text-base-content/40 italic font-sans" colSpan={6}>
                      Sem dados de métricas disponíveis no momento.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={String(row.route || row.id || JSON.stringify(row))} className="group hover:bg-primary/5 transition-colors">
                      <td className="py-3 px-6 first:pl-8 text-xs font-bold text-primary">{String(row.route || "/")}</td>
                      <td className="py-3 px-6 text-right font-sans">{String(row.requests || 0)}</td>
                      <td className="py-3 px-6 text-right text-warning font-sans">{String(row.errors_4xx || 0)}</td>
                      <td className="py-3 px-6 text-right text-error font-sans">{String(row.errors_5xx || 0)}</td>
                      <td className="py-3 px-6 text-right font-sans">{String(row.avg_duration_ms || 0)}</td>
                      <td className="py-3 px-6 pr-8 text-right font-sans font-bold">{String(row.p95_duration_ms || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
