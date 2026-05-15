import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/cobrancas",
    await searchParams,
    "/pagamentos",
  );
  return (
    <CompanyGenericList
      activeMenu="payments"
      columns={["#", "Descrição", "Valor", "Status", "Link"]}
      data={data}
      description="Gerencie cobranças Stripe criadas pela empresa."
      headerIcon="credit-card"
      headerTitle="Cobranças Stripe"
      rows={asRecordArray(data.paymentRequests)}
    />
  );
}
