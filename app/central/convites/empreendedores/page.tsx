import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { asRecordArray, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/dashboard/central/convites/empreendedores",
    await searchParams,
    "/central/convites/empreendedores",
  );
  const invites = asRecordArray(data.invites);
  const partnerCompanies = asRecordArray(data.partnerCompanies);
  const oldInviteType = String(data.oldInviteType || "empresa_empreendedora");
  const oldCompanyId = String(data.oldCompanyId || "");
  const oldEmail = String(data.oldEmail || "");

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr,1.8fr]">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">
            <LucideIcon className="h-4 w-4" name="send" />
            Enviar convite
          </h2>
          <p className="text-sm text-base-content/70">
            Escolha o tipo de convite, informe o e-mail e o sistema envia o link
            correto para cadastro ou aceite.
          </p>
          <BackendForm
            backendPath="/dashboard/central/convites/empreendedores"
            className="mt-3 space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                <input
                  className="peer sr-only"
                  defaultChecked={oldInviteType === "cliente_associado"}
                  name="invitation_kind"
                  type="radio"
                  value="cliente_associado"
                />
                <span className="space-y-1">
                  <span className="block font-bold">Cliente associado</span>
                  <span className="block text-sm text-base-content/70">
                    Cliente sem vínculo inicial com empresa conveniada.
                  </span>
                </span>
              </label>
              <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                <input
                  className="peer sr-only"
                  defaultChecked={
                    oldInviteType === "cliente_associado_conveniado"
                  }
                  name="invitation_kind"
                  type="radio"
                  value="cliente_associado_conveniado"
                />
                <span className="space-y-1">
                  <span className="block font-bold">
                    Cliente associado conveniado
                  </span>
                  <span className="block text-sm text-base-content/70">
                    Cliente chamado por uma empresa conveniada.
                  </span>
                </span>
              </label>
              <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                <input
                  className="peer sr-only"
                  defaultChecked={oldInviteType === "empresa_conveniada"}
                  name="invitation_kind"
                  type="radio"
                  value="empresa_conveniada"
                />
                <span className="space-y-1">
                  <span className="block font-bold">Empresa conveniada</span>
                  <span className="block text-sm text-base-content/70">
                    Fluxo institucional para empresa conveniada.
                  </span>
                </span>
              </label>
              <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                <input
                  className="peer sr-only"
                  defaultChecked={oldInviteType === "empresa_empreendedora"}
                  name="invitation_kind"
                  type="radio"
                  value="empresa_empreendedora"
                />
                <span className="space-y-1">
                  <span className="block font-bold">Empresa empreendedora</span>
                  <span className="block text-sm text-base-content/70">
                    Fluxo com vitrine, categorias, cidades de atuação e 2
                    brindes mensais.
                  </span>
                </span>
              </label>
            </div>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Empresa conveniada
              </span>
              <select
                className="select select-bordered w-full"
                defaultValue={oldCompanyId}
                name="company_id"
              >
                <option value="">Selecione para convite conveniado</option>
                {partnerCompanies.map((company) => (
                  <option
                    key={String(company.company_id || company.companyId)}
                    value={String(company.company_id || company.companyId)}
                  >
                    {String(company.company_name || company.companyName)}
                  </option>
                ))}
              </select>
              <span className="label-text-alt mt-1 text-base-content/65">
                Obrigatório apenas para cliente associado conveniado.
              </span>
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                E-mail do responsável
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={oldEmail}
                name="email"
                required
                type="email"
              />
            </label>
            <button className="btn btn-primary w-full" type="submit">
              Enviar convite
            </button>
          </BackendForm>
        </div>
      </article>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">
            <LucideIcon className="h-4 w-4" name="history" />
            Últimos convites
          </h2>
          {invites.length === 0 ? (
            <p className="text-sm text-base-content/70">
              Nenhum convite registrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>E-mail</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Expira em</th>
                    <th>Usado em</th>
                    <th>Enviado por</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr
                      key={String(
                        invite.id ||
                          invite.invited_email ||
                          JSON.stringify(invite),
                      )}
                    >
                      <td>{String(invite.invited_email || "-")}</td>
                      <td>
                        <span className="badge badge-outline">
                          {String(invite.invite_type_label || "-")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${String(invite.status_badge || "badge-outline")}`}
                        >
                          {String(invite.status_label || "-")}
                        </span>
                      </td>
                      <td>{String(invite.expires_at || "-")}</td>
                      <td>{String(invite.used_at || "-")}</td>
                      <td>{String(invite.invited_by_name || "-")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
