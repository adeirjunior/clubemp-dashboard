import { redirect } from "next/navigation";
import { EventFormPage } from "@/components/dashboard/editorial-pages";
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
    await loadDashboardData(
      "/portal/meu-espaco/eventos",
      await searchParams,
      "/eventos/novo",
    );

    return (
      <EventFormPage
        formAction="/portal/meu-espaco/eventos"
        formItem={{}}
        isEdit={false}
        title="Novo evento"
      />
    );
  }

  if (activeContext?.kind === "customer") {
    redirect("/");
  }

  return <EventFormPage formItem={{}} isEdit={false} />;
}
