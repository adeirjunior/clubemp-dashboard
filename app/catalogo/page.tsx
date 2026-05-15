import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/catalogo",
    await searchParams,
    "/catalogo",
  );
  return (
    <CompanyGenericList
      activeMenu="catalog"
      columns={["#", "Nome", "Descrição", "Preço", "Status"]}
      data={data}
      description="Gerencie produtos, serviços e vantagens da empresa."
      headerIcon="shopping-bag"
      headerTitle="Catálogo"
      rows={asRecordArray(data.products)}
    />
  );
}
