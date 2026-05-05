import { NewsShowPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/noticias/ver",
    await searchParams,
    "/central/noticias/ver",
  );

  return (
    <NewsShowPage
      contentHtml={String(data.postContentHtml || "")}
      post={asRecord(data.post || data.item)}
    />
  );
}
