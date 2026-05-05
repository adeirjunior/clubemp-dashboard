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
    "/dashboard/central/cidades/editar",
    query,
    "/central/cidades/editar",
  );
  const city = asRecord(data.item || data.city);
  const cityId = String(city.id || firstQueryValue(query.id) || 0);

  return (
    <ModuleFormPage
      action={`/dashboard/central/cidades/${cityId}/atualizar`}
      backHref="/central/cidades"
      description="Ajuste nomenclatura, UF e configurações operacionais da cidade."
      fields={[
        {
          label: "Nome da cidade",
          name: "nome",
          required: true,
          value: String(city.nome || ""),
        },
        {
          label: "UF",
          name: "estado",
          required: true,
          value: String(city.estado || ""),
        },
        { label: "Slug previsto", value: String(city.slug || "") },
        {
          help: city.imagem
            ? `Atual: ${String(city.imagem)}`
            : "Nenhuma imagem cadastrada.",
          label: "Substituir imagem",
          name: "imagem_upload",
          type: "file",
        },
      ]}
      headerIcon="pencil"
      headerTitle="Editar cidade"
      hiddenFields={{ imagem_atual: String(city.imagem || "") }}
      submitLabel="Salvar alterações"
      title={String(data.cityFormTitle || "Editar cidade")}
    />
  );
}
