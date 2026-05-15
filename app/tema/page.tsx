import { AccountSettings } from "@/components/dashboard/portal-pages";
import { loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/configuracoes",
    await searchParams,
    "/tema",
  );

  return <AccountSettings data={data} successRedirectTo="/tema" />;
}
