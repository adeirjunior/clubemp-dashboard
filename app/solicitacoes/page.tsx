import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/solicitacoes",
    await searchParams,
    "/solicitacoes",
  );
  const requests = asRecordArray(data.items || data.requests);

  return (
    <SimpleCrudTable
      activeMenu="requests"
      columns={["Empresa", "Tipo", "Contato", "Status", "Criado em"]}
      countLabel={`${data.requestsCount || requests.length} solicitações`}
      description="Acompanhe solicitações comerciais e operacionais enviadas ao Clubemp."
      emptyMessage="Nenhuma solicitação encontrada."
      headerBadge="Administração"
      headerIcon="building-2"
      headerTitle="Solicitações"
      rows={requests.map((request) => [
        String(request.company_name || "-"),
        String(request.request_type_label || "-"),
        String(request.contact_name || request.entrepreneur_name || "-"),
        String(request.status_label || "-"),
        String(request.created_at || "-"),
      ])}
      rowActions={requests.map((request) => [
        {
          href: `/solicitacoes/ver?id=${String(request.id || 0)}`,
          label: "Ver",
        },
      ])}
      title="Fila de solicitações"
    />
  );
}
