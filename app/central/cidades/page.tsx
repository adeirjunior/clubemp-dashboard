import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/cidades",
    await searchParams,
    "/central/cidades",
  );
  const cities = asRecordArray(data.items);

  return (
    <SimpleCrudTable
      activeMenu="cities"
      columns={["Cidade", "UF", "Slug", "Empresas vinculadas", "Atualizado em"]}
      countLabel={`${cities.length} cidades`}
      createHref="/central/cidades/novo"
      createLabel="Nova cidade"
      description="Cadastre e organize os municípios usados por empresas, convites e filtros."
      emptyMessage="Nenhuma cidade encontrada."
      headerIcon="map-pin"
      headerTitle="Cidades"
      rows={cities.map((city) => [
        String(city.nome || "-"),
        String(city.estado || "-"),
        String(city.slug || "-"),
        String(city.linked_companies || "0"),
        String(city.updated_at || "-"),
      ])}
      rowActions={cities.map((city) => [
        {
          href: `/central/cidades/ver?id=${String(city.id || 0)}`,
          label: "Ver",
        },
        {
          href: `/central/cidades/editar?id=${String(city.id || 0)}`,
          label: "Editar",
          tone: "primary",
        },
      ])}
      title="Cidades disponíveis no sistema"
    />
  );
}
