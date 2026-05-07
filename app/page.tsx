import { redirect } from "next/navigation";
import { CentralOverview } from "@/app/central/page";
import { CompanyHome, CustomerHome } from "@/components/dashboard/portal-pages";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import {
  loadCentralOverviewData,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await readBackendSession();
  if (!session.auth_user) {
    redirect("/login");
  }

  const activeContext = getActiveDashboardContext(
    session.dashboard_contexts,
    session.active_dashboard_context,
  );
  const query = await searchParams;

  if (activeContext?.kind === "company") {
    const data = await loadDashboardData("/portal/meu-espaco", query, "/");
    return <CompanyHome data={data} />;
  }

  if (activeContext?.kind === "customer") {
    const data = await loadDashboardData("/portal/minha-area", query, "/");
    return <CustomerHome data={data} />;
  }

  const data = await loadCentralOverviewData();
  return <CentralOverview data={data} />;
}
