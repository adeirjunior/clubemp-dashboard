import { redirect } from "next/navigation";
import { CompanyNewsListPage } from "@/components/dashboard/company-news-pages";
import { NewsListPage } from "@/components/dashboard/editorial-pages";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import {
  asRecord,
  asRecordArray,
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
    const data = await loadDashboardData(
      "/portal/meu-espaco/noticias",
      query,
      "/noticias",
    );
    const canPublishDirectly =
      data.canPublishDirectly === true || data.canPublishDirectly === "1";

    return (
      <CompanyNewsListPage
        canPublishDirectly={canPublishDirectly}
        data={data}
      />
    );
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  const data = await loadDashboardData(
    "/dashboard/central/noticias",
    query,
    "/noticias",
  );

  return (
    <NewsListPage
      posts={asRecordArray(data.items || data.posts)}
      statusFilter={String(data.statusFilter || "pending")}
      statusOptions={asRecord(data.statusOptions)}
    />
  );
}
