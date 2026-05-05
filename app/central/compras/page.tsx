import { DashboardShell } from "@/components/dashboard-shell";
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
    "/dashboard/central/compras",
    await searchParams,
    "/central/compras",
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
    <DashboardShell
      activeMenu="sales"
      headerBadge={`${String(summary.sales_count || 0)} vendas`}
      headerIcon="shopping-cart"
      headerTitle="Compras e vendas"
    >
      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          [
            "Volume total",
            String(summary.total_amount || "R$ 0,00"),
            `${String(summary.sales_count || 0)} vendas`,
          ],
          [
            "Pagas",
            String(summary.paid_amount || "R$ 0,00"),
            `${String(summary.paid_count || 0)} pedidos pagos`,
          ],
          [
            "Clientes compradores",
            String(summary.unique_customers || 0),
            `${String(summary.pending_count || 0)} pedidos pendentes`,
          ],
        ].map(([label, value, help]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-4">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <LucideIcon className="h-4 w-4" name="receipt" />
              Histórico de compras da plataforma
            </h2>
            <div className="overflow-x-auto rounded-xl border border-base-300">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Data</th>
                    <th>Loja</th>
                    <th>Cliente</th>
                    <th>Perfil</th>
                    <th>Empresa vinculada</th>
                    <th>Pagamento</th>
                    <th>Total</th>
                    <th>Comissão</th>
                  </tr>
                </thead>
                <tbody>
                  {salesRows.length === 0 ? (
                    <tr>
                      <td
                        className="text-center text-sm text-base-content/65"
                        colSpan={9}
                      >
                        Nenhuma compra registrada.
                      </td>
                    </tr>
                  ) : (
                    salesRows.map((sale) => (
                      <tr key={String(sale.id || JSON.stringify(sale))}>
                        <td className="font-semibold">
                          #{String(sale.id || "0")}
                        </td>
                        <td>{String(sale.created_at || "-")}</td>
                        <td>{String(sale.seller_tenant_name || "-")}</td>
                        <td>
                          {String(sale.customer_name || "Não identificado")}
                        </td>
                        <td>{String(sale.customer_type_label || "-")}</td>
                        <td>{String(sale.linked_tenant_name || "-")}</td>
                        <td>{String(sale.payment_status || "-")}</td>
                        <td>{String(sale.total_amount || "R$ 0,00")}</td>
                        <td>{String(sale.commission_amount || "R$ 0,00")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}
