import { ModuleFormPage } from "@/components/dashboard/crud-pages";
import {
  asRecord,
  firstQueryValue,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const data = await loadDashboardData(
    "/dashboard/central/categorias/editar",
    query,
    "/central/categorias/editar",
  );
  const category = asRecord(data.item || data.category);
  const categoryId = String(category.id || firstQueryValue(query.id) || 0);

  return (
    <ModuleFormPage
      action={`/dashboard/central/categorias/${categoryId}/atualizar`}
      backHref="/central/categorias"
      description="Atualize nome e comunicação visual da categoria selecionada."
      fields={[
        {
          label: "Nome",
          name: "name",
          required: true,
          value: String(category.name || ""),
        },
        { label: "Slug previsto", value: String(category.slug || "") },
        {
          label: "Ícone",
          name: "icon",
          placeholder: "Ex: badge-percent",
          value: String(category.icon || ""),
        },
        {
          label: "Status",
          name: "status",
          options: { active: "Ativa", inactive: "Inativa" },
          type: "select",
          value: String(category.status || "active"),
        },
        {
          help: "Use 1,8 para consórcios; 2,0 para carros/imóveis; 4,99 para comércios e serviços.",
          label: "Comissão CAC (%)",
          name: "cac_commission_percent",
          value: String(category.cac_commission_percent || ""),
        },
        {
          label: "Descrição curta",
          name: "description",
          span: "full",
          type: "textarea",
          value: String(category.description || ""),
        },
        {
          help: category.image ? `Atual: ${String(category.image)}` : undefined,
          label: "Substituir imagem",
          name: "image_upload",
          span: "full",
          type: "file",
        },
      ]}
      headerIcon="pencil"
      headerTitle="Editar categoria"
      hiddenFields={{ image_atual: String(category.image || "") }}
      submitLabel="Salvar alterações"
      title={String(data.categoryFormTitle || "Editar categoria")}
    />
  );
}
