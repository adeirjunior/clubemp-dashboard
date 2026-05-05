import { AuthShell } from "@/components/auth-shell";
import { CustomerRegisterForm } from "@/components/customer-register-form";
import { LucideIcon } from "@/components/lucide-icon";
import { readBackendSession } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await readBackendSession();
  const marketingBaseUrl = (
    process.env.MARKETING_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_MARKETING_APP_URL?.trim() ||
    "http://localhost:4321"
  ).replace(/\/+$/, "");

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <section className="relative w-full max-w-2xl rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
              <LucideIcon className="h-4 w-4" name="user-plus" />
              Cadastro unificado de cliente
            </p>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              Crie sua conta no Clubemp
            </h1>
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

          <CustomerRegisterForm
            loginUrl="/login"
            privacyPolicyUrl={`${marketingBaseUrl}/politica-de-privacidade`}
            termsUrl={`${marketingBaseUrl}/termos-de-servico`}
          />
        </section>
      </main>
    </AuthShell>
  );
}
