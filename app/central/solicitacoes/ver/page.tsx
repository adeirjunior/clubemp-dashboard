import { ModuleShowPage } from "@/components/dashboard/crud-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/solicitacoes/ver",
    await searchParams,
    "/central/solicitacoes/ver",
  );
  const item = asRecord(data.item || data.request || data.requestItem);

  return (
    <ModuleShowPage
      backHref="/central/solicitacoes"
      description="Visualização administrativa completa da proposta recebida."
      headerIcon="eye"
      headerTitle="Ver solicitação"
      items={[
        { label: "Razão social", value: String(item.legal_name || "-") },
        {
          label: "Nome fantasia",
          value: String(item.trade_name || item.company_name || "-"),
        },
        {
          label: "Documento",
          value: `${item.document_type ? `${String(item.document_type).toUpperCase()}: ` : ""}${String(item.company_document || "-")}`,
        },
        {
          label: "Cidade / UF",
          value:
            [String(item.city || ""), String(item.state || "")]
              .filter(Boolean)
              .join(" - ") || "-",
        },
        { label: "Contato principal", value: String(item.contact_name || "-") },
        {
          label: "Empreendedor / responsável",
          value: String(item.entrepreneur_name || "-"),
        },
        { label: "E-mail comercial", value: String(item.email || "-") },
        { label: "Telefone comercial", value: String(item.phone || "-") },
        { label: "WhatsApp", value: String(item.whatsapp || "-") },
        { label: "Website", value: String(item.website || "-") },
        {
          label: "Resumo da proposta",
          span: "full",
          value: String(item.message || "-"),
        },
      ]}
      meta={[
        { label: "Tipo", value: String(item.request_type_label || "-") },
        {
          label: "Contato",
          value: String(item.contact_name || item.entrepreneur_name || "-"),
        },
        { label: "Status", value: String(item.status_label || "-") },
        { label: "Recebido em", value: String(item.created_at || "-") },
      ]}
      title={`Solicitação: ${String(item.company_name || "-")}`}
    />
  );
}
