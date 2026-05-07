import { ModuleShowPage } from "@/components/dashboard/crud-pages";
import {
  asRecord,
  firstQueryValue,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function centsToCurrency(value: unknown) {
  const cents = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(Number.isFinite(cents) ? cents / 100 : 0);
}

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const saleId = firstQueryValue(query.id);
  const data = await loadDashboardData(
    `/dashboard/central/compras/${saleId}`,
    query,
    "/central/compras/ver",
  );
  const sale = asRecord(data.item || data.sale);

  return (
    <ModuleShowPage
      backHref="/central/compras"
      description="Consulta administrativa da compra. Valores e status vêm do fluxo financeiro e não devem ser editados manualmente pelo painel."
      headerIcon="receipt"
      headerTitle="Ver compra"
      items={[
        { label: "Tenant vendedor", value: String(sale.tenant_id || "-") },
        {
          label: "Empresa vendedora",
          value: String(sale.vendor_company_id || "-"),
        },
        {
          label: "Cliente comprador",
          value: String(sale.buyer_customer_id || "-"),
        },
        {
          label: "Payment intent",
          value: String(sale.payment_intent_id || "-"),
        },
        {
          label: "Observações",
          span: "full",
          value: String(sale.notes || "Sem observações registradas."),
        },
      ]}
      meta={[
        { label: "Status", value: String(sale.status || "-") },
        { label: "Pagamento", value: String(sale.payment_status || "-") },
        { label: "Subtotal", value: centsToCurrency(sale.subtotal_cents) },
        { label: "Total", value: centsToCurrency(sale.total_cents) },
      ]}
      title={`Compra #${String(sale.id || "0")}`}
    />
  );
}
