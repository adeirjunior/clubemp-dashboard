import { ModuleShowPage } from "@/components/dashboard/crud-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/repasses/ver",
    await searchParams,
    "/central/repasses/ver",
  );
  const payout = asRecord(data.item || data.payout);

  return (
    <ModuleShowPage
      backHref="/central/repasses"
      description="Detalhamento de lote financeiro e comprovação operacional."
      headerIcon="eye"
      headerTitle="Ver repasse"
      items={[
        { label: "Criado em", value: String(payout.created_at || "-") },
        { label: "Executado em", value: String(payout.executed_at || "-") },
        {
          label: "Observações",
          span: "full",
          value:
            "Use o módulo principal de repasses para executar e emitir comprovante.",
        },
      ]}
      meta={[
        {
          label: "Beneficiário",
          value: String(payout.beneficiary_company_name || "-"),
        },
        { label: "Valor", value: String(payout.amount || "R$ 0,00") },
        { label: "Status", value: String(payout.status || "-") },
        {
          label: "Origem",
          value: String(payout.origin_company_name || "-"),
        },
      ]}
      title={`Repasse #${String(payout.id || "0")}`}
    />
  );
}
