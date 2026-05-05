import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/compras",
    await searchParams,
    "/meu-espaco/compras",
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
