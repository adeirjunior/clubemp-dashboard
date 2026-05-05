import { EditorialShowPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/sorteios/ver",
    await searchParams,
    "/central/sorteios/ver",
  );

  return (
    <EditorialShowPage
      item={asRecord(data.giveaway || data.item)}
      module="sorteios"
    />
  );
}
