import { EditorialModuleList } from "@/components/dashboard/editorial-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/sorteios",
    await searchParams,
    "/central/sorteios",
  );

  return (
    <EditorialModuleList module="sorteios" rows={asRecordArray(data.items)} />
  );
}
