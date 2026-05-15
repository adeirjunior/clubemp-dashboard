import { redirect } from "next/navigation";
import { CompanyNewsCreatePage } from "@/components/dashboard/company-news-pages";
import { NewsFormPage } from "@/components/dashboard/editorial-pages";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import { loadDashboardData } from "@/lib/dashboard-data";

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

  if (activeContext?.kind === "company") {
    const data = await loadDashboardData(
      "/portal/meu-espaco/noticias",
      await searchParams,
      "/noticias/novo",
    );
    const canPublishDirectly =
      data.canPublishDirectly === true || data.canPublishDirectly === "1";

    return <CompanyNewsCreatePage canPublishDirectly={canPublishDirectly} />;
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  return <NewsFormPage formItem={{}} isEdit={false} />;
}
