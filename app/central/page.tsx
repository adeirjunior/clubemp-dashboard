import Link from "next/link";
import { LucideIcon } from "@/components/lucide-icon";
import { loadCentralOverviewData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export function CentralOverview({
  data,
}: {
  data: Awaited<ReturnType<typeof loadCentralOverviewData>>;
}) {
  const financeMetrics = (data.financeMetrics as Record<string, string>) || {};
  const financeCards = [
    [
      "Vendas totais",
      financeMetrics.sales_total || "-",
      `${financeMetrics.sales_count || 0} vendas registradas`,
      "shopping-cart",
    ],
    [
      "Comissões geradas",
      financeMetrics.commissions_total || "-",
      `${financeMetrics.commissions_count || 0} lançamentos`,
      "percent",
    ],
    [
      "Repasses pendentes",
      financeMetrics.pending_payouts_total || "-",
      `${data.pendingPayoutsCount || 0} pendentes`,
      "wallet",
    ],
  ];
  const modules = [
    [
      "Solicitações",
      String(data.requestsCount ?? 0),
      "Gerenciar aprovações",
      "/central/solicitacoes",
    ],
    [
      "Repasses",
      String(data.pendingPayoutsCount ?? 0),
      "Executar e conferir",
      "/central/repasses",
    ],
    [
      "Compras",
      financeMetrics.sales_count || "0",
      "Histórico da plataforma",
      "/central/compras",
    ],
    [
      "Empresas",
      String(data.companiesCount ?? 0),
      "Listar e acessar páginas públicas",
      "/central/empresas",
    ],
    [
      "Clientes",
      String(data.customersCount ?? 0),
      "Usuários, cartões e vínculos",
      "/central/clientes",
    ],
    ["Saúde", "Sistema", "Métricas de rota e erros", "/central/saude"],
    [
      "Notícias",
      String(data.blogPostsCount ?? 0),
      "Listagem, criação e edição editorial",
      "/central/noticias",
    ],
    [
      "Eventos",
      String(data.eventsCount ?? 0),
      "Agenda, inscrições e publicação",
      "/central/eventos",
    ],
    [
      "Cursos",
      String(data.coursesCount ?? 0),
      "Catálogo, acesso e monetização",
      "/central/cursos",
    ],
    [
      "Sorteios",
      String(data.giveawaysCount ?? 0),
      "Campanhas, cupons e vencedores",
      "/central/sorteios",
    ],
    [
      "Convites",
      "Empreendedores",
      "Enviar convite por e-mail",
      "/central/convites/empreendedores",
    ],
  ];

  return (
    <>
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {financeCards.map(([label, value, help, icon]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <LucideIcon className="h-4 w-4" name={icon} />
                {value}
              </h2>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map(([title, value, help, href]) => (
          <Link
            key={href}
            className="card border border-base-300 bg-base-100 shadow-sm hover:border-primary"
            href={href}
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{title}</p>
              <p className="text-lg font-bold">{value}</p>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

export default async function Page() {
  const data = await loadCentralOverviewData();

  return <CentralOverview data={data} />;
}
