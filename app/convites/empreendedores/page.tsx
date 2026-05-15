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
    "/convites/empreendedores",
  );
  const invites = asRecordArray(data.invites);
  const partnerCompanies = asRecordArray(data.partnerCompanies);
  const oldInviteType = String(data.oldInviteType || "empresa_empreendedora");
  const oldCompanyId = String(data.oldCompanyId || "");
  const oldEmail = String(data.oldEmail || "");

  return (
    <main className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="mail-plus" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">
              Convites Empreendedor
            </h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Expanda a rede Clubemp convidando novos parceiros, empresas e
              clientes estratégicos.
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-6 lg:grid-cols-[1fr,1.35fr]">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-black text-base-content flex items-center gap-2">
            <LucideIcon name="send" className="h-5 w-5 text-primary" />
            Enviar Novo Convite
          </h2>

          <BackendForm
            backendPath="/dashboard/central/convites/empreendedores"
            className="space-y-8"
          >
            <div className="space-y-3">
              <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50 ml-1">
                Tipo de convite
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "cliente_associado",
                    "Cliente associado",
                    "Sem vínculo inicial.",
                  ],
                  [
                    "cliente_associado_conveniado",
                    "Cliente conveniado",
                    "Chamado por empresa.",
                  ],
                  [
                    "empresa_conveniada",
                    "Empresa conveniada",
                    "Fluxo institucional.",
                  ],
                  [
                    "empresa_empreendedora",
                    "Empresa empreendedora",
                    "Fluxo com vitrine.",
                  ],
                ].map(([value, label, desc]) => (
                  <label key={value} className="cursor-pointer group">
                    <input
                      className="peer sr-only"
                      defaultChecked={oldInviteType === value}
                      name="invitation_kind"
                      type="radio"
                      value={value}
                    />
                    <span className="flex flex-col h-full rounded-2xl border border-base-300 bg-base-200/30 p-4 transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-content peer-checked:shadow-lg group-hover:bg-base-200">
                      <span className="block font-bold text-xs uppercase tracking-tight">
                        {label}
                      </span>
                      <span className="block text-[10px] opacity-60 mt-1 leading-tight font-medium">
                        {desc}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider opacity-60">
                  Empresa conveniada (se aplicável)
                </span>
                <select
                  className="select select-bordered w-full font-bold"
                  defaultValue={oldCompanyId}
                  name="company_id"
                >
                  <option value="">Opcional: Vincular à empresa</option>
                  {partnerCompanies.map((company) => (
                    <option
                      key={String(company.company_id || company.companyId)}
                      value={String(company.company_id || company.companyId)}
                    >
                      {String(company.company_name || company.companyName)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider opacity-60">
                  E-mail do destinatário
                </span>
                <input
                  className="input input-bordered w-full font-bold"
                  defaultValue={oldEmail}
                  name="email"
                  required
                  type="email"
                  placeholder="exemplo@email.com"
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                className="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20"
                type="submit"
              >
                <LucideIcon name="send" />
                Disparar Convite
              </button>
            </div>
          </BackendForm>
        </article>

        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LucideIcon className="h-4 w-4 opacity-50" name="history" />
              <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">
                Últimos Envios
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            {invites.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-center italic text-base-content/40">
                <LucideIcon name="search" className="h-8 w-8 opacity-20" />
                Nenhum convite registrado ainda.
              </div>
            ) : (
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/30 text-[10px] font-black uppercase tracking-[0.15em] text-base-content/60">
                    <th className="py-4 px-6 first:pl-8">Destinatário</th>
                    <th className="py-4 px-6 text-center">Tipo / Status</th>
                    <th className="py-4 px-6 pr-8 text-right">Informações</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-medium">
                  {invites.map((invite) => (
                    <tr
                      key={String(
                        invite.id ||
                          invite.invited_email ||
                          JSON.stringify(invite),
                      )}
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6 first:pl-8">
                        <span className="font-bold text-base-content">
                          {String(invite.invited_email || "-")}
                        </span>
                        <p className="text-[10px] opacity-40 mt-0.5">
                          Enviado por: {String(invite.invited_by_name || "-")}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="badge badge-ghost badge-xs font-black uppercase tracking-tighter opacity-70">
                            {String(invite.invite_type_label || "-")}
                          </span>
                          <span
                            className={`badge ${String(invite.status_badge || "badge-outline")} badge-xs font-black uppercase tracking-tighter`}
                          >
                            {String(invite.status_label || "-")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 pr-8 text-right space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">
                          Expira: {String(invite.expires_at || "-")}
                        </p>
                        {String(invite.used_at || "") !== "" && (
                          <p className="text-[10px] font-black uppercase tracking-tighter text-success">
                            Usado: {String(invite.used_at)}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
