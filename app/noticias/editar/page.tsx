import { notFound, redirect } from "next/navigation";
import {
  CompanyNewsEditPage,
  findCompanyNewsItem,
} from "@/components/dashboard/company-news-pages";
import { NewsFormPage } from "@/components/dashboard/editorial-pages";
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
      "/noticias/editar",
    );
    const item = findCompanyNewsItem(data, firstQueryValue(query.id));
    const canPublishDirectly =
      data.canPublishDirectly === true || data.canPublishDirectly === "1";

    if (!item) {
      notFound();
    }

    return (
      <CompanyNewsEditPage
        canPublishDirectly={canPublishDirectly}
        item={item}
      />
    );
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  const data = await loadDashboardData(
    "/dashboard/central/noticias/editar",
    query,
    "/noticias/editar",
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
