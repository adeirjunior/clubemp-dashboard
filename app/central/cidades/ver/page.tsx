import { ModuleShowPage } from "@/components/dashboard/crud-pages";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/cidades/ver",
    await searchParams,
    "/central/cidades/ver",
  );
  const city = asRecord(data.item || data.city);

  return (
    <ModuleShowPage
      backHref="/central/cidades"
      description="Resumo operacional da cidade e seus vínculos no ecossistema."
      editHref={`/central/cidades/editar?id=${String(city.id || 0)}`}
      headerIcon="eye"
      headerTitle="Ver cidade"
      items={[
        { label: "Nome", value: String(city.nome || "-") },
        { label: "Imagem", value: String(city.imagem || "-") },
        {
          label: "Criada em",
          span: "full",
          value: String(city.created_at || "-"),
        },
      ]}
      meta={[
        { label: "UF", value: String(city.estado || "-") },
        { label: "Slug", value: String(city.slug || "-") },
        { label: "Empresas", value: String(city.linked_companies || "0") },
        { label: "Atualizado em", value: String(city.updated_at || "-") },
      ]}
      title={`Cidade: ${String(city.nome || "-")}`}
    />
  );
}
