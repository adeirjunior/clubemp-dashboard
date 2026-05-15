import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CompanyGenericList,
  PurchasesPage,
} from "@/components/dashboard/portal-pages";
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
      "/portal/meu-espaco/compras",
      query,
      "/compras",
    );

    return (
      <CompanyGenericList
        activeMenu="sales"
        columns={[
          "#",
          "Data",
          "Cliente",
          "Status",
          "Pagamento",
          "Total",
          "Comissão",
        ]}
        data={data}
        description="Acompanhe compras e vendas relacionadas à empresa."
        headerIcon="shopping-cart"
        headerTitle="Compras"
        rows={asRecordArray(data.salesRows || data.items)}
      />
    );
  }

  if (activeContext?.kind === "customer") {
    const data = await loadDashboardData(
      "/portal/minhas-compras",
      query,
      "/compras",
    );
    return <PurchasesPage data={data} />;
  }

  const data = await loadDashboardData(
    "/dashboard/central/compras",
    query,
    "/compras",
  );
  const salesRows = asRecordArray(data.salesRows || data.items);
  const summary = {
    paid_amount: "R$ 0,00",
    paid_count: salesRows.filter(
      (row) => String(row.payment_status || row.paymentStatus || "") === "paid",
    ).length,
    pending_count: salesRows.filter(
      (row) => String(row.payment_status || row.paymentStatus || "") !== "paid",
    ).length,
    sales_count: salesRows.length,
    total_amount: "R$ 0,00",
    unique_customers: new Set(
      salesRows.map((row) =>
        String(row.buyer_customer_id || row.buyerCustomerId || ""),
      ),
    ).size,
    ...asRecord(data.salesSummary),
  };

  return (
    <main className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="shopping-cart" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">
              Relatório de Vendas
            </h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Acompanhe o volume financeiro, conversão de pedidos e comissões da
              plataforma.
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          [
            "Volume total",
            String(summary.total_amount || "R$ 0,00"),
            `${String(summary.sales_count || 0)} vendas totais`,
          ],
          [
            "Vendas Pagas",
            String(summary.paid_amount || "R$ 0,00"),
            `${String(summary.paid_count || 0)} pedidos concluídos`,
          ],
          [
            "Conversão",
            String(summary.unique_customers || 0),
            `${String(summary.pending_count || 0)} pedidos aguardando`,
          ],
        ].map(([label, value, help]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="card-body p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 group-hover:text-primary transition-colors">
                {label}
              </p>
              <p className="text-2xl font-black mt-1 group-hover:scale-105 transition-transform origin-left">
                {value}
              </p>
              <p className="text-xs text-base-content/50 mt-1 font-medium italic">
                {help}
              </p>
            </div>
            <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500"></div>
          </article>
        ))}
      </section>

      <section>
        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center gap-2">
            <LucideIcon className="h-4 w-4 opacity-50" name="receipt" />
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">
              Histórico de Movimentações
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/30 text-[10px] font-black uppercase tracking-[0.15em] text-base-content/60">
                  <th className="py-4 px-6 first:pl-8">ID</th>
                  <th className="py-4 px-6">Data</th>
                  <th className="py-4 px-6">Loja / Vendedor</th>
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-6">Pagamento</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Comissão</th>
                  <th className="py-4 px-6 pr-8 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-base-content/80">
                {salesRows.length === 0 ? (
                  <tr>
                    <td
                      className="py-16 text-center text-base-content/40 italic"
                      colSpan={8}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <LucideIcon
                          name="search"
                          className="h-8 w-8 opacity-20"
                        />
                        Nenhuma venda registrada ainda.
                      </div>
                    </td>
                  </tr>
                ) : (
                  salesRows.map((sale) => (
                    <tr
                      key={String(sale.id || JSON.stringify(sale))}
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6 first:pl-8 font-bold">
                        #{String(sale.id || "0")}
                      </td>
                      <td className="py-4 px-6 opacity-60 text-xs">
                        {String(sale.created_at || "-")}
                      </td>
                      <td className="py-4 px-6 font-bold">
                        {String(sale.seller_tenant_name || "-")}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {String(sale.customer_name || "Não identificado")}
                          </span>
                          <span className="text-[10px] font-black uppercase opacity-40">
                            {String(sale.customer_type_label || "-")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge badge-outline badge-sm font-black uppercase text-[9px] opacity-70">
                          {String(sale.payment_status || "-")}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-black">
                        {String(sale.total_amount || "R$ 0,00")}
                      </td>
                      <td className="py-4 px-6 text-emerald-600 font-black">
                        {String(sale.commission_amount || "R$ 0,00")}
                      </td>
                      <td className="py-4 px-6 pr-8 text-right">
                        <Link
                          className="btn btn-outline btn-xs rounded-lg group-hover:bg-primary group-hover:text-primary-content transition-all"
                          href={`/compras/ver?id=${String(sale.id || 0)}`}
                        >
                          Detalhes
                        </Link>
                      </td>
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
