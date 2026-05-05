import { AuthShell } from "@/components/auth-shell";
import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { token } = await params;
  const data = await loadDashboardData(
    `/auth/convite/empresa/${token}`,
    await searchParams,
    `/convite/empresa/${token}`,
  );

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <section className="relative w-full max-w-xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
            <LucideIcon className="h-4 w-4" name="mail-plus" />
            Convite de empresa
          </p>
          <h1 className="mt-4 text-2xl font-bold text-base-content sm:text-3xl">
            Aceitar convite da empresa
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Empresa: {String(data.companyName || "-")} | E-mail:{" "}
            {String(data.inviteEmail || "-")}
          </p>
          <BackendForm
            backendPath={`/convite/empresa/${token}`}
            className="mt-6 space-y-4"
          >
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Nome completo
              </span>
              <input
                className="input input-bordered w-full"
                name="name"
                required
                type="text"
              />
            </label>
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
            <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3">
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
            <button className="btn btn-primary w-full" type="submit">
              Criar acesso
            </button>
          </BackendForm>
        </section>
      </main>
    </AuthShell>
  );
}
