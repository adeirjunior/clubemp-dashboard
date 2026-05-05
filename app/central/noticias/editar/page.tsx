import { NewsFormPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/noticias/editar",
    await searchParams,
    "/central/noticias/editar",
  );

  return (
    <NewsFormPage
      formAction={String(data.formAction || "")}
      formItem={asRecord(data.formItem || data.item || data.post)}
      isEdit
      title={String(data.formPageTitle || "Editar notícia")}
    />
  );
}
