import { AddCompany } from "@/components/dashboard/portal-pages";
import { loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/empresas/adicionar",
    await searchParams,
    "/empresas/adicionar",
  );

  return <AddCompany data={data} />;
}
