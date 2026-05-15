import { notFound, redirect } from "next/navigation";
import {
  CompanyNewsShowPage,
  findCompanyNewsItem,
} from "@/components/dashboard/company-news-pages";
import { NewsShowPage } from "@/components/dashboard/editorial-pages";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import {
  asRecord,
  firstQueryValue,
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
      "/noticias/ver",
    );
    const item = findCompanyNewsItem(data, firstQueryValue(query.id));

    if (!item) {
      notFound();
    }

    return <CompanyNewsShowPage item={item} />;
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  const data = await loadDashboardData(
    "/dashboard/central/noticias/ver",
    query,
    "/noticias/ver",
  );

  return (
    <NewsShowPage
      contentHtml={String(data.postContentHtml || "")}
      post={asRecord(data.post || data.item)}
    />
  );
}
