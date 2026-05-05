import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/noticias",
    await searchParams,
    "/meu-espaco/noticias",
  );
  return (
    <CompanyGenericList
      activeMenu="news"
      columns={["#", "Nome", "Descrição", "Status", "Data"]}
      data={data}
      description="Gerencie notícias publicadas pela empresa."
      headerIcon="newspaper"
      headerTitle="Notícias"
      rows={asRecordArray(data.news)}
    />
  );
}
