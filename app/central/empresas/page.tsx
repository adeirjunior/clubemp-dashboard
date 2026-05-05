import { SimpleCrudTable } from "@/components/dashboard/crud-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/empresas",
    await searchParams,
    "/central/empresas",
  );
  const companies = asRecordArray(data.companies);

  return (
    <SimpleCrudTable
      activeMenu="companies"
      columns={["Empresa", "Tipo", "Status", "Contato", "Cidade"]}
      countLabel={`${data.companiesCount || companies.length} empresas`}
      description="Consulte todas as empresas, veja se são empreendedoras, conveniadas ou ambas."
      emptyMessage="Nenhuma empresa encontrada."
      headerBadge="Administração"
      headerIcon="store"
      headerTitle="Empresas"
      rows={companies.map((company) => [
        String(company.name || "-"),
        Array.isArray(company.kinds) ? company.kinds.join(", ") : "-",
        String(company.visibility_label || "-"),
        String(company.contact_email || "-"),
        [company.city, company.state].filter(Boolean).join(" - ") || "-",
      ])}
      title="Empresas cadastradas"
    />
  );
}
