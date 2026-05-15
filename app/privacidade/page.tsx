import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/privacidade",
    await searchParams,
    "/privacidade",
  );
  const requests = asRecordArray(data.requests);

  return (
    <SimpleCrudTable
      activeMenu="privacy"
      columns={["Titular", "Tipo", "Status", "Solicitado em"]}
      countLabel={`${data.requestsCount || requests.length} solicitações`}
      description="Consulte e trate pedidos de acesso, correção, eliminação e portabilidade."
      emptyMessage="Nenhuma solicitação LGPD encontrada."
      headerBadge="Administração"
      headerIcon="shield-check"
      headerTitle="Solicitações LGPD"
      rows={requests.map((request) => [
        String(request.full_name || "-"),
        String(request.request_type_label || "-"),
        String(request.status_label || "-"),
        String(request.created_at || "-"),
      ])}
      rowActions={requests.map((request) => [
        {
          href: `/privacidade/ver?id=${String(request.id || 0)}`,
          label: "Ver",
        },
      ])}
      title="Canal de direitos do titular"
    />
  );
}
