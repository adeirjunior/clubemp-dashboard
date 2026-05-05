import { BackendForm } from "@/components/backend-form";
import { DashboardShell } from "@/components/dashboard-shell";
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
  const oldInviteType = String(data.oldInviteType || "empreendedora");
  const oldEmail = String(data.oldEmail || "");

  return (
    <DashboardShell
      activeMenu="entrepreneur-invites"
      headerIcon="mail-plus"
      headerTitle="Convites de empresas"
    >
      <section className="grid gap-4 lg:grid-cols-[1.2fr,1.8fr]">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <LucideIcon className="h-4 w-4" name="send" />
              Enviar convite
            </h2>
            <p className="text-sm text-base-content/70">
              Escolha o tipo de empresa, informe o e-mail e o sistema envia um
              link com token único e validade de 72 horas.
            </p>
            <BackendForm
              backendPath="/central/convites/empreendedores"
              className="mt-3 space-y-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                  <input
                    className="peer sr-only"
                    defaultChecked={oldInviteType === "empreendedora"}
                    name="invite_type"
                    type="radio"
                    value="empreendedora"
                  />
                  <span className="space-y-1">
                    <span className="block font-bold">
                      Empresa Empreendedora
                    </span>
                    <span className="block text-sm text-base-content/70">
                      Fluxo com vitrine, categorias, cidades de atuação e 2
                      brindes mensais.
                    </span>
                  </span>
                </label>
                <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                  <input
                    className="peer sr-only"
                    defaultChecked={oldInviteType === "conveniada"}
                    name="invite_type"
                    type="radio"
                    value="conveniada"
                  />
                  <span className="space-y-1">
                    <span className="block font-bold">Empresa Conveniada</span>
                    <span className="block text-sm text-base-content/70">
                      Fluxo institucional sem brindes mensais nem campos de
                      marketplace.
                    </span>
                  </span>
                </label>
              </div>
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
    </DashboardShell>
  );
}
