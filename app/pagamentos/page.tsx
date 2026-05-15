import { redirect } from "next/navigation";
import {
  CompanyGenericList,
  CustomerPayments,
} from "@/components/dashboard/portal-pages";
import { readBackendSession } from "@/lib/backend";
import { getActiveDashboardContext } from "@/lib/dashboard-context.mjs";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

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
      "/portal/meu-espaco/cobrancas",
      query,
      "/pagamentos",
    );

    return (
      <CompanyGenericList
        activeMenu="payments"
        columns={["#", "Descrição", "Valor", "Status", "Link"]}
        data={data}
        description="Gerencie cobranças Stripe criadas pela empresa."
        headerIcon="credit-card"
        headerTitle="Cobranças Stripe"
        rows={asRecordArray(data.paymentRequests)}
      />
    );
  }

  if (activeContext?.kind === "customer") {
    const data = await loadDashboardData(
      "/portal/minha-area/pagamentos",
      query,
      "/pagamentos",
    );

    return <CustomerPayments data={data} />;
  }

  redirect("/");
}
