import { EditorialModuleList } from "@/components/dashboard/editorial-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/eventos",
    await searchParams,
    "/central/eventos",
  );

  return (
    <EditorialModuleList module="eventos" rows={asRecordArray(data.items)} />
  );
}
