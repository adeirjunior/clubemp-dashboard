import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/repasses",
    await searchParams,
    "/central/repasses",
  );
  const payouts = asRecordArray(data.items || data.payouts);

  return (
    <SimpleCrudTable
      activeMenu="payouts"
      columns={["Repasse", "Beneficiário", "Valor", "Status", "Criado em"]}
      countLabel={`${data.pendingPayoutsCount || payouts.length} repasses`}
      description="Acompanhe os repasses financeiros e os estados de execução."
      emptyMessage="Nenhum repasse encontrado."
      headerBadge="Financeiro"
      headerIcon="hand-coins"
      headerTitle="Repasses"
      rows={payouts.map((payout) => [
        `${String(payout.entry_type_label || "Repasse")} #${String(payout.id || "0")}`,
        String(payout.beneficiary_company_name || "-"),
        String(payout.amount || "R$ 0,00"),
        String(payout.status || "-"),
        String(payout.created_at || "-"),
      ])}
      rowActions={payouts.map((payout) => [
        {
          href: `/central/repasses/ver?id=${String(payout.id || 0)}`,
          label: "Ver",
        },
      ])}
      title="Gestão de repasses"
    />
  );
}
