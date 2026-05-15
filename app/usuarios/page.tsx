import { CompanyGenericList } from "@/components/dashboard/portal-pages";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/usuarios",
    await searchParams,
    "/usuarios",
  );
  return (
    <CompanyGenericList
      activeMenu="users"
      columns={["Nome", "E-mail", "Perfil", "Permissões", "Status"]}
      data={data}
      description="Gerencie usuários e convites da equipe da empresa."
      headerIcon="users"
      headerTitle="Equipe da empresa"
      rows={asRecordArray(data.teamUsers)}
    />
  );
}
