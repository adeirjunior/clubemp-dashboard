import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import { firstQueryValue, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function daysFromQuery(query: Record<string, string | string[] | undefined>) {
  const raw = Number(firstQueryValue(query.days));
  if (!Number.isFinite(raw)) {
    return "30";
  }

  return String(Math.max(1, Math.min(365, Math.trunc(raw))));
}

export default async function Page({ searchParams }: PageProps) {
  const session = await readBackendSession();
  if (!session.auth_user) {
    redirect("/login");
  }

  const activeContext = getActiveDashboardContext(
    session.dashboard_contexts,
    session.active_dashboard_context,
  );

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  const query = await searchParams;
  const days = daysFromQuery(query);
  const data = await loadDashboardData(
    activeContext?.kind === "company"
      ? "/analytics/company"
      : "/analytics/admin",
    { ...query, days },
    "/analytics",
  );

  return (
    <AnalyticsDashboard
      data={data}
      days={days}
      isAdmin={activeContext?.kind !== "company"}
    />
  );
}
