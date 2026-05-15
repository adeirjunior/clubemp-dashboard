import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/associados",
    await searchParams,
    "/associados",
  );
  return (
    <CompanyGenericList
      activeMenu="associates"
      columns={["Nome", "E-mail", "Status", "Comissão"]}
      data={data}
      description="Gerencie associados e acompanhe vínculos comerciais."
      headerIcon="users"
      headerTitle="Associados"
      rows={asRecordArray(data.associatedCustomers)}
    />
  );
}
