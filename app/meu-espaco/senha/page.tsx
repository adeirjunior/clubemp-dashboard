import { AuthShell } from "@/components/auth-shell";
import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { readBackendSession } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await readBackendSession();

  return (
    <AuthShell>
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-8">
        <section className="w-full rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl sm:p-8">
          <p className="badge badge-warning badge-outline gap-2">
            <LucideIcon className="h-4 w-4" name="key-round" />
            Primeiro acesso da empresa
          </p>
          <h1 className="mt-4 text-3xl font-black">
            Altere sua senha para continuar
          </h1>
          <p className="mt-2 text-sm text-base-content/75">
            Por segurança, contas aprovadas precisam definir uma senha nova
            antes de acessar o painel da empresa.
          </p>
          <div className="mt-4 space-y-3">
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
            backendPath="/meu-espaco/senha"
            className="mt-5 grid gap-4"
          >
            <label className="form-control">
              <span className="label-text mb-1 font-semibold">Nova senha</span>
              <input
                className="input input-bordered w-full"
                minLength={8}
                name="password"
                required
                type="password"
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-1 font-semibold">
                Confirmar nova senha
              </span>
              <input
                className="input input-bordered w-full"
                minLength={8}
                name="password_confirmation"
                required
                type="password"
              />
            </label>
            <button className="btn btn-primary mt-2" type="submit">
              Salvar nova senha
            </button>
          </BackendForm>
        </section>
      </main>
    </AuthShell>
  );
}
