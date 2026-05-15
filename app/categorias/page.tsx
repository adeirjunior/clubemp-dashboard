import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/categorias",
    await searchParams,
    "/categorias",
  );
  const categories = asRecordArray(data.items);

  return (
    <SimpleCrudTable
      activeMenu="categories"
      columns={[
        "Nome",
        "Slug",
        "Status",
        "Comissão CAC",
        "Vínculos",
        "Atualizado em",
      ]}
      countLabel={`${categories.length} categorias`}
      createHref="/categorias/novo"
      createLabel="Nova categoria"
      description="Gerencie categorias para empresas, conteúdo editorial e organização operacional."
      emptyMessage="Nenhuma categoria encontrada."
      headerBadge="Módulo CRUD"
      headerIcon="tag"
      headerTitle="Categorias"
      rows={categories.map((category) => [
        String(category.name || "-"),
        String(category.slug || "-"),
        String(category.status_label || "-"),
        String(category.cac_commission_label || "Padrão do sistema"),
        String(category.linked_companies || "0"),
        String(category.updated_at || "-"),
      ])}
      rowActions={categories.map((category) => [
        {
          href: `/categorias/ver?id=${String(category.id || 0)}`,
          label: "Ver",
        },
        {
          href: `/categorias/editar?id=${String(category.id || 0)}`,
          label: "Editar",
          tone: "primary",
        },
      ])}
      title="Categorias da plataforma"
    />
  );
}
