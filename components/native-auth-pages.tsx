import { readBackendSession } from "@/lib/backend";
import { frontendPathFromBackendPath } from "@/lib/route-map";
import { AuthShell } from "./auth-shell";
import { BackendForm } from "./backend-form";
import { CustomerRegisterForm } from "./customer-register-form";
import { LucideIcon } from "./lucide-icon";

function FlashMessages({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  return (
    <>
      {error ? (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      ) : null}
      {success ? (
        <div className="alert alert-success">
          <span>{success}</span>
        </div>
      ) : null}
    </>
  );
}

function AuthCard({
  badge,
  badgeIcon,
  children,
  description,
  maxWidth = "max-w-xl",
  title,
}: {
  badge: string;
  badgeIcon: string;
  children: React.ReactNode;
  description?: string;
  maxWidth?: string;
  title: string;
}) {
  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <section
          className={`relative w-full ${maxWidth} rounded-3xl border border-primary/30 bg-base-100/95 p-6 shadow-2xl backdrop-blur sm:p-8`}
        >
          <div className="mb-6 space-y-2">
            <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
              <LucideIcon className="h-4 w-4" name={badgeIcon} />
              {badge}
            </p>
            <h1 className="text-2xl font-bold text-base-content sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="text-sm text-base-content/70">{description}</p>
            ) : null}
          </div>
          {children}
        </section>
      </main>
    </AuthShell>
  );
}

export async function LoginPage() {
  const session = await readBackendSession();
  const oldEmail =
    typeof session.old_email === "string" ? session.old_email : "";
  const error =
    typeof session.flash_error === "string" ? session.flash_error : "";
  const success =
    typeof session.flash_success === "string" ? session.flash_success : "";
  const hasAuthenticatedUser = Boolean(session.auth_user);
  const authRedirect =
    typeof session.dashboard_contexts?.[0]?.path === "string"
      ? frontendPathFromBackendPath(session.dashboard_contexts[0].path)
      : "/central";

  return (
    <AuthShell>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <div className="relative flex w-full max-w-6xl flex-col-reverse gap-6 rounded-3xl border border-primary/30 bg-base-100/95 p-4 shadow-2xl backdrop-blur md:p-8 lg:flex-row">
          <section className="relative rounded-2xl border border-primary/25 bg-base-200 p-7 sm:p-8">
            <div className="relative hidden h-full flex-col justify-between gap-8 md:flex">
              <div className="space-y-4">
                <p className="badge badge-lg badge-outline gap-2 border-primary/60 text-primary">
                  <LucideIcon className="h-4 w-4" name="waypoints" />
                  Login unificado Clubemp
                </p>
                <h1 className="max-w-lg text-3xl font-black leading-tight text-base-content sm:text-4xl">
                  Acesso ao Ecossistema Clubemp
                </h1>
                <p className="max-w-xl text-sm text-base-content/75 sm:text-base">
                  Depois do login, o sistema mostra automaticamente os modos de
                  visualização, empresas e áreas que o seu usuário pode acessar.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-base-content/85">
                {[
                  [
                    "user-round-cog",
                    "O mesmo login serve para todos os perfis vinculados ao seu usuário",
                  ],
                  [
                    "building-2",
                    "Se houver acesso a mais de uma empresa ou contexto, você poderá alternar",
                  ],
                  [
                    "layout-dashboard",
                    "A área exibida depende das permissões liberadas para a sua conta",
                  ],
                ].map(([icon, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-xl border border-primary/20 bg-base-100/70 px-3 py-2"
                  >
                    <LucideIcon className="h-4 w-4 text-primary" name={icon} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-2xl bg-base-100 p-6 sm:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-bold text-base-content">
                Entrar na plataforma
              </h2>
              <p className="text-sm text-base-content/70">
                Este é o acesso unificado do Clubemp. Use seu e-mail e senha.
              </p>
            </div>

            <div className="mb-4 space-y-3">
              <FlashMessages error={error} success={success} />
            </div>

            {hasAuthenticatedUser ? (
              <div className="mb-4 rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-base-content">
                Sessão ativa detectada.{" "}
                <a
                  className="link link-primary font-semibold"
                  href={authRedirect}
                >
                  Acessar área
                </a>
              </div>
            ) : null}

            <BackendForm
              backendPath="/auth/login"
              className="flex flex-1 flex-col gap-4"
            >
              <label className="form-control w-full">
                <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
                  <LucideIcon className="h-4 w-4 text-primary" name="mail" />
                  E-mail
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
              <label className="form-control w-full">
                <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
                  <LucideIcon
                    className="h-4 w-4 text-primary"
                    name="lock-keyhole"
                  />
                  Senha
                </span>
                <input
                  className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
                  name="password"
                  placeholder="Digite sua senha"
                  required
                  type="password"
                />
              </label>
              <p className="text-right text-xs">
                <a className="link link-primary" href="/senha/recuperar">
                  Esqueci minha senha
                </a>
              </p>
              <button
                className="btn btn-primary btn-block mt-2 gap-2"
                type="submit"
              >
                Entrar
                <LucideIcon className="h-4 w-4" name="arrow-right" />
              </button>
            </BackendForm>

            <p className="mt-5 text-center text-sm text-base-content/75">
              Ainda não tem conta?{" "}
              <a
                className="link link-primary font-semibold"
                href="/clientes/cadastro"
              >
                Cadastrar cliente
              </a>
            </p>
          </section>
        </div>
      </main>
    </AuthShell>
  );
}

export async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await readBackendSession();
  const query = (await searchParams) ?? {};
  const oldEmail =
    typeof query.email === "string"
      ? query.email
      : typeof session.old_email === "string"
        ? session.old_email
        : "";

  return (
    <AuthCard
      badge="Recuperação de senha"
      badgeIcon="mail-search"
      title="Receber código por e-mail"
      description="Informe o e-mail da sua conta para enviarmos um código de verificação."
    >
      <div className="mb-4 space-y-3">
        <FlashMessages
          error={session.flash_error}
          success={session.flash_success}
        />
      </div>
      <BackendForm backendPath="/auth/senha/recuperar" className="space-y-4">
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
    </AuthCard>
  );
}

export async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await readBackendSession();
  const query = (await searchParams) ?? {};
  const email = typeof query.email === "string" ? query.email : "";

  return (
    <AuthCard
      badge="Redefinição de senha"
      badgeIcon="shield-check"
      title="Crie uma nova senha"
      description="Digite o código enviado ao seu e-mail e escolha uma nova senha."
    >
      <div className="mb-4 space-y-3">
        <FlashMessages
          error={session.flash_error}
          success={session.flash_success}
        />
      </div>
      <BackendForm backendPath="/auth/senha/redefinir" className="space-y-4">
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">E-mail da conta</span>
          <input
            className="input input-bordered w-full"
            defaultValue={email}
            name="email"
            required
            type="email"
          />
        </label>
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Código recebido</span>
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
    </AuthCard>
  );
}

export async function CustomerRegisterPage() {
  const session = await readBackendSession();
  const marketingBaseUrl = (
    process.env.MARKETING_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_MARKETING_APP_URL?.trim() ||
    "http://localhost:4321"
  ).replace(/\/+$/, "");
  const privacyPolicyUrl = `${marketingBaseUrl}/politica-de-privacidade`;
  const termsUrl = `${marketingBaseUrl}/termos-de-servico`;

  return (
    <AuthCard
      badge="Cadastro unificado de cliente"
      badgeIcon="user-plus"
      title="Crie sua conta no Clubemp"
      maxWidth="max-w-2xl"
    >
      <div className="mb-4 space-y-3">
        <FlashMessages
          error={session.flash_error}
          success={session.flash_success}
        />
      </div>
      <CustomerRegisterForm
        loginUrl="/login"
        privacyPolicyUrl={privacyPolicyUrl}
        termsUrl={termsUrl}
      />
    </AuthCard>
  );
}
