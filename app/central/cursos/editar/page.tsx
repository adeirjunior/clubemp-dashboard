import { CourseFormPage } from "@/components/dashboard/editorial-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/cursos/editar",
    await searchParams,
    "/central/cursos/editar",
  );

  return (
    <CourseFormPage
      formAction={String(data.formAction || "")}
      formItem={asRecord(data.formItem || data.item || data.course)}
      isEdit
      title={String(data.formPageTitle || "Editar curso")}
    />
  );
}
