import { AuthShell } from "@/components/auth-shell";
import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { boolish, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { token } = await params;
  const data = await loadDashboardData(
    `/auth/convite/empreendedor/${token}`,
    await searchParams,
    `/convite/empreendedor/${token}`,
  );

  if (boolish(data.inviteInvalid)) {
    return (
      <AuthShell>
        <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
          <section className="relative w-full max-w-xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
            <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
              <LucideIcon className="h-4 w-4" name="mail-search" />
              Convite indisponível
            </p>
            <h1 className="mt-4 text-2xl font-bold">
              {String(data.inviteInvalidTitle || "Convite indisponível")}
            </h1>
            <p className="mt-2 text-sm text-base-content/70">
              {String(
                data.inviteInvalidMessage ||
                  "Este convite não pode mais ser usado.",
              )}
            </p>
            <a className="btn btn-primary mt-6" href="/login">
              Ir para o login
            </a>
          </section>
        </main>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <section className="relative w-full max-w-4xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
            <LucideIcon className="h-4 w-4" name="mail-plus" />
            Cadastro por convite
          </p>
          <h1 className="mt-4 text-2xl font-bold">
            Cadastro de {String(data.inviteTypeLabel || "empresa")} por convite
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Válido até {String(data.expiresAt || "-")} para{" "}
            {String(data.inviteEmail || "-")}.
          </p>
          <BackendForm
            backendPath={`/convite/empreendedor/${token}`}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            {[
              ["legal_name", "Razão social", false],
              ["trade_name", "Nome fantasia", true],
              ["document_number", "Documento", false],
              ["entrepreneur_name", "Nome do responsável", true],
              ["phone", "Telefone", false],
              ["website", "Website", false],
            ].map(([name, label, required]) => (
              <label key={String(name)} className="form-control w-full">
                <span className="label-text mb-1 font-semibold">
                  {String(label)}
                </span>
                <input
                  className="input input-bordered w-full"
                  name={String(name)}
                  required={Boolean(required)}
                  type="text"
                />
              </label>
            ))}
            {!boolish(data.hasExistingAccount) ? (
              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold">Senha</span>
                <input
                  className="input input-bordered w-full"
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
              </label>
            ) : null}
            <label className="form-control md:col-span-2">
              <span className="label-text mb-1 font-semibold">Descrição</span>
              <textarea
                className="textarea textarea-bordered min-h-28"
                name="description"
              />
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3 md:col-span-2">
              <input
                className="checkbox checkbox-primary mt-0.5"
                name="privacy_consent"
                type="checkbox"
                value="1"
              />
              <span className="text-sm text-base-content/80">
                Li e concordo com a política de privacidade.
              </span>
            </label>
            <button className="btn btn-primary md:col-span-2" type="submit">
              Finalizar cadastro da empresa
            </button>
          </BackendForm>
        </section>
      </main>
    </AuthShell>
  );
}
