import Link from "next/link";
import { redirect } from "next/navigation";
import { CompanyHome, CustomerHome } from "@/components/dashboard/portal-pages";
import { LucideIcon } from "@/components/lucide-icon";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import {
  loadCentralOverviewData,
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
    const data = await loadDashboardData("/portal/meu-espaco", query, "/");
    return <CompanyHome data={data} />;
  }

  if (activeContext?.kind === "customer") {
    const data = await loadDashboardData("/portal/minha-area", query, "/");
    return <CustomerHome data={data} />;
  }

  const data = await loadCentralOverviewData();
  return <CentralOverview data={data} />;
}

function CentralOverview({
  data,
}: {
  data: Awaited<ReturnType<typeof loadCentralOverviewData>>;
}) {
  const financeMetrics = (data.financeMetrics as Record<string, string>) || {};
  const financeCards = [
    {
      help: `${financeMetrics.sales_count || 0} vendas registradas`,
      icon: "shopping-cart",
      label: "Volume de Vendas",
      tone: "emerald",
      value: financeMetrics.sales_total || "-",
    },
    {
      help: `${financeMetrics.commissions_count || 0} lançamentos`,
      icon: "percent",
      label: "Comissões Brutas",
      tone: "blue",
      value: financeMetrics.commissions_total || "-",
    },
    {
      help: `${data.pendingPayoutsCount || 0} aguardando execução`,
      icon: "hand-coins",
      label: "Repasses Pendentes",
      tone: "amber",
      value: financeMetrics.pending_payouts_total || "-",
    },
  ];

  const moduleGrid = [
    {
      category: "Operações",
      description: "Gerenciar pedidos de entrada",
      href: "/solicitacoes",
      icon: "building-2",
      label: "Solicitações",
      value: String(data.requestsCount ?? 0),
    },
    {
      category: "Financeiro",
      description: "Controle de transferências",
      href: "/repasses",
      icon: "wallet",
      label: "Repasses",
      value: String(data.pendingPayoutsCount ?? 0),
    },
    {
      category: "Financeiro",
      description: "Histórico global de vendas",
      href: "/compras",
      icon: "shopping-cart",
      label: "Vendas",
      value: String(financeMetrics.sales_count || "0"),
    },
    {
      category: "Cadastros",
      description: "Empresas e parceiros",
      href: "/empresas",
      icon: "store",
      label: "Empresas",
      value: String(data.companiesCount ?? 0),
    },
    {
      category: "Cadastros",
      description: "Usuários e cartões",
      href: "/clientes",
      icon: "users-round",
      label: "Clientes",
      value: String(data.customersCount ?? 0),
    },
    {
      category: "Conteúdo",
      description: "Blog e comunicados",
      href: "/noticias",
      icon: "newspaper",
      label: "Notícias",
      value: String(data.blogPostsCount ?? 0),
    },
    {
      category: "Conteúdo",
      description: "Agenda do ecossistema",
      href: "/eventos",
      icon: "calendar-days",
      label: "Eventos",
      value: String(data.eventsCount ?? 0),
    },
    {
      category: "Sistema",
      description: "Performance e erros",
      href: "/saude",
      icon: "activity",
      label: "Saúde",
      value: "OK",
    },
  ];

  // Tailwind Safelist: bg-emerald-500 bg-blue-500 bg-amber-500

  return (
    <main className="space-y-4 py-4 pb-16">
      {/* Header Central Standardized */}
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name="layout-dashboard" className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">Visão Geral Central</h1>
                <span className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-wider">
                  Administração
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                Monitoramento estratégico de performance, finanças e operações do ecossistema Clubemp.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-base-200/50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-base-content/50 border border-base-300">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
              Sistema Online
            </div>
          </div>
        </div>
      </article>

      {/* Métricas Financeiras */}
      <section className="space-y-3">
        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-base-content/40 italic">Métricas de Performance</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {financeCards.map((card) => {
            const config = {
              emerald: { bg: "bg-emerald-500" },
              blue: { bg: "bg-blue-500" },
              amber: { bg: "bg-amber-500" },
            }[card.tone as "emerald" | "blue" | "amber"];

            return (
              <article
                key={card.label}
                className="group relative rounded-[2rem] border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm transition-all hover:border-primary/30 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                  <div className={`absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full opacity-[0.05] group-hover:opacity-[0.15] transition-opacity ${config.bg}`} />
                </div>

                <div className="relative flex flex-col justify-between h-full space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-base-content/30">{card.label}</span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 group-hover:bg-primary/10 text-base-content/20 group-hover:text-primary transition-all shadow-inner">
                      <LucideIcon name={card.icon} className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter text-base-content">
                      {card.value && card.value !== "-" ? card.value : "R$ 0,00"}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 italic">
                      {card.help}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Grid de Módulos */}
      <section className="space-y-3 pb-8">
        <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-base-content/40 italic">Módulos Operacionais</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {moduleGrid.map((mod) => (
            <Link
              key={mod.href}
              className="group flex flex-col rounded-[2rem] border border-base-300 bg-base-100 p-6 sm:p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-xl hover:-translate-y-1"
              href={mod.href}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-all shadow-inner">
                  <LucideIcon name={mod.icon} className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-base-content/10 group-hover:text-primary/40 transition-colors">
                  {mod.value}
                </span>
              </div>
              <div className="mt-auto">
                <p className="text-[9px] font-black uppercase tracking-widest text-base-content/30 mb-1">{mod.category}</p>
                <h3 className="text-lg font-black text-base-content group-hover:text-primary transition-colors">{mod.label}</h3>
                <p className="mt-1.5 text-xs font-medium text-base-content/60 leading-relaxed line-clamp-2">
                  {mod.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
