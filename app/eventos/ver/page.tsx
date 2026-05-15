import { EditorialShowPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/eventos/ver",
    await searchParams,
    "/eventos/ver",
  );

  return (
    <EditorialShowPage
      item={asRecord(data.event || data.item)}
      module="eventos"
    />
  );
}
