import { AuthShell } from "@/components/auth-shell";
import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { readBackendSession } from "@/lib/backend";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const session = await readBackendSession();
  const query = await searchParams;
  const email = typeof query.email === "string" ? query.email : "";

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <section className="relative w-full max-w-xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
              <LucideIcon className="h-4 w-4" name="shield-check" />
              Redefinição de senha
            </p>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Crie uma nova senha
            </h1>
            <p className="text-sm text-base-content/70">
              Digite o código enviado ao seu e-mail e escolha uma nova senha.
            </p>
          </div>

          <div className="mb-4 space-y-3">
            {session.flash_error ? (
              <div className="alert alert-error">
                <span>{session.flash_error}</span>
              </div>
            ) : null}
            {session.flash_success ? (
              <div className="alert alert-success">
                <span>{session.flash_success}</span>
              </div>
            ) : null}
          </div>

          <BackendForm
            backendPath="/auth/senha/redefinir"
            className="space-y-4"
          >
            <label className="form-control w-full">
              <span className="label-text mb-2 font-semibold">
                E-mail da conta
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={email}
                name="email"
                required
                type="email"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-2 font-semibold">
                Código recebido
              </span>
              <input
                className="input input-bordered w-full"
                name="code"
                required
                type="text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-2 font-semibold">Nova senha</span>
              <input
                className="input input-bordered w-full"
                name="password"
                required
                type="password"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-2 font-semibold">
                Confirmar nova senha
              </span>
              <input
                className="input input-bordered w-full"
                name="password_confirmation"
                required
                type="password"
              />
            </label>
            <button className="btn btn-primary btn-block gap-2" type="submit">
              Salvar nova senha
              <LucideIcon className="h-4 w-4" name="arrow-right" />
            </button>
          </BackendForm>
        </section>
      </main>
    </AuthShell>
  );
}
