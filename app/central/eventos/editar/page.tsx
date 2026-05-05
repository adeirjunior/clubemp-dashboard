import { EventFormPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/eventos/editar",
    await searchParams,
    "/central/eventos/editar",
  );

  return (
    <EventFormPage
      formAction={String(data.formAction || "")}
      formItem={asRecord(data.formItem || data.item || data.event)}
      isEdit
      title={String(data.formPageTitle || "Editar evento")}
    />
  );
}
