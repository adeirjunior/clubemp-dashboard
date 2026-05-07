import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/clientes",
    await searchParams,
    "/central/clientes",
  );
  const customers = asRecordArray(data.items);

  return (
    <SimpleCrudTable
      activeMenu="customers"
      columns={["Cliente", "Tipo", "Status", "Cartão", "Vínculos"]}
      countLabel={`${data.customersCount || customers.length} clientes`}
      description="Consulte todos os clientes, seus cartões, status e vínculos."
      emptyMessage="Nenhum cliente encontrado."
      headerBadge="Administração"
      headerIcon="users-round"
      headerTitle="Clientes"
      rows={customers.map((customer) => [
        String(customer.name || "-"),
        String(customer.customer_type_label || "-"),
        String(customer.status_label || "-"),
        String(customer.card_code || "-"),
        String(customer.linked_companies || "Sem vínculo"),
      ])}
      rowActions={customers.map((customer) => [
        {
          href: `/central/clientes/ver?id=${String(customer.id || 0)}`,
          label: "Ver",
        },
      ])}
      title="Usuários e clientes"
    />
  );
}
