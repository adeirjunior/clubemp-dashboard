import Link from "next/link";
import { redirect } from "next/navigation";
import { EditorialModuleList } from "@/components/dashboard/editorial-pages";
import { LucideIcon } from "@/components/lucide-icon";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
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
  const session = await readBackendSession();
  if (!session.auth_user) {
    redirect("/login");
  }

  const activeContext = getActiveDashboardContext(
    session.dashboard_contexts,
    session.active_dashboard_context,
  );
  const query = await searchParams;

  if (activeContext?.kind === "company") {
    const data = await loadDashboardData(
      "/portal/meu-espaco/eventos",
      query,
      "/eventos",
    );
    const events = asRecordArray(data.events);
    const canPublishDirectly =
      data.canPublishDirectly === true || data.canPublishDirectly === "1";

    return (
      <section className="mt-4 space-y-6">
        {/* Header Profissional */}
        <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <LucideIcon name="calendar-days" className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight">
                    Meus Eventos
                  </h1>
                  <span
                    className={`badge ${canPublishDirectly ? "badge-success" : "badge-warning"} badge-outline text-[10px] font-black uppercase tracking-wider`}
                  >
                    {canPublishDirectly
                      ? "Escritor liberado"
                      : "Revisão obrigatória"}
                  </span>
                </div>
                <p className="max-w-2xl text-sm font-medium text-base-content/60">
                  {canPublishDirectly
                    ? "Sua empresa pode publicar eventos diretamente na agenda da plataforma."
                    : "Eventos enviados ficam em revisão até aprovação da administração."}
                </p>
              </div>
            </div>
            <Link
              className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20"
              href="/eventos/novo"
            >
              <LucideIcon name="plus" className="h-4 w-4" />
              Criar evento
            </Link>
          </div>
        </article>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs font-black uppercase tracking-widest text-base-content/70">
                    <th className="py-5 px-6 first:pl-8">Evento</th>
                    <th className="py-5 px-6">Início</th>
                    <th className="py-5 px-6 pr-8 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {events.length === 0 ? (
                    <tr>
                      <td
                        className="py-16 text-center text-base-content/50 italic"
                        colSpan={3}
                      >
                        Nenhum evento enviado.
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr
                        key={String(event.id || event.title)}
                        className="group hover:bg-primary/5 transition-colors"
                      >
                        <td className="py-4 px-6 first:pl-8">
                          <strong className="block text-base-content group-hover:text-primary transition-colors">
                            {String(event.title || "-")}
                          </strong>
                          <p className="text-xs text-base-content/50 line-clamp-1">
                            {String(event.summary || "Sem resumo.")}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-base-content/60 font-semibold">
                          {String(event.starts_at || "-")}
                        </td>
                        <td className="py-4 px-6 pr-8 text-right">
                          <span className="badge badge-outline badge-sm font-bold opacity-80">
                            {String(event.status_label || event.status || "-")}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black tracking-tight mb-4">
                <LucideIcon
                  name="plus-circle"
                  className="h-5 w-5 text-primary"
                />
                Ações rápidas
              </h2>
              <p className="text-sm text-base-content/60 leading-relaxed mb-6">
                Crie um novo evento agora para aumentar a visibilidade da sua
                empresa no ecossistema.
              </p>
              <Link
                className="btn btn-primary w-full rounded-2xl"
                href="/eventos/novo"
              >
                Começar agora
              </Link>
            </article>

            <article className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 mb-3">
                Dica
              </h3>
              <p className="text-xs text-blue-900/70 leading-relaxed">
                Eventos com banners de alta qualidade e descrições claras atraem
                3x mais interessados.
              </p>
            </article>
          </aside>
        </div>
      </section>
    );
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  const data = await loadDashboardData(
    "/dashboard/central/eventos",
    query,
    "/eventos",
  );

  return (
    <EditorialModuleList
      module="eventos"
      rows={asRecordArray(data.items)}
      statusFilter={String(data.statusFilter || "pending")}
      statusOptions={asRecord(data.statusOptions)}
    />
  );
}
