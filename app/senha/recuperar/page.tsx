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
  const oldEmail =
    typeof query.email === "string"
      ? query.email
      : typeof session.old_email === "string"
        ? session.old_email
        : "";

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <section className="relative w-full max-w-xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
              <LucideIcon className="h-4 w-4" name="mail-search" />
              Recuperação de senha
            </p>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Receber código por e-mail
            </h1>
            <p className="text-sm text-base-content/70">
              Informe o e-mail da sua conta para enviarmos um código de
              verificação.
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
            backendPath="/auth/senha/recuperar"
            className="space-y-4"
          >
            <label className="form-control w-full">
              <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
                <LucideIcon className="h-4 w-4 text-primary" name="mail" />
                E-mail da conta
              </span>
              <input
                className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
                defaultValue={oldEmail}
                name="email"
                placeholder="voce@empresa.com"
                required
                type="email"
              />
            </label>
            <button className="btn btn-primary btn-block gap-2" type="submit">
              Enviar código
              <LucideIcon className="h-4 w-4" name="send" />
            </button>
          </BackendForm>
        </section>
      </main>
    </AuthShell>
  );
}
