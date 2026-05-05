import { ModuleShowPage } from "@/components/dashboard/crud-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/categorias/ver",
    await searchParams,
    "/central/categorias/ver",
  );
  const category = asRecord(data.item || data.category);

  return (
    <ModuleShowPage
      backHref="/central/categorias"
      description="Visualização consolidada da categoria e seus usos principais."
      editHref={`/central/categorias/editar?id=${String(category.id || 0)}`}
      headerIcon="eye"
      headerTitle="Ver categoria"
      items={[
        { label: "Nome", value: String(category.name || "-") },
        { label: "Ícone", value: String(category.icon || "-") },
        {
          label: "Comissão CAC",
          value: String(category.cac_commission_label || "Padrão do sistema"),
        },
        {
          label: "Descrição",
          span: "full",
          value: String(category.description || "-"),
        },
      ]}
      meta={[
        { label: "Status", value: String(category.status_label || "-") },
        { label: "Slug", value: String(category.slug || "-") },
        { label: "Criada em", value: String(category.created_at || "-") },
        { label: "Vínculos", value: String(category.linked_companies || "0") },
      ]}
      title={`Categoria: ${String(category.name || "-")}`}
    />
  );
}
