import Link from "next/link";
import { readBackendSession } from "@/lib/backend";
import { AuthShell } from "./auth-shell";
import { BackendForm } from "./backend-form";
import {
  companyNavItems,
  customerNavItems,
  DashboardShell,
} from "./dashboard-shell";
import { LucideIcon } from "./lucide-icon";
import { PaymentScanner } from "./payment-scanner";
import { StripePaymentForm } from "./stripe-payment-form";

type RendererProps = {
  currentPath: string;
  data: Record<string, unknown>;
  query: Record<string, string | string[] | undefined>;
  routePath: string;
  view: string;
};

function flash(data: Record<string, unknown>) {
  const error = typeof data.flashError === "string" ? data.flashError : "";
  const success =
    typeof data.flashSuccess === "string" ? data.flashSuccess : "";

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

function authCard({
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

function loginView(data: Record<string, unknown>) {
  const oldEmail = typeof data.oldEmail === "string" ? data.oldEmail : "";
  const hasAuthenticatedUser = Boolean(data.hasAuthenticatedUser);
  const authRedirect =
    typeof data.authRedirect === "string" ? data.authRedirect : "/central";

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

            <div className="mb-4 space-y-3">{flash(data)}</div>

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

function forgotPasswordView(data: Record<string, unknown>) {
  const oldEmail = typeof data.oldEmail === "string" ? data.oldEmail : "";
  return authCard({
    badge: "Recuperação de senha",
    badgeIcon: "mail-search",
    title: "Receber código por e-mail",
    description:
      "Informe o e-mail da sua conta para enviarmos um código de verificação.",
    children: (
      <>
        <div className="mb-4 space-y-3">{flash(data)}</div>
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
      </>
    ),
  });
}

function resetPasswordView(data: Record<string, unknown>) {
  return authCard({
    badge: "Redefinição de senha",
    badgeIcon: "shield-check",
    title: "Crie uma nova senha",
    description:
      "Digite o código enviado ao seu e-mail e escolha uma nova senha.",
    children: (
      <>
        <div className="mb-4 space-y-3">{flash(data)}</div>
        <BackendForm backendPath="/auth/senha/redefinir" className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">
              E-mail da conta
            </span>
            <input
              className="input input-bordered w-full"
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
      </>
    ),
  });
}

function customerRegisterView(data: Record<string, unknown>) {
  return authCard({
    badge: "Cadastro unificado de cliente",
    badgeIcon: "user-plus",
    title: "Crie sua conta no Clubemp",
    maxWidth: "max-w-2xl",
    children: (
      <>
        <div className="mb-4 space-y-3">{flash(data)}</div>
        <BackendForm
          backendPath="/auth/clientes/cadastro"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">Nome completo</span>
            <input
              className="input input-bordered w-full"
              name="name"
              required
              type="text"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">E-mail</span>
            <input
              className="input input-bordered w-full"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">Telefone</span>
            <input
              className="input input-bordered w-full"
              name="phone"
              type="text"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">Senha</span>
            <input
              className="input input-bordered w-full"
              name="password"
              required
              type="password"
            />
          </label>
          <label className="form-control w-full lg:col-span-2">
            <span className="label-text mb-2 font-semibold">
              Confirmar senha
            </span>
            <input
              className="input input-bordered w-full"
              name="password_confirmation"
              required
              type="password"
            />
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3 lg:col-span-2">
            <input
              className="checkbox checkbox-primary mt-0.5"
              name="privacy_consent"
              type="checkbox"
              value="1"
            />
            <span className="text-sm text-base-content/80">
              Li e concordo com a política de privacidade e com o tratamento dos
              dados informados.
            </span>
          </label>
          <button
            className="btn btn-primary btn-block mt-2 gap-2 lg:col-span-2"
            type="submit"
          >
            Criar conta
            <LucideIcon className="h-4 w-4" name="arrow-right" />
          </button>
        </BackendForm>
      </>
    ),
  });
}

function centralOverview(data: Record<string, unknown>) {
  const financeMetrics = (data.financeMetrics as Record<string, string>) || {};
  const cards = [
    [
      "Solicitações",
      String(data.requestsCount ?? 0),
      "Gerenciar aprovações",
      "/central/solicitacoes",
    ],
    [
      "Repasses",
      String(data.pendingPayoutsCount ?? 0),
      "Executar e conferir",
      "/central/repasses",
    ],
    [
      "Compras",
      financeMetrics.sales_count || "0",
      "Histórico da plataforma",
      "/central/compras",
    ],
    [
      "Empresas",
      String(data.companiesCount ?? 0),
      "Listar e acessar páginas públicas",
      "/central/empresas",
    ],
    [
      "Clientes",
      String(data.customersCount ?? 0),
      "Usuários, cartões e vínculos",
      "/central/clientes",
    ],
    ["Saúde", "Sistema", "Métricas de rota e erros", "/central/saude"],
    [
      "Notícias",
      String(data.blogPostsCount ?? 0),
      "Listagem, criação e edição editorial",
      "/central/noticias",
    ],
    [
      "Eventos",
      String(data.eventsCount ?? 0),
      "Agenda, inscrições e publicação",
      "/central/eventos",
    ],
    [
      "Cursos",
      String(data.coursesCount ?? 0),
      "Catálogo, acesso e monetização",
      "/central/cursos",
    ],
    [
      "Sorteios",
      String(data.giveawaysCount ?? 0),
      "Campanhas, cupons e vencedores",
      "/central/sorteios",
    ],
    [
      "Convites",
      "Empreendedores",
      "Enviar convite por e-mail",
      "/central/convites/empreendedores",
    ],
  ];

  return (
    <DashboardShell
      activeMenu="overview"
      headerIcon="layout-dashboard"
      headerTitle="Visão geral"
    >
      <section className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          [
            "Vendas totais",
            financeMetrics.sales_total || "-",
            `${financeMetrics.sales_count || 0} vendas registradas`,
            "shopping-cart",
          ],
          [
            "Comissões geradas",
            financeMetrics.commissions_total || "-",
            `${financeMetrics.commissions_count || 0} lançamentos`,
            "percent",
          ],
          [
            "Repasses pendentes",
            financeMetrics.pending_payouts_total || "-",
            `${data.pendingPayoutsCount || 0} pendentes`,
            "wallet",
          ],
        ].map(([label, value, help, icon]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <LucideIcon className="h-4 w-4" name={icon} />
                {value}
              </h2>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, value, help, href]) => (
          <a
            key={href}
            className="card border border-base-300 bg-base-100 shadow-sm hover:border-primary"
            href={href}
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{title}</p>
              <p className="text-lg font-bold">{value}</p>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </a>
        ))}
      </section>
    </DashboardShell>
  );
}

function simpleCrudTable({
  activeMenu,
  columns,
  countLabel,
  description,
  emptyMessage,
  headerBadge,
  headerIcon,
  headerTitle,
  rows,
  title,
}: {
  activeMenu: string;
  columns: string[];
  countLabel: string;
  description: string;
  emptyMessage: string;
  headerBadge?: string;
  headerIcon: string;
  headerTitle: string;
  rows: Array<Array<string>>;
  title: string;
}) {
  return (
    <DashboardShell
      activeMenu={activeMenu}
      headerBadge={headerBadge}
      headerIcon={headerIcon}
      headerTitle={headerTitle}
    >
      <section className="mt-4 space-y-4">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-base-content/70">{description}</p>
              </div>
              <span className="badge badge-outline">{countLabel}</span>
            </div>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        className="py-8 text-center text-sm text-base-content/65"
                        colSpan={columns.length}
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={`${title}-${row.join("|")}`}>
                        {row.map((cell) => (
                          <td key={`${title}-${row.join("|")}-${cell}`}>
                            {cell || "-"}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

type ModuleFormField = {
  help?: string;
  label: string;
  name?: string;
  options?: Record<string, string>;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  span?: "full";
  type?:
    | "checkbox"
    | "datetime-local"
    | "file"
    | "number"
    | "select"
    | "text"
    | "textarea"
    | "url";
  value?: string;
};

function moduleFormPage({
  action,
  backHref,
  description,
  fields,
  headerIcon,
  headerTitle,
  hiddenFields,
  submitLabel,
  title,
}: {
  action: string;
  backHref: string;
  description: string;
  fields: ModuleFormField[];
  headerIcon: string;
  headerTitle: string;
  hiddenFields?: Record<string, string>;
  submitLabel: string;
  title: string;
}) {
  return (
    <DashboardShell headerIcon={headerIcon} headerTitle={headerTitle}>
      <section className="mt-4 space-y-4">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-base-content/70">{description}</p>
              </div>
              <a className="btn btn-sm btn-outline" href={backHref}>
                Voltar
              </a>
            </div>
          </div>
        </article>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <BackendForm
              backendPath={action}
              className="grid gap-4 md:grid-cols-2"
            >
              {hiddenFields
                ? Object.entries(hiddenFields).map(([key, value]) => (
                    <input key={key} name={key} type="hidden" value={value} />
                  ))
                : null}
              {fields.map((field) => {
                const type = field.type || "text";
                const className =
                  field.span === "full"
                    ? "form-control md:col-span-2"
                    : "form-control";
                return (
                  // biome-ignore lint/a11y/noLabelWithoutControl: The field control is conditionally rendered inside this wrapper.
                  <label
                    key={`${field.name || field.label}-${field.label}`}
                    className={className}
                  >
                    <span className="label-text mb-1 font-semibold">
                      {field.label}
                    </span>
                    {type === "textarea" ? (
                      <textarea
                        className="textarea textarea-bordered min-h-24 w-full"
                        defaultValue={field.value || ""}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={field.rows || 5}
                      />
                    ) : null}
                    {type === "select" ? (
                      <select
                        className="select select-bordered w-full"
                        defaultValue={field.value || ""}
                        name={field.name}
                        required={field.required}
                      >
                        {field.options
                          ? Object.entries(field.options).map(
                              ([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ),
                            )
                          : null}
                      </select>
                    ) : null}
                    {type === "checkbox" ? (
                      <>
                        <input name={field.name} type="hidden" value="0" />
                        <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 px-4 py-3">
                          <input
                            className="checkbox checkbox-primary"
                            defaultChecked={field.value === "1"}
                            name={field.name}
                            type="checkbox"
                            value="1"
                          />
                          <span className="label-text">
                            {field.placeholder || field.label}
                          </span>
                        </label>
                      </>
                    ) : null}
                    {type === "file" ? (
                      <input
                        className="file-input file-input-bordered w-full"
                        name={field.name}
                        type="file"
                      />
                    ) : null}
                    {!["textarea", "select", "checkbox", "file"].includes(
                      type,
                    ) ? (
                      <input
                        className="input input-bordered w-full"
                        defaultValue={field.value || ""}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        type={type}
                      />
                    ) : null}
                    {field.help ? (
                      <span className="label-text-alt mt-1 text-base-content/65">
                        {field.help}
                      </span>
                    ) : null}
                  </label>
                );
              })}
              <button className="btn btn-primary md:col-span-2" type="submit">
                {submitLabel}
              </button>
            </BackendForm>
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

function moduleShowPage({
  backHref,
  description,
  editHref,
  headerIcon,
  headerTitle,
  items,
  meta,
  title,
}: {
  backHref: string;
  description: string;
  editHref?: string;
  headerIcon: string;
  headerTitle: string;
  items: Array<{ label: string; span?: "full"; value: string }>;
  meta: Array<{ label: string; value: string }>;
  title: string;
}) {
  return (
    <DashboardShell headerIcon={headerIcon} headerTitle={headerTitle}>
      <section className="mt-4 space-y-4">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-base-content/70">{description}</p>
              </div>
              <div className="flex gap-2">
                <a className="btn btn-sm btn-outline" href={backHref}>
                  Voltar
                </a>
                {editHref ? (
                  <a className="btn btn-sm btn-primary" href={editHref}>
                    Editar
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </article>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {meta.map((item) => (
            <article
              key={`${item.label}-${item.value}`}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {item.label}
                </p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            </article>
          ))}
        </section>
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className={item.span === "full" ? "md:col-span-2" : ""}
                >
                  <p className="text-xs uppercase tracking-wide text-base-content/55">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-base-content/80">
                    {item.value || "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </DashboardShell>
  );
}

function asRecord(value: unknown) {
  return (value as Record<string, unknown>) || {};
}

function asRecordArray(value: unknown) {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function boolish(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function genericUnsupportedView(view: string, data: Record<string, unknown>) {
  return (
    <DashboardShell
      headerIcon="layout-dashboard"
      headerTitle="Migração em andamento"
    >
      <article className="card mt-4 border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-6">
          <h2 className="text-xl font-bold">View ainda não portada</h2>
          <p className="text-sm text-base-content/70">
            A rota já consulta corretamente o backend, mas a renderização React
            desta view ainda não foi concluída.
          </p>
          <p className="mt-3 text-xs uppercase tracking-wide text-base-content/55">
            View backend
          </p>
          <p className="font-mono text-sm">{view}</p>
          <details className="mt-4 rounded-2xl border border-base-300 bg-base-200/40 p-4">
            <summary className="cursor-pointer font-semibold">
              Inspecionar payload
            </summary>
            <pre className="mt-3 overflow-x-auto text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      </article>
    </DashboardShell>
  );
}

export async function LegacyViewRenderer({
  currentPath,
  data,
  routePath,
  view,
}: RendererProps) {
  const session = await readBackendSession();
  const flashData = {
    ...data,
    flashError: session.flash_error || data.flashError,
    flashSuccess: session.flash_success || data.flashSuccess,
  };

  if (view === "pages.auth.login") {
    return loginView(flashData);
  }

  if (view === "pages.auth.forgot-password") {
    return forgotPasswordView(flashData);
  }

  if (view === "pages.auth.reset-password") {
    return resetPasswordView(flashData);
  }

  if (view === "pages.auth.customer-register") {
    return customerRegisterView(flashData);
  }

  if (view === "pages.central.index") {
    return centralOverview(flashData);
  }

  if (view === "pages.central.empresas.index") {
    const companies = Array.isArray(data.companies) ? data.companies : [];
    return simpleCrudTable({
      activeMenu: "companies",
      columns: ["Empresa", "Tipo", "Status", "Contato", "Cidade"],
      countLabel: `${data.companiesCount || companies.length} empresas`,
      description:
        "Consulte todas as empresas, veja se são empreendedoras, conveniadas ou ambas.",
      emptyMessage: "Nenhuma empresa encontrada.",
      headerBadge: "Administração",
      headerIcon: "store",
      headerTitle: "Empresas",
      rows: companies.map((company) => {
        const item = company as Record<string, unknown>;
        return [
          String(item.name || "-"),
          Array.isArray(item.kinds) ? item.kinds.join(", ") : "-",
          String(item.visibility_label || "-"),
          String(item.contact_email || "-"),
          [item.city, item.state].filter(Boolean).join(" - ") || "-",
        ];
      }),
      title: "Empresas cadastradas",
    });
  }

  if (view === "pages.central.clientes.index") {
    const customers = Array.isArray(data.customers) ? data.customers : [];
    return simpleCrudTable({
      activeMenu: "customers",
      columns: ["Cliente", "Tipo", "Status", "Cartão", "Vínculos"],
      countLabel: `${data.customersCount || customers.length} clientes`,
      description:
        "Consulte todos os clientes, seus cartões, status e vínculos.",
      emptyMessage: "Nenhum cliente encontrado.",
      headerBadge: "Administração",
      headerIcon: "users-round",
      headerTitle: "Clientes",
      rows: customers.map((customer) => {
        const item = customer as Record<string, unknown>;
        return [
          String(item.name || "-"),
          String(item.customer_type_label || "-"),
          String(item.status_label || "-"),
          String(item.card_code || "-"),
          String(item.linked_companies || "Sem vínculo"),
        ];
      }),
      title: "Usuários e clientes",
    });
  }

  if (view === "pages.central.privacidade.index") {
    const requests = Array.isArray(data.requests) ? data.requests : [];
    return simpleCrudTable({
      activeMenu: "privacy",
      columns: ["Titular", "Tipo", "Status", "Solicitado em"],
      countLabel: `${data.requestsCount || requests.length} solicitações`,
      description:
        "Consulte e trate pedidos de acesso, correção, eliminação e portabilidade.",
      emptyMessage: "Nenhuma solicitação LGPD encontrada.",
      headerBadge: "Administração",
      headerIcon: "shield-check",
      headerTitle: "Solicitações LGPD",
      rows: requests.map((request) => {
        const item = request as Record<string, unknown>;
        return [
          String(item.full_name || "-"),
          String(item.request_type_label || "-"),
          String(item.status_label || "-"),
          String(item.created_at || "-"),
        ];
      }),
      title: "Canal de direitos do titular",
    });
  }

  if (view === "pages.central.cidades.index") {
    const cities = Array.isArray(data.cities) ? data.cities : [];
    return simpleCrudTable({
      activeMenu: "cities",
      columns: ["Cidade", "UF", "Slug", "Empresas vinculadas", "Atualizado em"],
      countLabel: `${cities.length} cidades`,
      description:
        "Cadastre e organize os municípios usados por empresas, convites e filtros.",
      emptyMessage: "Nenhuma cidade encontrada.",
      headerIcon: "map-pin",
      headerTitle: "Cidades",
      rows: cities.map((city) => {
        const item = city as Record<string, unknown>;
        return [
          String(item.nome || "-"),
          String(item.estado || "-"),
          String(item.slug || "-"),
          String(item.linked_companies || "0"),
          String(item.updated_at || "-"),
        ];
      }),
      title: "Cidades disponíveis no sistema",
    });
  }

  if (view === "pages.central.categorias.index") {
    const categories = Array.isArray(data.categories) ? data.categories : [];
    return simpleCrudTable({
      activeMenu: "categories",
      columns: [
        "Nome",
        "Slug",
        "Status",
        "Comissão CAC",
        "Vínculos",
        "Atualizado em",
      ],
      countLabel: `${categories.length} categorias`,
      description:
        "Gerencie categorias para empresas, conteúdo editorial e organização operacional.",
      emptyMessage: "Nenhuma categoria encontrada.",
      headerBadge: "Módulo CRUD",
      headerIcon: "tag",
      headerTitle: "Categorias",
      rows: categories.map((category) => {
        const item = category as Record<string, unknown>;
        return [
          String(item.name || "-"),
          String(item.slug || "-"),
          String(item.status_label || "-"),
          String(item.cac_commission_label || "Padrão do sistema"),
          String(item.linked_companies || "0"),
          String(item.updated_at || "-"),
        ];
      }),
      title: "Categorias da plataforma",
    });
  }

  if (view === "pages.central.cidades.novo") {
    const city = (data.city as Record<string, unknown>) || {};
    return moduleFormPage({
      action: "/dashboard/central/cidades",
      backHref: "/central/cidades",
      description:
        "Inclua um novo município para uso nos filtros, empresas e áreas de atuação.",
      fields: [
        {
          label: "Nome da cidade",
          name: "nome",
          placeholder: "Ex: Ariquemes",
          required: true,
          value: String(city.nome || ""),
        },
        {
          label: "UF",
          name: "estado",
          placeholder: "RO",
          required: true,
          value: String(city.estado || ""),
        },
        {
          help: "Gerado a partir do nome para uso visual.",
          label: "Slug previsto",
          value: String(city.slug || ""),
        },
        { label: "Imagem", name: "imagem_upload", type: "file" },
      ],
      headerIcon: "plus",
      headerTitle: "Nova cidade",
      submitLabel: "Salvar cidade",
      title: String(data.cityFormTitle || "Cadastrar cidade"),
    });
  }

  if (view === "pages.central.cidades.editar") {
    const city = (data.city as Record<string, unknown>) || {};
    return moduleFormPage({
      action: `/dashboard/central/cidades/${String(data.cityId || 0)}/atualizar`,
      backHref: "/central/cidades",
      description:
        "Ajuste nomenclatura, UF e configurações operacionais da cidade.",
      fields: [
        {
          label: "Nome da cidade",
          name: "nome",
          required: true,
          value: String(city.nome || ""),
        },
        {
          label: "UF",
          name: "estado",
          required: true,
          value: String(city.estado || ""),
        },
        { label: "Slug previsto", value: String(city.slug || "") },
        {
          help: city.imagem
            ? `Atual: ${String(city.imagem)}`
            : "Nenhuma imagem cadastrada.",
          label: "Substituir imagem",
          name: "imagem_upload",
          type: "file",
        },
      ],
      headerIcon: "pencil",
      headerTitle: "Editar cidade",
      hiddenFields: { imagem_atual: String(city.imagem || "") },
      submitLabel: "Salvar alterações",
      title: String(data.cityFormTitle || "Editar cidade"),
    });
  }

  if (view === "pages.central.cidades.ver") {
    const city = (data.city as Record<string, unknown>) || {};
    return moduleShowPage({
      backHref: "/central/cidades",
      description:
        "Resumo operacional da cidade e seus vínculos no ecossistema.",
      editHref: `/central/cidades/editar?id=${String(city.id || 0)}`,
      headerIcon: "eye",
      headerTitle: "Ver cidade",
      items: [
        { label: "Nome", value: String(city.nome || "-") },
        { label: "Imagem", value: String(city.imagem || "-") },
        {
          label: "Criada em",
          span: "full",
          value: String(city.created_at || "-"),
        },
      ],
      meta: [
        { label: "UF", value: String(city.estado || "-") },
        { label: "Slug", value: String(city.slug || "-") },
        { label: "Empresas", value: String(city.linked_companies || "0") },
        { label: "Atualizado em", value: String(city.updated_at || "-") },
      ],
      title: `Cidade: ${String(city.nome || "-")}`,
    });
  }

  if (
    view === "pages.central.categorias.novo" ||
    view === "pages.central.categorias.editar"
  ) {
    const category = (data.category as Record<string, unknown>) || {};
    const isEdit = view.endsWith("editar");
    return moduleFormPage({
      action: isEdit
        ? `/dashboard/central/categorias/${String(data.categoryId || 0)}/atualizar`
        : "/dashboard/central/categorias",
      backHref: "/central/categorias",
      description: isEdit
        ? "Atualize nome e comunicação visual da categoria selecionada."
        : "Estruture uma nova categoria para uso em empresas, TV Clubemp ou fluxos internos.",
      fields: [
        {
          label: "Nome",
          name: "name",
          required: true,
          value: String(category.name || ""),
        },
        { label: "Slug previsto", value: String(category.slug || "") },
        {
          label: "Ícone",
          name: "icon",
          placeholder: "Ex: badge-percent",
          value: String(category.icon || ""),
        },
        {
          label: "Status",
          name: "status",
          options: { active: "Ativa", inactive: "Inativa" },
          type: "select",
          value: String(category.status || "active"),
        },
        {
          help: isEdit
            ? "Use 1,8 para consórcios; 2,0 para carros/imóveis; 4,99 para comércios e serviços."
            : "Valores sugeridos: 1,8; 2,0; 4,99; 10; 15; 20; 30.",
          label: "Comissão CAC (%)",
          name: "cac_commission_percent",
          value: String(category.cac_commission_percent || ""),
        },
        {
          label: "Descrição curta",
          name: "description",
          span: "full",
          type: "textarea",
          value: String(category.description || ""),
        },
        {
          help:
            isEdit && category.image
              ? `Atual: ${String(category.image)}`
              : undefined,
          label: isEdit ? "Substituir imagem" : "Imagem",
          name: "image_upload",
          span: "full",
          type: "file",
        },
      ],
      headerIcon: isEdit ? "pencil" : "plus",
      headerTitle: isEdit ? "Editar categoria" : "Nova categoria",
      hiddenFields: isEdit
        ? { image_atual: String(category.image || "") }
        : undefined,
      submitLabel: isEdit ? "Salvar alterações" : "Salvar categoria",
      title: String(
        data.categoryFormTitle ||
          (isEdit ? "Editar categoria" : "Cadastrar categoria"),
      ),
    });
  }

  if (view === "pages.central.categorias.ver") {
    const category = (data.category as Record<string, unknown>) || {};
    return moduleShowPage({
      backHref: "/central/categorias",
      description:
        "Visualização consolidada da categoria e seus usos principais.",
      editHref: `/central/categorias/editar?id=${String(category.id || 0)}`,
      headerIcon: "eye",
      headerTitle: "Ver categoria",
      items: [
        { label: "Nome", value: String(category.name || "-") },
        { label: "Ícone", value: String(category.icon || "-") },
        {
          label: "Comissão CAC",
          value: String(category.cac_commission_label || "Padrão do sistema"),
        },
        {
          label: "Descrição",
          span: "full",
          value: String(category.description || "-"),
        },
      ],
      meta: [
        { label: "Status", value: String(category.status_label || "-") },
        { label: "Slug", value: String(category.slug || "-") },
        { label: "Criada em", value: String(category.created_at || "-") },
        { label: "Vínculos", value: String(category.linked_companies || "0") },
      ],
      title: `Categoria: ${String(category.name || "-")}`,
    });
  }

  const eventLikeViews = {
    "pages.central.eventos.index": {
      action: "eventos",
      columns: ["Nome", "Formato", "Local", "Status", "Início"],
      createHref: "/central/eventos/novo",
      description:
        "Planeje eventos presenciais, transmissão, patrocínio e publicação institucional.",
      emptyMessage: "Nenhum evento encontrado.",
      headerIcon: "calendar-days",
      headerTitle: "Eventos",
      key: "events",
      rowsKey: "events",
      title: "Agenda de eventos",
    },
    "pages.central.cursos.index": {
      action: "cursos",
      columns: ["Curso", "Slug", "Tipo", "Status", "Atualizado"],
      createHref: "/central/cursos/novo",
      description:
        "Centralize trilhas, aulas e forma de publicação dos cursos da plataforma.",
      emptyMessage: "Nenhum curso encontrado.",
      headerIcon: "graduation-cap",
      headerTitle: "Cursos",
      key: "courses",
      rowsKey: "courses",
      title: "Catálogo de cursos",
    },
    "pages.central.sorteios.index": {
      action: "sorteios",
      columns: ["Campanha", "Prêmio", "Status", "Cupons", "Encerramento"],
      createHref: "/central/sorteios/novo",
      description:
        "Acompanhe sorteios, cupons emitidos e campanhas promocionais da plataforma.",
      emptyMessage: "Nenhum sorteio encontrado.",
      headerIcon: "ticket",
      headerTitle: "Sorteios",
      key: "giveaways",
      rowsKey: "giveaways",
      title: "Campanhas e sorteios",
    },
  } as const;

  if (view in eventLikeViews) {
    const config = eventLikeViews[view as keyof typeof eventLikeViews];
    const rows = Array.isArray(data[config.rowsKey])
      ? (data[config.rowsKey] as Record<string, unknown>[])
      : [];
    return (
      <DashboardShell
        activeMenu={config.action}
        headerIcon={config.headerIcon}
        headerTitle={config.headerTitle}
      >
        <section className="mt-4 space-y-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold">{config.title}</h2>
                  <p className="text-sm text-base-content/70">
                    {config.description}
                  </p>
                </div>
                <a className="btn btn-primary btn-sm" href={config.createHref}>
                  Novo
                </a>
              </div>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      {config.columns.map((column) => (
                        <th key={column}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          className="py-8 text-center text-sm text-base-content/65"
                          colSpan={config.columns.length}
                        >
                          {config.emptyMessage}
                        </td>
                      </tr>
                    ) : (
                      rows.map((row) => (
                        <tr
                          key={String(
                            row.id || row.title || row.slug || Math.random(),
                          )}
                        >
                          {config.action === "eventos" ? (
                            <>
                              <td>{String(row.title || "-")}</td>
                              <td>{String(row.event_mode_label || "-")}</td>
                              <td>
                                {String(
                                  (row.event_mode || "") === "online"
                                    ? row.online_url || "Online"
                                    : row.location_name || "-",
                                )}
                              </td>
                              <td>{String(row.published_label || "-")}</td>
                              <td>{String(row.starts_at || "-")}</td>
                            </>
                          ) : null}
                          {config.action === "cursos" ? (
                            <>
                              <td>{String(row.title || "-")}</td>
                              <td>{String(row.slug || "-")}</td>
                              <td>{String(row.price || "-")}</td>
                              <td>{String(row.published_label || "-")}</td>
                              <td>{String(row.created_at || "-")}</td>
                            </>
                          ) : null}
                          {config.action === "sorteios" ? (
                            <>
                              <td>{String(row.title || "-")}</td>
                              <td>{String(row.prize_description || "-")}</td>
                              <td>{String(row.status_label || "-")}</td>
                              <td>{String(row.coupons_count || "0")}</td>
                              <td>{String(row.ends_at || "-")}</td>
                            </>
                          ) : null}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (
    view === "pages.central.eventos.novo" ||
    view === "pages.central.eventos.editar" ||
    view === "pages.central.cursos.novo" ||
    view === "pages.central.cursos.editar" ||
    view === "pages.central.sorteios.novo" ||
    view === "pages.central.sorteios.editar"
  ) {
    const formItem = (data.formItem as Record<string, unknown>) || {};
    const isEdit = view.endsWith("editar");
    if (view.includes("eventos")) {
      return moduleFormPage({
        action: String(
          data.formAction || (isEdit ? "#" : "/dashboard/central/eventos"),
        ),
        backHref: "/central/eventos",
        description: isEdit
          ? "Atualize agenda, formato e comunicação do evento selecionado."
          : "Defina agenda, formato e comunicação para um novo evento institucional.",
        fields: [
          {
            label: "Nome do evento",
            name: "title",
            required: true,
            span: "full",
            value: String(formItem.title || ""),
          },
          {
            label: "Formato",
            name: "event_mode",
            options: { local: "Presencial", online: "Online" },
            type: "select",
            value: String(formItem.event_mode || "local"),
          },
          {
            label: "Local",
            name: "location_name",
            value: String(formItem.location_name || ""),
          },
          {
            label: "Endereço",
            name: "location_address",
            value: String(formItem.location_address || ""),
          },
          {
            label: "URL online",
            name: "online_url",
            span: "full",
            type: "url",
            value: String(formItem.online_url || ""),
          },
          {
            label: "Início",
            name: "starts_at",
            required: true,
            type: "datetime-local",
            value: String(formItem.starts_at || ""),
          },
          {
            label: "Fim",
            name: "ends_at",
            type: "datetime-local",
            value: String(formItem.ends_at || ""),
          },
          {
            label: "Capacidade",
            name: "capacity",
            type: "number",
            value: String(formItem.capacity || ""),
          },
          {
            label: "Resumo",
            name: "summary",
            span: "full",
            type: "textarea",
            value: String(formItem.summary || ""),
          },
          {
            label: "Descrição",
            name: "description",
            span: "full",
            type: "textarea",
            value: String(formItem.description || ""),
          },
          {
            label: "Fluxo de publicação",
            name: "publication_flow",
            options: {
              draft: "Rascunho",
              review: "Enviar para revisão",
              publish: "Publicar agora",
              schedule: "Agendar",
            },
            type: "select",
            value: String(formItem.publication_flow || "draft"),
          },
          {
            label: "Agendar para",
            name: "publish_at",
            type: "datetime-local",
            value: String(formItem.publish_at || ""),
          },
        ],
        headerIcon: isEdit ? "pencil" : "plus",
        headerTitle: isEdit ? "Editar evento" : "Novo evento",
        submitLabel: isEdit ? "Salvar alterações" : "Salvar evento",
        title: String(
          data.formPageTitle || (isEdit ? "Editar evento" : "Cadastrar evento"),
        ),
      });
    }
    if (view.includes("cursos")) {
      return moduleFormPage({
        action: String(
          data.formAction || (isEdit ? "#" : "/dashboard/central/cursos"),
        ),
        backHref: "/central/cursos",
        description: isEdit
          ? "Atualize metadados, descrição e estado do curso selecionado."
          : "Estruture um novo curso, trilha ou workshop para a TV Clubemp.",
        fields: [
          {
            label: "Título",
            name: "title",
            required: true,
            span: "full",
            value: String(formItem.title || ""),
          },
          {
            label: "Tipo",
            name: "is_paid",
            options: { "1": "Pago", "0": "Gratuito" },
            type: "select",
            value: String(formItem.is_paid || "1"),
          },
          {
            label: "Valor (R$)",
            name: "price_brl",
            value: String(formItem.price_brl || ""),
          },
          {
            label: "Resumo",
            name: "summary",
            span: "full",
            type: "textarea",
            value: String(formItem.summary || ""),
          },
          {
            label: "Descrição",
            name: "description",
            span: "full",
            type: "textarea",
            value: String(formItem.description || ""),
          },
          {
            label: "Conteúdo",
            name: "content_body",
            required: true,
            span: "full",
            type: "textarea",
            value: String(formItem.content_body || ""),
          },
          {
            label: "Fluxo de publicação",
            name: "publication_flow",
            options: {
              draft: "Rascunho",
              review: "Enviar para revisão",
              publish: "Publicar agora",
              schedule: "Agendar",
            },
            type: "select",
            value: String(formItem.publication_flow || "draft"),
          },
          {
            label: "Agendar para",
            name: "publish_at",
            type: "datetime-local",
            value: String(formItem.publish_at || ""),
          },
        ],
        headerIcon: isEdit ? "pencil" : "plus",
        headerTitle: isEdit ? "Editar curso" : "Novo curso",
        submitLabel: isEdit ? "Salvar alterações" : "Salvar curso",
        title: String(
          data.formPageTitle || (isEdit ? "Editar curso" : "Cadastrar curso"),
        ),
      });
    }
    return moduleFormPage({
      action: String(
        data.formAction || (isEdit ? "#" : "/dashboard/central/sorteios"),
      ),
      backHref: "/central/sorteios",
      description: isEdit
        ? "Ajuste prêmio, status e regras da campanha."
        : "Configure uma nova campanha promocional com prêmio, regras e janela de execução.",
      fields: [
        {
          label: "Nome da campanha",
          name: "title",
          required: true,
          span: "full",
          value: String(formItem.title || ""),
        },
        {
          label: "Prêmio",
          name: "prize_description",
          value: String(formItem.prize_description || ""),
        },
        {
          label: "Status",
          name: "status",
          options: { draft: "Rascunho", open: "Aberto", closed: "Encerrado" },
          type: "select",
          value: String(formItem.status || "draft"),
        },
        {
          label: "Publicar agora",
          name: "is_published",
          placeholder: "Disponibilizar no site",
          type: "checkbox",
          value: String(formItem.is_published || "0"),
        },
        {
          label: "Início",
          name: "starts_at",
          type: "datetime-local",
          value: String(formItem.starts_at || ""),
        },
        {
          label: "Encerramento",
          name: "ends_at",
          type: "datetime-local",
          value: String(formItem.ends_at || ""),
        },
        {
          label: "Resumo",
          name: "summary",
          span: "full",
          type: "textarea",
          value: String(formItem.summary || ""),
        },
        {
          label: "Regras",
          name: "description",
          span: "full",
          type: "textarea",
          value: String(formItem.description || ""),
        },
      ],
      headerIcon: isEdit ? "pencil" : "plus",
      headerTitle: isEdit ? "Editar sorteio" : "Novo sorteio",
      submitLabel: isEdit ? "Salvar alterações" : "Salvar sorteio",
      title: String(
        data.formPageTitle || (isEdit ? "Editar sorteio" : "Cadastrar sorteio"),
      ),
    });
  }

  if (
    view === "pages.central.eventos.ver" ||
    view === "pages.central.cursos.ver" ||
    view === "pages.central.sorteios.ver"
  ) {
    const item =
      ((view.includes("eventos")
        ? data.event
        : view.includes("cursos")
          ? data.course
          : data.giveaway) as Record<string, unknown>) || {};
    if (view.includes("eventos")) {
      return moduleShowPage({
        backHref: "/central/eventos",
        description: "Resumo operacional do evento e seus dados de publicação.",
        editHref: `/central/eventos/editar?id=${String(item.id || 0)}`,
        headerIcon: "eye",
        headerTitle: "Ver evento",
        items: [
          { label: "Início", value: String(item.starts_at || "-") },
          { label: "Fim", value: String(item.ends_at || "-") },
          {
            label: "Descrição",
            span: "full",
            value: String(item.description || "-"),
          },
        ],
        meta: [
          {
            label: "Formato",
            value: String(
              (item.event_mode || "") === "online" ? "Online" : "Presencial",
            ),
          },
          {
            label: "Local",
            value: String(
              (item.event_mode || "") === "online"
                ? item.online_url || "-"
                : item.location_name || "-",
            ),
          },
          { label: "Status", value: String(item.publication_status || "-") },
          {
            label: "Inscrições",
            value: String(item.registrations_count || "0"),
          },
        ],
        title: `Evento: ${String(item.title || "-")}`,
      });
    }
    if (view.includes("cursos")) {
      return moduleShowPage({
        backHref: "/central/cursos",
        description: "Visualização do curso e seus dados de publicação.",
        editHref: `/central/cursos/editar?id=${String(item.id || 0)}`,
        headerIcon: "eye",
        headerTitle: "Ver curso",
        items: [
          { label: "Resumo", span: "full", value: String(item.summary || "-") },
          {
            label: "Descrição",
            span: "full",
            value: String(item.description || "-"),
          },
          {
            label: "Conteúdo",
            span: "full",
            value: String(item.content_body || "-"),
          },
        ],
        meta: [
          { label: "Slug", value: String(item.slug || "-") },
          {
            label: "Tipo",
            value: String((item.is_paid || "0") === "1" ? "Pago" : "Gratuito"),
          },
          { label: "Status", value: String(item.publication_status || "-") },
          { label: "Acessos", value: String(item.access_count || "0") },
        ],
        title: `Curso: ${String(item.title || "-")}`,
      });
    }
    return moduleShowPage({
      backHref: "/central/sorteios",
      description: "Painel de visualização da campanha promocional.",
      editHref: `/central/sorteios/editar?id=${String(item.id || 0)}`,
      headerIcon: "eye",
      headerTitle: "Ver sorteio",
      items: [
        { label: "Resumo", span: "full", value: String(item.summary || "-") },
        {
          label: "Regras",
          span: "full",
          value: String(item.description || "-"),
        },
      ],
      meta: [
        { label: "Prêmio", value: String(item.prize_description || "-") },
        { label: "Status", value: String(item.status || "-") },
        { label: "Cupons", value: String(item.coupons_count || "0") },
        { label: "Encerramento", value: String(item.ends_at || "-") },
      ],
      title: `Sorteio: ${String(item.title || "-")}`,
    });
  }

  if (
    view === "pages.central.solicitacoes.index" ||
    view === "pages.central.repasses.index"
  ) {
    const isRequests = view.includes("solicitacoes");
    const rows = Array.isArray(isRequests ? data.requests : data.payouts)
      ? ((isRequests ? data.requests : data.payouts) as Record<
          string,
          unknown
        >[])
      : [];
    return simpleCrudTable({
      activeMenu: isRequests ? "requests" : "payouts",
      columns: isRequests
        ? ["Nome fantasia", "Tipo", "Contato", "Status", "Recebido em"]
        : ["Repasse", "Beneficiário", "Valor", "Status", "Criado em"],
      countLabel: `${rows.length} registros`,
      description: isRequests
        ? "Painel resumido para triagem de empresas, aprovação e acompanhamento do pipeline comercial."
        : "Módulo administrativo para acompanhar repasses, comprovantes e conciliação financeira.",
      emptyMessage: isRequests
        ? "Nenhuma solicitação encontrada."
        : "Nenhum repasse encontrado.",
      headerIcon: isRequests ? "building-2" : "hand-coins",
      headerTitle: isRequests ? "Solicitações" : "Repasses",
      rows: rows.map((row) =>
        isRequests
          ? [
              String(row.company_name || "-"),
              String(row.request_type_label || "-"),
              String(row.contact_name || row.entrepreneur_name || "-"),
              String(row.status_label || "-"),
              String(row.created_at || "-"),
            ]
          : [
              `${String(row.entry_type_label || "Repasse")} #${String(row.id || "0")}`,
              String(row.beneficiary_company_name || "-"),
              String(row.amount || "R$ 0,00"),
              String(row.status || "-"),
              String(row.created_at || "-"),
            ],
      ),
      title: isRequests ? "Fila de solicitações" : "Gestão de repasses",
    });
  }

  if (view === "pages.central.noticias.index") {
    const posts = Array.isArray(data.posts)
      ? (data.posts as Record<string, unknown>[])
      : [];
    return (
      <DashboardShell
        activeMenu="news"
        headerIcon="newspaper"
        headerTitle="Notícias"
      >
        <section className="mt-4 space-y-5">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  TV Clubemp
                </p>
                <h2 className="text-2xl font-black">Notícias</h2>
                <p className="max-w-2xl text-sm text-base-content/70">
                  Gerencie o ciclo editorial com páginas separadas para criação,
                  visualização e edição.
                </p>
              </div>
              <a
                className="btn btn-primary rounded-2xl"
                href="/central/noticias/novo"
              >
                Nova notícia
              </a>
            </div>
          </article>
          <div className="grid gap-4">
            {posts.length === 0 ? (
              <article className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/65 shadow-sm">
                Nenhuma notícia cadastrada ainda.
              </article>
            ) : (
              posts.map((post) => (
                <article
                  key={String(
                    post.id || post.slug || post.title || Math.random(),
                  )}
                  className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`badge ${String(post.published_badge || "badge-outline")}`}
                        >
                          {String(post.published_label || "Rascunho")}
                        </span>
                        <span className="badge badge-outline">
                          {String(post.review_label || "Sem revisão")}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-black">
                        {String(post.title || "-")}
                      </h3>
                      <p className="mt-2 text-sm text-base-content/65">
                        {String(post.summary || "Sem resumo editorial.")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:min-w-[10rem]">
                      <a
                        className="btn btn-outline btn-sm rounded-2xl"
                        href={`/central/noticias/ver?id=${String(post.id || 0)}`}
                      >
                        Ver
                      </a>
                      <a
                        className="btn btn-primary btn-sm rounded-2xl"
                        href={`/central/noticias/editar?id=${String(post.id || 0)}`}
                      >
                        Editar
                      </a>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.health") {
    const metrics = asRecord(data.metrics);
    const rows = asRecordArray(metrics.requests_by_route);
    return (
      <DashboardShell
        activeMenu="health"
        headerIcon="activity"
        headerTitle="Saúde do sistema"
      >
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Requests", String(metrics.requests_total || 0)],
            ["Erros 4xx", String(metrics.errors_4xx || 0)],
            ["Erros 5xx", String(metrics.errors_5xx || 0)],
          ].map(([label, value]) => (
            <article
              key={label}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </article>
          ))}
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">Latência</p>
              <p className="text-sm text-base-content/70">
                Média: {String(metrics.avg_duration_ms || 0)} ms
              </p>
              <p className="text-sm text-base-content/70">
                P95: {String(metrics.p95_duration_ms || 0)} ms
              </p>
            </div>
          </article>
        </section>
        <section className="mt-4 card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wide text-base-content/65">
                Requests por rota
              </h2>
              <span className="text-xs text-base-content/55">
                Atualizado em {String(metrics.generated_at || "-")}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th>Rota</th>
                    <th className="text-right">Requests</th>
                    <th className="text-right">Erros 4xx</th>
                    <th className="text-right">Erros 5xx</th>
                    <th className="text-right">Média (ms)</th>
                    <th className="text-right">P95 (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        className="text-center text-base-content/60"
                        colSpan={6}
                      >
                        Sem dados de métricas ainda.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr
                        key={String(row.route || row.id || JSON.stringify(row))}
                      >
                        <td className="font-mono text-xs">
                          {String(row.route || "/")}
                        </td>
                        <td className="text-right">
                          {String(row.requests || 0)}
                        </td>
                        <td className="text-right">
                          {String(row.errors_4xx || 0)}
                        </td>
                        <td className="text-right">
                          {String(row.errors_5xx || 0)}
                        </td>
                        <td className="text-right">
                          {String(row.avg_duration_ms || 0)}
                        </td>
                        <td className="text-right">
                          {String(row.p95_duration_ms || 0)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.requests") {
    const requests = asRecordArray(data.requests);
    const statusFilter = String(data.statusFilter || "all");
    const typeFilter = String(data.typeFilter || "all");
    const statusOptions = asRecord(data.statusOptions);
    const typeOptions = asRecord(data.typeOptions);
    return (
      <DashboardShell
        activeMenu="requests"
        headerBadge={`${String(data.requestsCount || requests.length)} pedidos`}
        headerIcon="building-2"
        headerTitle="Solicitações de empresas"
      >
        <section className="mb-4 mt-4 grid gap-4 md:grid-cols-2">
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">
                Filtro por status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(statusOptions).map(([key, label]) => (
                  <a
                    key={key}
                    className={`btn btn-xs ${statusFilter === key ? "btn-primary" : "btn-outline"}`}
                    href={`/central/solicitacoes?status=${encodeURIComponent(key)}&type=${encodeURIComponent(typeFilter)}`}
                  >
                    {String(label)}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">
                Filtro por tipo
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(typeOptions).map(([key, label]) => (
                  <a
                    key={key}
                    className={`btn btn-xs ${typeFilter === key ? "btn-secondary" : "btn-outline"}`}
                    href={`/central/solicitacoes?status=${encodeURIComponent(statusFilter)}&type=${encodeURIComponent(key)}`}
                  >
                    {String(label)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-base-100 p-6 text-sm text-base-content/70 shadow-sm">
              Nenhum pedido encontrado para este filtro.
            </div>
          ) : null}
          {requests.map((request) => (
            <article
              key={String(
                request.id || request.company_name || JSON.stringify(request),
              )}
              className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold">
                    {String(request.company_name || "-")}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Contato: {String(request.contact_name || "-")}
                  </p>
                  <p className="text-xs text-base-content/55">
                    Recebido em {String(request.created_at || "-")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge ${String(request.status_badge || "badge-outline")}`}
                  >
                    {String(request.status_label || "-")}
                  </span>
                  <span className="badge badge-outline">
                    {String(request.request_type_label || "-")}
                  </span>
                  <span className="badge badge-outline">
                    ID #{String(request.id || "0")}
                  </span>
                </div>
              </div>
              <p className="mt-3 rounded-xl border border-base-300 bg-base-200/60 p-3 text-sm text-base-content/80">
                {String(request.message || "-")}
              </p>
              <BackendForm
                backendPath={`/central/requests/${String(request.id || 0)}/status`}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                <input
                  name="status_filter"
                  type="hidden"
                  value={statusFilter}
                />
                <input name="type_filter" type="hidden" value={typeFilter} />
                <span className="text-sm font-semibold">Alterar status:</span>
                <select
                  className="select select-bordered select-sm"
                  name="status"
                >
                  {[
                    ["new", "Novo"],
                    ["in_contact", "Em contato"],
                    ["approved", "Aprovado"],
                    ["rejected", "Recusado"],
                  ].map(([value, label]) => (
                    <option
                      key={value}
                      selected={String(request.status || "") === value}
                      value={value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
                <button className="btn btn-sm btn-primary" type="submit">
                  Salvar status
                </button>
                <a
                  className="btn btn-sm btn-outline"
                  href={`/central/solicitacoes/ver?id=${String(request.id || 0)}`}
                >
                  Ver detalhes
                </a>
              </BackendForm>
            </article>
          ))}
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.payouts") {
    const financeMetrics = asRecord(data.financeMetrics);
    const pendingPayouts = asRecordArray(data.pendingPayouts);
    return (
      <DashboardShell
        activeMenu="payouts"
        headerBadge={`${String(data.pendingPayoutsCount || pendingPayouts.length)} pendentes`}
        headerIcon="hand-coins"
        headerTitle="Repasses pendentes"
      >
        <section className="mb-4 mt-4 grid gap-4 md:grid-cols-3">
          {[
            ["Vendas totais", String(financeMetrics.sales_total || "-")],
            ["Comissões", String(financeMetrics.commissions_total || "-")],
            ["Repasses", String(financeMetrics.pending_payouts_total || "-")],
          ].map(([label, value]) => (
            <article
              key={label}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="text-lg font-bold">{value}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="space-y-3">
          {pendingPayouts.length === 0 ? (
            <div className="rounded-2xl border border-base-300 bg-base-100 p-4 text-sm text-base-content/70 shadow-sm">
              Nenhum repasse pendente para execução.
            </div>
          ) : null}
          {pendingPayouts.map((payout) => (
            <article
              key={String(payout.id || JSON.stringify(payout))}
              className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold">
                    {String(payout.entry_type_label || "Repasse")} #
                    {String(payout.id || "0")}
                  </h3>
                  <p className="text-xs text-base-content/65">
                    Solicitado em {String(payout.created_at || "-")}
                  </p>
                </div>
                <span className="badge badge-outline">
                  {String(payout.amount || "R$ 0,00")}
                </span>
              </div>
              <p className="mt-2 text-sm text-base-content/75">
                Beneficiário:{" "}
                {String(payout.beneficiary_company_name || "Não informado")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <BackendForm
                  backendPath={`/central/repasses/${String(payout.id || 0)}/executar`}
                >
                  <button className="btn btn-sm btn-primary" type="submit">
                    Marcar como executado
                  </button>
                </BackendForm>
                <a
                  className="btn btn-sm btn-outline"
                  href={`/api/backend/central/repasses/${String(payout.id || 0)}/comprovante`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Comprovante
                </a>
              </div>
            </article>
          ))}
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.sales") {
    const summary = asRecord(data.salesSummary);
    const salesRows = asRecordArray(data.salesRows);
    return (
      <DashboardShell
        activeMenu="sales"
        headerBadge={`${String(summary.sales_count || 0)} vendas`}
        headerIcon="shopping-cart"
        headerTitle="Compras e vendas"
      >
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "Volume total",
              String(summary.total_amount || "R$ 0,00"),
              `${String(summary.sales_count || 0)} vendas`,
            ],
            [
              "Pagas",
              String(summary.paid_amount || "R$ 0,00"),
              `${String(summary.paid_count || 0)} pedidos pagos`,
            ],
            [
              "Clientes compradores",
              String(summary.unique_customers || 0),
              `${String(summary.pending_count || 0)} pedidos pendentes`,
            ],
          ].map(([label, value, help]) => (
            <article
              key={label}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-sm text-base-content/70">{help}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="mt-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="receipt" /> Histórico de
                compras da plataforma
              </h2>
              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Data</th>
                      <th>Loja</th>
                      <th>Cliente</th>
                      <th>Perfil</th>
                      <th>Empresa vinculada</th>
                      <th>Pagamento</th>
                      <th>Total</th>
                      <th>Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesRows.length === 0 ? (
                      <tr>
                        <td
                          className="text-center text-sm text-base-content/65"
                          colSpan={9}
                        >
                          Nenhuma compra registrada.
                        </td>
                      </tr>
                    ) : (
                      salesRows.map((sale) => (
                        <tr key={String(sale.id || JSON.stringify(sale))}>
                          <td className="font-semibold">
                            #{String(sale.id || "0")}
                          </td>
                          <td>{String(sale.created_at || "-")}</td>
                          <td>{String(sale.seller_tenant_name || "-")}</td>
                          <td>
                            {String(sale.customer_name || "Não identificado")}
                          </td>
                          <td>{String(sale.customer_type_label || "-")}</td>
                          <td>{String(sale.linked_tenant_name || "-")}</td>
                          <td>{String(sale.payment_status || "-")}</td>
                          <td>{String(sale.total_amount || "R$ 0,00")}</td>
                          <td>{String(sale.commission_amount || "R$ 0,00")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.entrepreneur-invites") {
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
                    <div className="space-y-1">
                      <p className="font-bold">Empresa Empreendedora</p>
                      <p className="text-sm text-base-content/70">
                        Fluxo com vitrine, categorias, cidades de atuação e 2
                        brindes mensais.
                      </p>
                    </div>
                  </label>
                  <label className="cursor-pointer rounded-2xl border border-base-300 p-4">
                    <input
                      className="peer sr-only"
                      defaultChecked={oldInviteType === "conveniada"}
                      name="invite_type"
                      type="radio"
                      value="conveniada"
                    />
                    <div className="space-y-1">
                      <p className="font-bold">Empresa Conveniada</p>
                      <p className="text-sm text-base-content/70">
                        Fluxo institucional sem brindes mensais nem campos de
                        marketplace.
                      </p>
                    </div>
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

  if (
    view === "pages.central.noticias.novo" ||
    view === "pages.central.noticias.editar"
  ) {
    const formItem = asRecord(data.formItem);
    const isEdit = view.endsWith("editar");
    return moduleFormPage({
      action: String(data.formAction || (isEdit ? "#" : "/central/blog")),
      backHref: "/central/noticias",
      description: isEdit
        ? "Revise conteúdo, status editorial e a prévia pública antes de salvar."
        : "Estruture uma nova matéria com revisão visual antes de publicar.",
      fields: [
        {
          label: "Título",
          name: "title",
          required: true,
          span: "full",
          value: String(formItem.title || ""),
        },
        {
          label: "Resumo",
          name: "summary",
          span: "full",
          value: String(formItem.summary || ""),
        },
        {
          label: "Imagem de capa",
          name: "cover_image",
          type: "file",
        },
        {
          label: "Fluxo de publicação",
          name: "publication_status",
          options: {
            draft: "Rascunho",
            review: "Em revisão",
            published: "Publicado",
            inactive: "Inativo",
          },
          type: "select",
          value: String(formItem.publication_status || "draft"),
        },
        {
          label: "Agendar para",
          name: "published_at",
          type: "datetime-local",
          value: String(formItem.published_at || ""),
        },
        {
          label: "Conteúdo",
          name: "content",
          required: true,
          rows: 12,
          span: "full",
          type: "textarea",
          value: String(
            formItem.content || formItem.content_body || formItem.body || "",
          ),
        },
      ],
      headerIcon: isEdit ? "square-pen" : "newspaper",
      headerTitle: isEdit ? "Editar notícia" : "Nova notícia",
      submitLabel: isEdit ? "Salvar alterações" : "Salvar notícia",
      title: String(
        data.formPageTitle || (isEdit ? "Editar notícia" : "Cadastrar notícia"),
      ),
    });
  }

  if (view === "pages.central.noticias.ver") {
    const post = asRecord(data.post);
    const contentHtml = String(data.postContentHtml || "");
    return (
      <DashboardShell
        activeMenu="news"
        headerIcon="eye"
        headerTitle="Ver notícia"
      >
        <section className="mt-4 space-y-5">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  TV Clubemp
                </p>
                <h2 className="text-2xl font-black">
                  {String(post.title || "-")}
                </h2>
                <p className="text-sm text-base-content/65">
                  Acompanhe o estado editorial e revise a matéria antes de novas
                  publicações.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  className="btn btn-outline rounded-2xl"
                  href="/central/noticias"
                >
                  Voltar
                </a>
                <a
                  className="btn btn-primary rounded-2xl"
                  href={`/central/noticias/editar?id=${String(post.id || 0)}`}
                >
                  Editar
                </a>
              </div>
            </div>
          </article>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Slug", String(post.slug || "-")],
              [
                "Status",
                String(
                  post.publication_label || post.publication_status || "-",
                ),
              ],
              [
                "Revisão",
                String(post.review_label || post.review_status || "-"),
              ],
              ["Publicação", String(post.published_at || "-")],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="mt-2 text-lg font-bold">{value}</p>
              </article>
            ))}
          </section>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_20rem]">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Resumo
                  </p>
                  <p className="mt-2 text-sm leading-7 text-base-content/75">
                    {String(post.summary || "Sem resumo editorial.")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                    Conteúdo
                  </p>
                  <div className="mt-4 whitespace-pre-line text-sm leading-7 text-base-content/85">
                    {String(
                      post.content ||
                        post.content_body ||
                        post.body ||
                        contentHtml
                          .replace(/<[^>]+>/g, " ")
                          .replace(/\s+/g, " ")
                          .trim() ||
                        "Sem conteúdo editorial.",
                    )}
                  </div>
                </div>
              </div>
            </article>
            <aside className="space-y-5">
              <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
                <h3 className="text-base font-black">Ações rápidas</h3>
                <div className="mt-4 flex flex-col gap-3">
                  {[
                    [
                      String(post.publication_status || "") === "inactive"
                        ? "draft"
                        : "inactive",
                      String(post.publication_status || "") === "inactive"
                        ? "Reativar notícia"
                        : "Desativar notícia",
                    ],
                    ["published", "Publicar agora"],
                    ["review", "Enviar para revisão"],
                  ].map(([status, label]) => (
                    <BackendForm
                      key={status}
                      backendPath={`/central/blog/${String(post.id || 0)}/status`}
                    >
                      <input name="status" type="hidden" value={status} />
                      <button
                        className="btn btn-outline w-full rounded-2xl"
                        type="submit"
                      >
                        {label}
                      </button>
                    </BackendForm>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.empresas.ver") {
    const company = asRecord(data.company);
    return (
      <DashboardShell
        activeMenu="companies"
        headerIcon="store"
        headerTitle="Detalhes da empresa"
      >
        <section className="mt-4 space-y-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            {company.banner_path ? (
              <img
                alt={`Banner ${String(company.name || "empresa")}`}
                className="h-44 w-full object-cover"
                src={String(company.banner_path)}
              />
            ) : null}
            <div className="card-body p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    {String(company.name || "-")}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {String(company.slug || "-")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-outline">
                      {String(company.kind_label || "-")}
                    </span>
                    <span className="badge badge-outline">
                      {String(company.visibility_label || "-")}
                    </span>
                    {String(company.seal_label || "") === "Valéria Vaz" ? (
                      <span className="badge border-amber-300 bg-amber-100 text-amber-900">
                        Selo Valéria Vaz
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    className="btn btn-outline btn-sm"
                    href="/central/empresas"
                  >
                    Voltar
                  </a>
                  {company.public_href ? (
                    <a
                      className="btn btn-primary btn-sm"
                      href={String(company.public_href)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Página pública
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Classificação", String(company.kind_label || "-")],
              ["Vínculos internos", String(company.company_records_count || 0)],
              ["Usuários vinculados", String(company.users_count || 0)],
              [
                "Local",
                [String(company.city || ""), String(company.state || "")]
                  .filter(Boolean)
                  .join(" - ") || "-",
              ],
            ].map(([label, value]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4">
                  <p className="text-xs uppercase text-base-content/55">
                    {label}
                  </p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              </article>
            ))}
          </section>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Nome fantasia", String(company.trade_name || "-")],
                  ["Razão social", String(company.legal_name || "-")],
                  [
                    "Documento",
                    `${company.document_type ? `${String(company.document_type).toUpperCase()}: ` : ""}${String(company.document_number || "-")}`,
                  ],
                  ["Selo", String(company.seal_label || "-")],
                  ["E-mail de contato", String(company.contact_email || "-")],
                  ["Telefone", String(company.contact_phone || "-")],
                  [
                    "Responsável empreendedor",
                    String(company.entrepreneur_name || "-"),
                  ],
                  ["Página pública", String(company.public_href || "-")],
                  ["Descrição", String(company.description || "-")],
                  ["Serviços", String(company.services_text || "-")],
                  ["Produtos", String(company.products_text || "-")],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className={
                      label === "Descrição" ||
                      label === "Serviços" ||
                      label === "Produtos"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <p className="text-xs uppercase tracking-wide text-base-content/55">
                      {label}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm text-base-content/80">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.clientes.ver") {
    const customer = asRecord(data.customer);
    const linkedCompanies = asRecordArray(customer.linked_companies_list);
    return (
      <DashboardShell
        activeMenu="customers"
        headerIcon="user-round"
        headerTitle="Detalhes do cliente"
      >
        <section className="mt-4 space-y-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    {String(customer.name || "-")}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {String(customer.email || "-")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-outline">
                      {String(customer.customer_type_label || "-")}
                    </span>
                    <span className="badge badge-outline">
                      {String(customer.status_label || "-")}
                    </span>
                  </div>
                </div>
                <a className="btn btn-outline btn-sm" href="/central/clientes">
                  Voltar
                </a>
              </div>
            </div>
          </article>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Compras registradas", String(customer.purchases_count || 0)],
              [
                "Total movimentado",
                String(customer.purchases_total || "R$ 0,00"),
              ],
              [
                "Empresas vinculadas",
                String(customer.linked_companies_count || 0),
              ],
              ["Criado em", String(customer.created_at || "-")],
            ].map(([label, value]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4">
                  <p className="text-xs uppercase text-base-content/55">
                    {label}
                  </p>
                  <p className="text-lg font-bold">{value}</p>
                </div>
              </article>
            ))}
          </section>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Telefone", String(customer.phone || "-")],
                  ["ID do usuário", String(customer.user_id || "-")],
                  [
                    "Perfil de acesso",
                    String(customer.user_account_type || "-"),
                  ],
                  ["Código do cartão", String(customer.card_code || "-")],
                  ["Tipo do cartão", String(customer.card_type_label || "-")],
                  ["QR slug", String(customer.qr_code_slug || "-")],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-wide text-base-content/55">
                      {label}
                    </p>
                    <p className="mt-1 break-all text-sm text-base-content/80">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <h3 className="mb-4 text-base font-bold">Empresas vinculadas</h3>
              {linkedCompanies.length === 0 ? (
                <p className="text-sm text-base-content/65">
                  Este cliente ainda não possui empresa conveniada vinculada.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Empresa</th>
                        <th>Tipo</th>
                        <th>Vínculo</th>
                        <th>Status</th>
                        <th className="text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedCompanies.map((company) => (
                        <tr
                          key={String(
                            company.id ||
                              company.name ||
                              JSON.stringify(company),
                          )}
                        >
                          <td>
                            <p className="font-semibold">
                              {String(company.name || "-")}
                            </p>
                            <p className="text-xs text-base-content/55">
                              Vinculado em {String(company.created_at || "-")}
                            </p>
                          </td>
                          <td>{String(company.company_type_label || "-")}</td>
                          <td>{String(company.link_type || "-")}</td>
                          <td>{String(company.status || "-")}</td>
                          <td className="text-right">
                            <div className="flex flex-wrap justify-end gap-2">
                              {company.dashboard_href ? (
                                <a
                                  className="btn btn-xs btn-outline"
                                  href={String(company.dashboard_href)}
                                >
                                  Ver empresa
                                </a>
                              ) : null}
                              {company.public_href ? (
                                <a
                                  className="btn btn-xs btn-primary"
                                  href={String(company.public_href)}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  Página pública
                                </a>
                              ) : null}
                            </div>
                          </td>
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

  if (view === "pages.central.privacidade.ver") {
    const request = asRecord(data.privacyRequest);
    const statusOptions = asRecord(data.statusOptions);
    return (
      <DashboardShell
        activeMenu="privacy"
        headerIcon="shield-check"
        headerTitle="Detalhes da solicitação LGPD"
      >
        <section className="mt-4 space-y-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">
                    {String(request.full_name || "-")}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {String(request.email || "-")}
                  </p>
                </div>
                <a
                  className="btn btn-outline btn-sm"
                  href="/central/privacidade"
                >
                  Voltar
                </a>
              </div>
            </div>
          </article>
          <section className="grid gap-4 lg:grid-cols-2">
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <h3 className="mb-4 text-base font-bold">Dados do pedido</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Tipo", String(request.request_type_label || "-")],
                    ["Status", String(request.status_label || "-")],
                    ["Solicitado em", String(request.created_at || "-")],
                    ["Resolvido em", String(request.resolved_at || "-")],
                    [
                      "IP / Navegador",
                      `${String(request.request_ip || "-")}\n${String(request.request_user_agent || "-")}`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className={
                        label === "IP / Navegador" ? "md:col-span-2" : ""
                      }
                    >
                      <p className="text-xs uppercase tracking-wide text-base-content/55">
                        {label}
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm text-base-content/80">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body p-5">
                <h3 className="mb-4 text-base font-bold">
                  Atualizar tratamento
                </h3>
                <BackendForm
                  backendPath="/central/privacidade/status"
                  className="space-y-4"
                >
                  <input
                    name="request_id"
                    type="hidden"
                    value={String(request.id || "")}
                  />
                  <label className="form-control">
                    <span className="label-text font-semibold">
                      Novo status
                    </span>
                    <select className="select select-bordered" name="status">
                      {Object.entries(statusOptions).map(([key, label]) => (
                        <option
                          key={key}
                          selected={String(request.status || "") === key}
                          value={key}
                        >
                          {String(label)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text font-semibold">
                      Notas internas / resposta
                    </span>
                    <textarea
                      className="textarea textarea-bordered min-h-32"
                      defaultValue={String(request.resolution_notes || "")}
                      name="resolution_notes"
                    />
                  </label>
                  <button className="btn btn-primary" type="submit">
                    Salvar andamento
                  </button>
                </BackendForm>
              </div>
            </article>
          </section>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5">
              <h3 className="mb-4 text-base font-bold">
                Descrição enviada pelo titular
              </h3>
              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm leading-relaxed text-base-content/80">
                {String(request.request_message || "-")}
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.central.solicitacoes.ver") {
    const item = asRecord(data.requestItem);
    return moduleShowPage({
      backHref: "/central/solicitacoes",
      description: "Visualização administrativa completa da proposta recebida.",
      headerIcon: "eye",
      headerTitle: "Ver solicitação",
      items: [
        { label: "Razão social", value: String(item.legal_name || "-") },
        {
          label: "Nome fantasia",
          value: String(item.trade_name || item.company_name || "-"),
        },
        {
          label: "Documento",
          value: `${item.document_type ? `${String(item.document_type).toUpperCase()}: ` : ""}${String(item.company_document || "-")}`,
        },
        {
          label: "Cidade / UF",
          value:
            [String(item.city || ""), String(item.state || "")]
              .filter(Boolean)
              .join(" - ") || "-",
        },
        { label: "Contato principal", value: String(item.contact_name || "-") },
        {
          label: "Empreendedor / responsável",
          value: String(item.entrepreneur_name || "-"),
        },
        { label: "E-mail comercial", value: String(item.email || "-") },
        { label: "Telefone comercial", value: String(item.phone || "-") },
        { label: "WhatsApp", value: String(item.whatsapp || "-") },
        { label: "Website", value: String(item.website || "-") },
        {
          label: "Categorias de atuação",
          span: "full",
          value: Array.isArray(item.acting_categories)
            ? (item.acting_categories as string[]).join(", ")
            : "-",
        },
        {
          label: "Cidades de atuação",
          span: "full",
          value: Array.isArray(item.acting_cities)
            ? (item.acting_cities as string[]).join(", ")
            : "-",
        },
        {
          label: "Brindes mensais",
          span: "full",
          value: Array.isArray(item.monthly_gifts)
            ? (item.monthly_gifts as string[]).join(", ")
            : "-",
        },
        {
          label: "Resumo da proposta",
          span: "full",
          value: String(item.message || "-"),
        },
      ],
      meta: [
        { label: "Tipo", value: String(item.request_type_label || "-") },
        {
          label: "Contato",
          value: String(item.contact_name || item.entrepreneur_name || "-"),
        },
        { label: "Status", value: String(item.status_label || "-") },
        { label: "Recebido em", value: String(item.created_at || "-") },
      ],
      title: `Solicitação: ${String(item.company_name || "-")}`,
    });
  }

  if (view === "pages.central.repasses.ver") {
    const payout = asRecord(data.payout);
    return moduleShowPage({
      backHref: "/central/repasses",
      description: "Detalhamento de lote financeiro e comprovação operacional.",
      headerIcon: "eye",
      headerTitle: "Ver repasse",
      items: [
        { label: "Criado em", value: String(payout.created_at || "-") },
        { label: "Executado em", value: String(payout.executed_at || "-") },
        {
          label: "Observações",
          span: "full",
          value:
            "Use o módulo principal de repasses para executar e emitir comprovante.",
        },
      ],
      meta: [
        {
          label: "Beneficiário",
          value: String(payout.beneficiary_company_name || "-"),
        },
        { label: "Valor", value: String(payout.amount || "R$ 0,00") },
        { label: "Status", value: String(payout.status || "-") },
        {
          label: "Origem",
          value: String(payout.origin_company_name || "-"),
        },
      ],
      title: `Repasse #${String(payout.id || "0")}`,
    });
  }

  if (view === "pages.auth.company-user-invite-register") {
    return authCard({
      badge: "Convite de empresa",
      badgeIcon: "mail-plus",
      title: "Aceitar convite da empresa",
      description: `Empresa: ${String(data.companyName || "-")} | Acesso: ${String(data.accessLabel || "-")} | E-mail: ${String(data.inviteEmail || "-")}`,
      children: (
        <>
          <div className="mb-4 space-y-2">{flash(data)}</div>
          <BackendForm
            backendPath={`/convite/empresa/${String(data.token || "")}`}
            className="space-y-4"
          >
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Nome completo
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldName || "")}
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
                defaultChecked={boolish(data.oldPrivacyConsent)}
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
        </>
      ),
    });
  }

  if (view.startsWith("pages.auth.convite.empreendedor")) {
    const inviteInvalid = boolish(data.inviteInvalid);
    if (inviteInvalid) {
      return authCard({
        badge: "Convite indisponível",
        badgeIcon: "mail-search",
        title: String(data.inviteInvalidTitle || "Convite indisponível"),
        description: String(
          data.inviteInvalidMessage || "Este convite não pode mais ser usado.",
        ),
        children: (
          <a className="btn btn-primary" href="/login">
            Ir para o login
          </a>
        ),
      });
    }

    const isVendorInvite = data.isVendorInvite !== false;
    const cities = asRecord(data.cities);
    const categories = asRecord(data.categories);
    const oldMonthlyGifts = Array.isArray(data.oldMonthlyGifts)
      ? (data.oldMonthlyGifts as string[])
      : ["", ""];

    return authCard({
      badge: "Cadastro por convite",
      badgeIcon: "mail-plus",
      maxWidth: "max-w-5xl",
      title: `Cadastro de ${String(data.inviteTypeLabel || "empresa")} por convite`,
      description: `Link autenticado por token único. Válido até ${String(data.expiresAt || "-")} para ${String(data.inviteEmail || "-")}.`,
      children: (
        <>
          <div className="mb-4 space-y-3">{flash(data)}</div>
          <BackendForm
            backendPath={`/convite/empreendedor/${String(data.token || "")}`}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Razão social
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldLegalName || "")}
                name="legal_name"
                type="text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Nome fantasia
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldTradeName || "")}
                name="trade_name"
                required
                type="text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">Documento</span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldDocumentNumber || "")}
                name="document_number"
                type="text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Tipo de documento
              </span>
              <select
                className="select select-bordered w-full"
                defaultValue={String(data.oldDocumentType || "cnpj")}
                name="document_type"
              >
                <option value="cnpj">CNPJ</option>
                <option value="cpf">CPF</option>
              </select>
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                {isVendorInvite
                  ? "Nome do empreendedor"
                  : "Nome do responsável"}
              </span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldEntrepreneurName || "")}
                name="entrepreneur_name"
                required
                type="text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                E-mail do convite
              </span>
              <input
                className="input input-bordered w-full"
                readOnly
                type="email"
                value={String(data.inviteEmail || "")}
              />
            </label>
            {!boolish(data.hasExistingAccount) ? (
              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold">
                  Senha de acesso
                </span>
                <input
                  className="input input-bordered w-full"
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
              </label>
            ) : (
              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 text-sm text-base-content/75">
                A senha da conta atual será mantida.
              </div>
            )}
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">Telefone</span>
              <input
                className="input input-bordered w-full"
                defaultValue={String(data.oldPhone || "")}
                name="phone"
                type="text"
              />
            </label>
            {isVendorInvite ? (
              <>
                <label className="form-control w-full md:col-span-2">
                  <span className="label-text mb-1 font-semibold">
                    Municípios de atuação
                  </span>
                  <select
                    className="select select-bordered min-h-40 w-full"
                    defaultValue={
                      Array.isArray(data.oldCityIds)
                        ? (data.oldCityIds as string[])
                        : []
                    }
                    multiple
                    name="city_ids[]"
                  >
                    {Object.entries(cities).map(([key, label]) => (
                      <option key={key} value={key}>
                        {String(label)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control w-full md:col-span-2">
                  <span className="label-text mb-1 font-semibold">
                    Categorias de atuação
                  </span>
                  <select
                    className="select select-bordered min-h-40 w-full"
                    defaultValue={
                      Array.isArray(data.oldCategoryIds)
                        ? (data.oldCategoryIds as string[])
                        : []
                    }
                    multiple
                    name="category_ids[]"
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>
                        {String(label)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Brinde mensal 1
                  </span>
                  <input
                    className="input input-bordered w-full"
                    defaultValue={String(oldMonthlyGifts[0] || "")}
                    name="monthly_gifts[]"
                    type="text"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Brinde mensal 2
                  </span>
                  <input
                    className="input input-bordered w-full"
                    defaultValue={String(oldMonthlyGifts[1] || "")}
                    name="monthly_gifts[]"
                    type="text"
                  />
                </label>
              </>
            ) : null}
            {[
              ["website", "Website", data.oldWebsite],
              ["instagram", "Instagram", data.oldInstagram],
              ["facebook", "Facebook", data.oldFacebook],
              ["linkedin", "LinkedIn", data.oldLinkedin],
              ["youtube", "YouTube", data.oldYoutube],
            ].map(([name, label, value]) => (
              <label key={String(name)} className="form-control w-full">
                <span className="label-text mb-1 font-semibold">
                  {String(label)}
                </span>
                <input
                  className="input input-bordered w-full"
                  defaultValue={String(value || "")}
                  name={String(name)}
                  type="url"
                />
              </label>
            ))}
            <label className="form-control w-full md:col-span-2">
              <span className="label-text mb-1 font-semibold">Descrição</span>
              <textarea
                className="textarea textarea-bordered min-h-24 w-full"
                defaultValue={String(data.oldDescription || "")}
                name="description"
              />
            </label>
            <label className="form-control w-full md:col-span-2">
              <span className="label-text mb-1 font-semibold">Serviços</span>
              <textarea
                className="textarea textarea-bordered min-h-24 w-full"
                defaultValue={String(data.oldServicesText || "")}
                name="services_text"
              />
            </label>
            <label className="form-control w-full md:col-span-2">
              <span className="label-text mb-1 font-semibold">Produtos</span>
              <textarea
                className="textarea textarea-bordered min-h-24 w-full"
                defaultValue={String(data.oldProductsText || "")}
                name="products_text"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">Logo</span>
              <input
                className="file-input file-input-bordered w-full"
                name="logo_image"
                type="file"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">Banner</span>
              <input
                className="file-input file-input-bordered w-full"
                name="banner_image"
                type="file"
              />
            </label>
            <label className="form-control w-full md:col-span-2">
              <span className="label-text mb-1 font-semibold">Galeria</span>
              <input
                className="file-input file-input-bordered w-full"
                multiple
                name="gallery_images[]"
                type="file"
              />
            </label>
            <label className="form-control w-full md:col-span-2">
              <span className="label-text mb-1 font-semibold">
                Vídeo de apresentação
              </span>
              <input
                className="file-input file-input-bordered w-full"
                name="intro_video"
                type="file"
              />
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3 md:col-span-2">
              <input
                className="checkbox checkbox-primary mt-0.5"
                defaultChecked={boolish(data.oldPrivacyConsent)}
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
        </>
      ),
    });
  }

  if (view === "pages.account.settings") {
    const profile = asRecord(data.profile);
    const themeOptions = asRecord(data.themeOptions);
    return (
      <DashboardShell
        headerIcon="settings"
        headerTitle="Configurações da conta"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Minha conta"
      >
        <main className="mx-auto max-w-4xl py-6">
          <section className="mb-5 flex items-center justify-between rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
            <div>
              <h1 className="text-xl font-bold">Configurações da conta</h1>
              <p className="text-sm text-base-content/70">
                Atualize seus dados pessoais, imagem e tema da interface.
              </p>
            </div>
          </section>
          <div className="mb-4 space-y-2">{flash(data)}</div>
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <BackendForm backendPath="/configuracoes" className="space-y-4">
                <div className="flex items-center gap-3">
                  {profile.profile_image_url ? (
                    <img
                      alt="Imagem de perfil"
                      className="h-16 w-16 rounded-full border border-base-300 object-cover"
                      src={String(profile.profile_image_url)}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-base-300 text-xs text-base-content/60">
                      Sem foto
                    </div>
                  )}
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Imagem de perfil
                    </span>
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      className="file-input file-input-bordered w-full"
                      name="profile_image"
                      type="file"
                    />
                  </label>
                </div>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">Nome</span>
                  <input
                    className="input input-bordered w-full"
                    defaultValue={String(profile.name || "")}
                    name="name"
                    required
                    type="text"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">E-mail</span>
                  <input
                    className="input input-bordered w-full"
                    readOnly
                    type="email"
                    value={String(profile.email || "")}
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Tema do site
                  </span>
                  <select
                    className="select select-bordered w-full"
                    defaultValue={String(
                      profile.preferred_theme || "clubemp-luxe",
                    )}
                    name="preferred_theme"
                  >
                    {Object.entries(themeOptions).map(([key, label]) => (
                      <option key={key} value={key}>
                        {String(label)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Nova senha
                  </span>
                  <input
                    className="input input-bordered w-full"
                    minLength={8}
                    name="password"
                    type="password"
                  />
                </label>
                <button className="btn btn-primary w-full" type="submit">
                  Salvar configurações
                </button>
              </BackendForm>
            </div>
          </section>
        </main>
      </DashboardShell>
    );
  }

  if (view === "pages.account.add-company") {
    const ownedCompanyTypes = Array.isArray(data.ownedCompanyTypes)
      ? (data.ownedCompanyTypes as string[])
      : [];
    const invites = asRecordArray(data.invites);
    const prefill = asRecord(data.prefill);
    const canRequestBoth = boolish(data.canRequestBoth);
    const defaultRequestMode = String(data.defaultRequestMode || "conveniada");
    const monthlyGifts = Array.isArray(prefill.monthly_gifts)
      ? (prefill.monthly_gifts as string[])
      : ["", ""];
    return (
      <DashboardShell
        headerIcon="building-2"
        headerTitle="Adicionar empresa"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Expansão da conta"
      >
        <main className="mx-auto w-full max-w-5xl py-6">
          <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-black text-base-content">
                  Status atual da conta
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge badge-primary badge-outline">
                    Modo cliente
                  </span>
                  {ownedCompanyTypes.length === 0 ? (
                    <span className="badge badge-ghost">
                      Nenhuma empresa própria ativa
                    </span>
                  ) : (
                    ownedCompanyTypes.map((type) => (
                      <span
                        key={type}
                        className="badge badge-secondary badge-outline"
                      >
                        {type === "conveniada"
                          ? "Empresa conveniada própria"
                          : "Empresa empreendedora própria"}
                      </span>
                    ))
                  )}
                </div>
              </article>
              <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h2 className="text-lg font-black text-base-content">
                  Convites pendentes
                </h2>
                {invites.length === 0 ? (
                  <p className="mt-4 text-sm text-base-content/65">
                    Nenhum convite de empresa pendente foi encontrado para este
                    e-mail.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {invites.map((invite) => (
                      <div
                        key={String(
                          invite.id ||
                            invite.expires_at ||
                            JSON.stringify(invite),
                        )}
                        className="rounded-2xl border border-warning/30 bg-warning/10 p-4"
                      >
                        <p className="font-semibold text-base-content">
                          {String(invite.invite_type_label || "-")}
                        </p>
                        <p className="mt-1 text-sm text-base-content/70">
                          Convite ainda aguardando conclusão.
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-base-content/50">
                          Expira em {String(invite.expires_at || "-")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>

            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <div className="mb-5 space-y-2">
                <h2 className="text-xl font-black text-base-content">
                  Solicitação interna
                </h2>
              </div>
              <BackendForm
                backendPath="/empresas/adicionar"
                className="grid gap-5"
              >
                <div
                  className={
                    canRequestBoth
                      ? "grid gap-3 sm:grid-cols-3"
                      : "grid gap-3 sm:grid-cols-2"
                  }
                >
                  {[
                    ["conveniada", "Conveniada"],
                    ["empreendedora", "Empreendedora"],
                    ...(canRequestBoth ? [["ambas", "As duas"]] : []),
                  ].map(([value, label]) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        className="peer sr-only"
                        defaultChecked={defaultRequestMode === value}
                        name="request_mode"
                        type="radio"
                        value={value}
                      />
                      <span className="flex h-full items-center justify-center rounded-2xl border border-base-300 px-4 py-4 text-center text-sm font-black uppercase tracking-[0.18em] transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-content">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      name: "legal_name",
                      label: "Razão social",
                      required: false,
                    },
                    {
                      name: "trade_name",
                      label: "Nome fantasia",
                      required: true,
                    },
                    {
                      name: "company_document",
                      label: "Documento",
                      required: false,
                    },
                    {
                      name: "contact_name",
                      label: "Contato responsável",
                      required: true,
                    },
                    {
                      name: "entrepreneur_name",
                      label: "Nome do empreendedor",
                      required: false,
                    },
                    { name: "whatsapp", label: "WhatsApp", required: false },
                    { name: "website", label: "Website", required: false },
                    { name: "city", label: "Cidade", required: false },
                    { name: "state", label: "Estado", required: false },
                  ].map((field) => (
                    <label key={field.name} className="form-control w-full">
                      <span className="label-text mb-1 font-semibold">
                        {field.label}
                      </span>
                      <input
                        className="input input-bordered w-full"
                        defaultValue={String(prefill[field.name] || "")}
                        name={field.name}
                        required={field.required}
                        type="text"
                      />
                    </label>
                  ))}
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      E-mail da conta
                    </span>
                    <input
                      className="input input-bordered w-full"
                      readOnly
                      type="email"
                      value={String(prefill.email || "")}
                    />
                  </label>
                </div>
                <div className="grid gap-4 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 md:grid-cols-2">
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Brinde mensal 1
                    </span>
                    <input
                      className="input input-bordered w-full"
                      defaultValue={String(monthlyGifts[0] || "")}
                      name="monthly_gifts[]"
                      type="text"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Brinde mensal 2
                    </span>
                    <input
                      className="input input-bordered w-full"
                      defaultValue={String(monthlyGifts[1] || "")}
                      name="monthly_gifts[]"
                      type="text"
                    />
                  </label>
                </div>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Proposta ou observações
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-28 w-full"
                    defaultValue={String(prefill.message || "")}
                    name="message"
                    required
                  />
                </label>
                <label className="label cursor-pointer justify-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4">
                  <input
                    className="checkbox checkbox-primary"
                    defaultChecked
                    name="annual_fee_acknowledged"
                    type="checkbox"
                    value="1"
                  />
                  <span className="label-text text-sm leading-relaxed">
                    Confirmo que entendo que a solicitação será avaliada
                    internamente.
                  </span>
                </label>
                <label className="label cursor-pointer justify-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4">
                  <input
                    className="checkbox checkbox-primary"
                    defaultChecked
                    name="privacy_consent"
                    type="checkbox"
                    value="1"
                  />
                  <span className="label-text text-sm leading-relaxed">
                    Li e concordo com a política de privacidade.
                  </span>
                </label>
                <button className="btn btn-primary w-full" type="submit">
                  Enviar solicitação interna
                </button>
              </BackendForm>
            </article>
          </section>
        </main>
      </DashboardShell>
    );
  }

  if (view === "pages.account.card") {
    const card = asRecord(data.card);
    const notifications = asRecordArray(data.notifications);
    return (
      <DashboardShell
        activeMenu="card"
        headerIcon="qr-code"
        headerTitle="Meu cartão Clubemp"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Portal do cliente"
      >
        <main className="mx-auto w-full max-w-6xl py-8">
          <article className="overflow-hidden rounded-[2rem] border border-primary/20 bg-base-100 shadow-xl">
            <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:p-8">
              <div className="rounded-3xl border border-primary/20 bg-[#141008] p-6 text-white shadow-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                  Cartão Clubemp
                </p>
                <h2 className="mt-4 text-3xl font-black">
                  {String(card.holder_name || "")}
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  {String(card.card_type_label || card.card_type || "")}
                </p>
                <p className="mt-6 font-mono text-sm tracking-[0.25em]">
                  {String(card.card_code || "")}
                </p>
              </div>
              <div className="space-y-5">
                <div className="rounded-3xl border border-base-300 bg-base-200/40 p-5">
                  <p className="text-sm text-base-content/70">
                    {String(card.holder_label || "Conta")}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold">
                    {String(card.holder_name || "")}
                  </h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-base-content/50">
                        Tipo do cartão
                      </dt>
                      <dd className="font-semibold">
                        {String(card.card_type_label || card.card_type || "")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-base-content/50">
                        Código
                      </dt>
                      <dd className="break-all font-mono font-semibold">
                        {String(card.card_code || "")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-wide text-base-content/50">
                        Status
                      </dt>
                      <dd className="font-semibold">
                        {String(card.status_label || "")}
                      </dd>
                    </div>
                  </dl>
                  {card.public_url ? (
                    <a
                      className="link link-primary mt-4 inline-block text-sm font-semibold"
                      href={String(card.public_url)}
                    >
                      Ver página pública vinculada
                    </a>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <a
                    className="btn btn-secondary btn-sm"
                    href="/minhas-compras"
                  >
                    Ver minhas compras
                  </a>
                  {data.qrImageUrl ? (
                    <a
                      className="btn btn-primary btn-sm"
                      download="clubemp-qr.png"
                      href={String(data.qrImageUrl)}
                    >
                      Baixar QR PNG
                    </a>
                  ) : null}
                  {data.qrTargetUrl ? (
                    <a
                      className="btn btn-outline btn-sm"
                      href={String(data.qrTargetUrl)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Abrir validação pública
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
          <section className="mt-6">
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="bell" /> Notificações
                  internas
                </h2>
                {notifications.length === 0 ? (
                  <p className="text-sm text-base-content/70">
                    Nenhuma notificação recente.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <div
                        key={String(
                          notification.id ||
                            notification.created_at ||
                            JSON.stringify(notification),
                        )}
                        className="rounded-xl border border-base-300 bg-base-200/40 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">
                            {String(notification.title || "-")}
                          </p>
                          <span className="text-xs text-base-content/65">
                            {String(notification.created_at || "-")}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/80">
                          {String(notification.message || "-")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </section>
        </main>
      </DashboardShell>
    );
  }

  if (view === "pages.account.purchases") {
    const summary = asRecord(data.summary);
    const purchases = asRecordArray(data.purchases);
    const supportBySale = asRecord(data.supportBySale);
    return (
      <DashboardShell
        activeMenu="purchases"
        headerIcon="receipt"
        headerTitle="Minhas compras"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Portal do cliente"
      >
        <main className="mx-auto w-full max-w-5xl py-8">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Compras", String(summary.purchases_count || 0)],
              ["Pagas", String(summary.paid_count || 0)],
              ["Pendentes", String(summary.pending_count || 0)],
              ["Total gasto", String(summary.total_spent || "R$ 0,00")],
            ].map(([label, value]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4">
                  <p className="text-xs uppercase text-base-content/55">
                    {label}
                  </p>
                  <p className="text-2xl font-black">{value}</p>
                </div>
              </article>
            ))}
          </section>
          <section className="mt-6">
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="receipt" /> Histórico de
                  compras
                </h2>
                <div className="overflow-x-auto rounded-xl border border-base-300">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Data</th>
                        <th>Loja</th>
                        <th>Item</th>
                        <th>Qtd</th>
                        <th>Status</th>
                        <th>Pagamento</th>
                        <th>Total</th>
                        <th>Recibo</th>
                        <th>Atendimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.length === 0 ? (
                        <tr>
                          <td
                            className="text-center text-sm text-base-content/65"
                            colSpan={10}
                          >
                            Nenhuma compra registrada.
                          </td>
                        </tr>
                      ) : (
                        purchases.map((purchase) => {
                          const supportInfo = asRecord(
                            supportBySale[String(purchase.id || "")],
                          );
                          return (
                            <tr
                              key={String(
                                purchase.id || JSON.stringify(purchase),
                              )}
                            >
                              <td className="font-semibold">
                                #{String(purchase.id || "0")}
                              </td>
                              <td>{String(purchase.created_at || "-")}</td>
                              <td>{String(purchase.seller_name || "-")}</td>
                              <td>{String(purchase.item_name || "-")}</td>
                              <td>{String(purchase.quantity || "0")}</td>
                              <td>{String(purchase.status || "-")}</td>
                              <td>{String(purchase.payment_status || "-")}</td>
                              <td>
                                {String(purchase.total_amount || "R$ 0,00")}
                              </td>
                              <td>
                                {purchase.receipt_url ? (
                                  <a
                                    className="btn btn-xs btn-outline"
                                    href={String(purchase.receipt_url)}
                                  >
                                    Ver recibo
                                  </a>
                                ) : null}
                              </td>
                              <td className="min-w-64 space-y-2">
                                {Object.keys(supportInfo).length > 0 ? (
                                  <p className="text-xs text-base-content/70">
                                    Solicitação{" "}
                                    {String(supportInfo.request_type || "") ===
                                    "refund"
                                      ? "de reembolso"
                                      : "de suporte"}
                                    :{" "}
                                    <strong>
                                      {String(supportInfo.status || "-")}
                                    </strong>{" "}
                                    ({String(supportInfo.created_at || "-")})
                                  </p>
                                ) : null}
                                <div className="flex flex-wrap gap-2">
                                  <BackendForm
                                    backendPath={`/minhas-compras/${String(purchase.id || 0)}/suporte`}
                                    className="flex flex-wrap gap-2"
                                  >
                                    <input
                                      name="request_type"
                                      type="hidden"
                                      value="support"
                                    />
                                    <input
                                      className="input input-xs input-bordered w-40"
                                      minLength={10}
                                      name="message"
                                      placeholder="Descreva o suporte"
                                      required
                                      type="text"
                                    />
                                    <button
                                      className="btn btn-xs btn-ghost"
                                      type="submit"
                                    >
                                      Suporte
                                    </button>
                                  </BackendForm>
                                  <BackendForm
                                    backendPath={`/minhas-compras/${String(purchase.id || 0)}/suporte`}
                                    className="flex flex-wrap gap-2"
                                  >
                                    <input
                                      name="request_type"
                                      type="hidden"
                                      value="refund"
                                    />
                                    <input
                                      className="input input-xs input-bordered w-40"
                                      minLength={10}
                                      name="message"
                                      placeholder="Motivo do reembolso"
                                      required
                                      type="text"
                                    />
                                    <button
                                      className="btn btn-xs btn-warning"
                                      type="submit"
                                    >
                                      Reembolso
                                    </button>
                                  </BackendForm>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          </section>
        </main>
      </DashboardShell>
    );
  }

  if (view === "pages.customer.payments") {
    const paymentRequests = asRecordArray(data.paymentRequests);
    return (
      <DashboardShell
        activeMenu="payments"
        headerIcon="credit-card"
        headerTitle="Meus pagamentos"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Portal do cliente"
      >
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
                Pagamentos Clubemp
              </p>
              <h2 className="text-2xl font-black">Cobranças recebidas</h2>
              <p className="text-sm text-base-content/70">
                Acesse o link ou leia o QR Code recebido da empresa para
                concluir o pagamento com Stripe.
              </p>
            </div>
            <Link
              className="btn btn-primary"
              href="/minha-area/pagamentos/ler-qrcode"
            >
              <LucideIcon className="h-4 w-4" name="scan-qr-code" />
              Ler QR Code
            </Link>
          </div>
        </section>
        <section className="mt-5">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Histórico</h2>
              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Empresa</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRequests.length === 0 ? (
                      <tr>
                        <td
                          className="text-center text-sm text-base-content/65"
                          colSpan={6}
                        >
                          Nenhuma cobrança vinculada ao seu usuário.
                        </td>
                      </tr>
                    ) : (
                      paymentRequests.map((item) => (
                        <tr key={String(item.id || JSON.stringify(item))}>
                          <td className="font-semibold">
                            #{String(item.id || "0")}
                          </td>
                          <td>{String(item.company_name || "-")}</td>
                          <td>{String(item.description || "-")}</td>
                          <td>{String(item.amount_label || "-")}</td>
                          <td>
                            <span className="badge badge-outline">
                              {String(item.status_label || "-")}
                            </span>
                          </td>
                          <td>
                            {String(item.payment_url || "") ? (
                              <Link
                                className={`btn btn-xs ${["pending", "requires_payment_method", "processing"].includes(String(item.status || "")) ? "btn-primary" : "btn-ghost"}`}
                                href={String(item.payment_url || "#")}
                              >
                                {[
                                  "pending",
                                  "requires_payment_method",
                                  "processing",
                                ].includes(String(item.status || ""))
                                  ? "Pagar"
                                  : "Ver"}
                              </Link>
                            ) : (
                              <span className="text-xs text-base-content/55">
                                Sem link disponível
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.customer.payment-scanner") {
    return (
      <DashboardShell
        activeMenu="payment-scanner"
        headerIcon="scan-qr-code"
        headerTitle="Ler QR Code"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Portal do cliente"
      >
        <div className="py-4">
          <PaymentScanner />
        </div>
      </DashboardShell>
    );
  }

  if (view === "pages.payments.show") {
    const paymentRequest = asRecord(data.paymentRequest);
    const status = String(paymentRequest.status || "pending");
    const canPay = [
      "pending",
      "requires_payment_method",
      "processing",
    ].includes(status);
    const token = currentPath.split("/").pop() || "";
    return (
      <main className="min-h-screen bg-base-200 px-4 py-8">
        <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
              Pagamento seguro
            </p>
            <h1 className="mt-2 text-3xl font-black">Cobrança Clubemp</h1>
            <p className="mt-2 text-base-content/70">
              Confira os dados antes de concluir o pagamento.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-base-200 p-4">
                <p className="text-xs uppercase text-base-content/55">
                  Empresa
                </p>
                <p className="font-bold">
                  {String(paymentRequest.company_name || "-")}
                </p>
              </div>
              <div className="rounded-2xl bg-base-200 p-4">
                <p className="text-xs uppercase text-base-content/55">Valor</p>
                <p className="font-bold">
                  {String(paymentRequest.amount_label || "-")}
                </p>
              </div>
              <div className="rounded-2xl bg-base-200 p-4 sm:col-span-2">
                <p className="text-xs uppercase text-base-content/55">
                  Descrição
                </p>
                <p className="font-bold">
                  {String(paymentRequest.description || "-")}
                </p>
              </div>
            </div>
            {!canPay ? (
              <div className="alert alert-info mt-6">
                <span>
                  Esta cobrança está com status:{" "}
                  {String(paymentRequest.status_label || status)}.
                </span>
              </div>
            ) : (
              <StripePaymentForm
                amountLabel={String(paymentRequest.amount_label || "")}
                token={token}
              />
            )}
          </article>
          <aside className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
              QR Code
            </p>
            <div className="mt-4 rounded-2xl border border-base-300 bg-white p-4">
              {paymentRequest.qrcode_data_uri ? (
                <img
                  alt="QR Code do pagamento"
                  className="mx-auto h-auto w-full max-w-[260px]"
                  src={String(paymentRequest.qrcode_data_uri)}
                />
              ) : null}
            </div>
            <p className="mt-4 break-all text-sm text-base-content/70">
              {String(paymentRequest.payment_url || "")}
            </p>
          </aside>
        </section>
      </main>
    );
  }

  if (view === "pages.company.change-password") {
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
            <div className="mt-4 space-y-3">{flash(data)}</div>
            <BackendForm
              backendPath="/meu-espaco/senha"
              className="mt-5 grid gap-4"
            >
              <label className="form-control">
                <span className="label-text mb-1 font-semibold">
                  Nova senha
                </span>
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

  if (view === "pages.company.portal") {
    const tenant = (data.tenant as Record<string, unknown>) || {};
    const notifications = Array.isArray(data.notifications)
      ? data.notifications
      : [];
    const vendorFinanceSummary =
      (data.vendorFinanceSummary as Record<string, string>) || {};
    return (
      <DashboardShell
        activeMenu="overview"
        headerIcon="layout-dashboard"
        headerTitle="Meu espaço"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-base-content/60">
                Portal da empresa
              </p>
              <h2 className="text-2xl font-black">
                {String(tenant.name || "Empresa")}
              </h2>
              <p className="text-sm text-base-content/70">
                Gestão separada por módulos para perfil, associados, notícias e
                catálogo.
              </p>
            </div>
          </div>
        </section>
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "/meu-espaco/perfil",
              "Perfil",
              "Empresa",
              "Dados institucionais e mídia",
            ],
            [
              "/meu-espaco/compras",
              "Compras",
              String(
                (data.companySalesSummary as Record<string, string>)
                  ?.sales_count || 0,
              ),
              "Histórico e estatísticas",
            ],
            [
              "/meu-espaco/noticias",
              "Notícias",
              String(data.newsCount || 0),
              "Publicações da empresa",
            ],
          ].map(([href, label, value, help]) => (
            <a
              key={href}
              className="card border border-base-300 bg-base-100 shadow-sm hover:border-primary"
              href={href}
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-sm text-base-content/70">{help}</p>
              </div>
            </a>
          ))}
        </section>
        <section className="mt-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="bell" /> Notificações
                internas
              </h2>
              {notifications.length === 0 ? (
                <p className="text-sm text-base-content/70">
                  Sem notificações recentes.
                </p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => {
                    const item = notification as Record<string, unknown>;
                    const notificationKey = [
                      String(item.title || ""),
                      String(item.created_at || ""),
                      String(item.message || ""),
                    ].join("|");
                    return (
                      <div
                        key={notificationKey}
                        className="rounded-xl border border-base-300 bg-base-200/40 p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">
                            {String(item.title || "-")}
                          </p>
                          <span className="text-xs text-base-content/65">
                            {String(item.created_at || "-")}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/80">
                          {String(item.message || "-")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </article>
        </section>
        {Object.keys(vendorFinanceSummary).length > 0 ? (
          <section className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              [
                "Vendas totais",
                vendorFinanceSummary.sales_total || "-",
                `${vendorFinanceSummary.sales_count || 0} vendas registradas`,
              ],
              [
                "Repasses devidos",
                vendorFinanceSummary.pending_commissions_total || "-",
                `${vendorFinanceSummary.pending_commissions_count || 0} repasses pendentes`,
              ],
              [
                "Saldo líquido",
                vendorFinanceSummary.net_total || "-",
                "Vendas totais menos repasses pendentes",
              ],
            ].map(([label, value, help]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4">
                  <p className="text-xs uppercase text-base-content/55">
                    {label}
                  </p>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-base-content/65">{help}</p>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-profile") {
    const tenant = asRecord(data.tenant);
    const isVendorTenant = String(tenant.card_type || "") === "empreendedor";
    const hasValeriaVazSeal = String(tenant.seal_label || "") === "Valéria Vaz";
    const allCities = asRecord(data.all_cities);
    const allCategories = asRecord(data.all_categories);
    const monthlyGifts = Array.isArray(tenant.monthly_gifts)
      ? (tenant.monthly_gifts as string[])
      : ["", ""];
    return (
      <DashboardShell
        activeMenu="profile"
        headerIcon="building-2"
        headerTitle="Perfil da empresa"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="mt-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body gap-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="building-2" /> Perfil da
                  empresa
                </h2>
                <span className="badge badge-outline">
                  {String(tenant.status_label || "Ativa")}
                </span>
              </div>
              {tenant.banner_path ? (
                <img
                  alt="Banner da empresa"
                  className="h-36 w-full rounded-xl object-cover"
                  src={String(tenant.banner_path)}
                />
              ) : null}
              <BackendForm
                backendPath="/meu-espaco/perfil"
                className="grid gap-4 md:grid-cols-2"
              >
                <label className="form-control">
                  <span className="label-text font-semibold">
                    Tipo de documento
                  </span>
                  <select
                    className="select select-bordered w-full"
                    defaultValue={String(tenant.document_type || "cnpj")}
                    name="document_type"
                  >
                    <option value="cnpj">CNPJ</option>
                    <option value="cpf">CPF</option>
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Documento</span>
                  <input
                    className="input input-bordered w-full"
                    defaultValue={String(tenant.document_number || "")}
                    name="document_number"
                    type="text"
                  />
                </label>
                {[
                  ["legal_name", "Nome jurídico / razão social"],
                  ["trade_name", "Nome fantasia"],
                  [
                    "entrepreneur_name",
                    isVendorTenant ? "Sócio empreendedor" : "Sócio conveniado",
                  ],
                  [
                    "entrepreneur_email",
                    isVendorTenant
                      ? "E-mail do sócio empreendedor"
                      : "E-mail do sócio conveniado",
                  ],
                  [
                    "entrepreneur_phone",
                    isVendorTenant
                      ? "Telefone do sócio empreendedor"
                      : "Telefone do sócio conveniado",
                  ],
                  ["contact_email", "E-mail institucional"],
                  ["contact_phone", "Telefone institucional"],
                  ["city", "Cidade sede"],
                  ["state", "Estado sede"],
                ].map(([name, label]) => (
                  <label key={name} className="form-control">
                    <span className="label-text font-semibold">
                      {String(label)}
                    </span>
                    <input
                      className="input input-bordered w-full"
                      defaultValue={String(tenant[name] || "")}
                      name={String(name)}
                      type="text"
                    />
                  </label>
                ))}
                {isVendorTenant ? (
                  <>
                    <label className="form-control md:col-span-2">
                      <span className="label-text font-semibold">
                        Municípios de atuação
                      </span>
                      <select
                        className="select select-bordered min-h-40 w-full"
                        defaultValue={
                          Array.isArray(tenant.acting_cities)
                            ? (tenant.acting_cities as string[])
                            : []
                        }
                        multiple
                        name="city_ids[]"
                      >
                        {Object.entries(allCities).map(([key, label]) => (
                          <option key={key} value={key}>
                            {String(label)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="form-control md:col-span-2">
                      <span className="label-text font-semibold">
                        Categorias de atuação
                      </span>
                      <select
                        className="select select-bordered min-h-40 w-full"
                        defaultValue={
                          Array.isArray(tenant.acting_categories)
                            ? (tenant.acting_categories as string[])
                            : []
                        }
                        multiple
                        name="category_ids[]"
                      >
                        {Object.entries(allCategories).map(([key, label]) => (
                          <option key={key} value={key}>
                            {String(label)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="form-control">
                      <span className="label-text font-semibold">
                        Brinde mensal 1
                      </span>
                      <input
                        className="input input-bordered w-full"
                        defaultValue={String(monthlyGifts[0] || "")}
                        name="monthly_gifts[]"
                        type="text"
                      />
                    </label>
                    <label className="form-control">
                      <span className="label-text font-semibold">
                        Brinde mensal 2
                      </span>
                      <input
                        className="input input-bordered w-full"
                        defaultValue={String(monthlyGifts[1] || "")}
                        name="monthly_gifts[]"
                        type="text"
                      />
                    </label>
                  </>
                ) : null}
                {[
                  ["description", "Descrição institucional"],
                  ["services_text", "Serviços"],
                  ["products_text", "Produtos institucionais"],
                ].map(([name, label]) => (
                  <label key={name} className="form-control md:col-span-2">
                    <span className="label-text font-semibold">
                      {String(label)}
                    </span>
                    <textarea
                      className="textarea textarea-bordered min-h-24 w-full"
                      defaultValue={String(tenant[name] || "")}
                      name={String(name)}
                    />
                  </label>
                ))}
                <label className="form-control">
                  <span className="label-text font-semibold">Logo</span>
                  <input
                    className="file-input file-input-bordered w-full"
                    name="logo"
                    type="file"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">
                    Banner da página
                  </span>
                  <input
                    className="file-input file-input-bordered w-full"
                    name="banner"
                    type="file"
                  />
                </label>
                {hasValeriaVazSeal ? (
                  <label className="form-control md:col-span-2">
                    <span className="label-text font-semibold">
                      Banner de marketing Valéria Vaz
                    </span>
                    <input
                      className="file-input file-input-bordered w-full"
                      name="marketing_banner"
                      type="file"
                    />
                  </label>
                ) : null}
                <label className="form-control md:col-span-2">
                  <span className="label-text font-semibold">
                    Vídeo de apresentação
                  </span>
                  <input
                    className="file-input file-input-bordered w-full"
                    name="intro_video"
                    type="file"
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text font-semibold">Galeria</span>
                  <input
                    className="file-input file-input-bordered w-full"
                    multiple
                    name="gallery_images[]"
                    type="file"
                  />
                </label>
                {[
                  ["social_website", "Site"],
                  ["social_instagram", "Instagram"],
                  ["social_linkedin", "LinkedIn"],
                  ["social_facebook", "Facebook"],
                  ["social_youtube", "YouTube"],
                ].map(([name, label]) => (
                  <label key={name} className="form-control">
                    <span className="label-text font-semibold">
                      {String(label)}
                    </span>
                    <input
                      className="input input-bordered w-full"
                      defaultValue={String(tenant[name] || "")}
                      name={String(name)}
                      type="url"
                    />
                  </label>
                ))}
                <button className="btn btn-primary md:col-span-2" type="submit">
                  Salvar perfil da empresa
                </button>
              </BackendForm>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-associates") {
    const isCompanyPartner = boolish(data.isCompanyPartner);
    const commissionSummary = asRecord(data.partnerCommissionSummary);
    const associatedCustomers = asRecordArray(data.associatedCustomers);
    const associatedCount = Number(data.associatedCustomersCount || 0);
    const commissionPeriodOptions = asRecord(data.commissionPeriodOptions);
    const associatedFilters = asRecord(data.associatedFilters);
    const associatedStatusOptions = asRecord(data.associatedStatusOptions);
    return (
      <DashboardShell
        activeMenu="associates"
        headerIcon="users"
        headerTitle="Associados"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        {!isCompanyPartner ? (
          <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 text-sm text-base-content/75 shadow-sm">
            Este módulo está disponível apenas para empresas conveniadas.
          </section>
        ) : (
          <>
            <section className="mt-4">
              <article className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="card-title text-base">
                      <LucideIcon className="h-4 w-4" name="hand-coins" />
                      Comissões a receber
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(commissionPeriodOptions).map(
                        ([key, label]) => (
                          <a
                            key={key}
                            className={`btn btn-xs ${String(data.commissionPeriod || "30d") === key ? "btn-primary" : "btn-outline"}`}
                            href={`/meu-espaco/associados?commission_period=${encodeURIComponent(key)}`}
                          >
                            {String(label)}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
                      <p className="text-xs uppercase text-base-content/60">
                        Total pendente
                      </p>
                      <p className="text-2xl font-black">
                        {String(commissionSummary.pending_total || "R$ 0,00")}
                      </p>
                    </div>
                    <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
                      <p className="text-xs uppercase text-base-content/60">
                        Por associado
                      </p>
                      <div className="space-y-2">
                        {asRecordArray(
                          commissionSummary.associated_breakdown,
                        ).map((associatedCommission) => (
                          <div
                            key={String(
                              associatedCommission.name ||
                                JSON.stringify(associatedCommission),
                            )}
                            className="flex items-center justify-between gap-2 text-sm"
                          >
                            <span className="font-semibold">
                              {String(associatedCommission.name || "-")}
                            </span>
                            <span className="badge badge-outline">
                              {String(associatedCommission.total || "R$ 0,00")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>
            <section className="mt-4">
              <article className="card border border-base-300 bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title text-base">
                    <LucideIcon className="h-4 w-4" name="user-plus" />
                    Cadastrar associado
                  </h2>
                  <div className="mb-4 rounded-xl border border-base-300 bg-base-200/40 p-4">
                    <p className="text-sm text-base-content/75">
                      Código de convite:{" "}
                      <span className="badge badge-primary">
                        {String(data.associatedInviteCode || "")}
                      </span>
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
                    <BackendForm
                      backendPath="/meu-espaco/associados"
                      className="space-y-3"
                    >
                      <label className="form-control">
                        <span className="label-text font-semibold">Nome</span>
                        <input
                          className="input input-bordered"
                          name="name"
                          required
                          type="text"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text font-semibold">E-mail</span>
                        <input
                          className="input input-bordered"
                          name="email"
                          required
                          type="email"
                        />
                      </label>
                      <label className="form-control">
                        <span className="label-text font-semibold">
                          Telefone
                        </span>
                        <input
                          className="input input-bordered"
                          name="phone"
                          type="text"
                        />
                      </label>
                      <button
                        className="btn btn-primary btn-block"
                        type="submit"
                      >
                        Cadastrar associado
                      </button>
                    </BackendForm>
                    <div className="space-y-4">
                      <form
                        action="/meu-espaco/associados"
                        className="grid gap-3 rounded-xl border border-base-300 bg-base-200/40 p-3 md:grid-cols-4"
                        method="get"
                      >
                        <input
                          name="commission_period"
                          type="hidden"
                          value={String(data.commissionPeriod || "30d")}
                        />
                        <label className="form-control md:col-span-2">
                          <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                            Buscar
                          </span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(
                              associatedFilters.search || "",
                            )}
                            name="associated_search"
                            placeholder="Ex: Maria"
                            type="text"
                          />
                        </label>
                        <label className="form-control">
                          <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                            Status
                          </span>
                          <select
                            className="select select-bordered select-sm"
                            defaultValue={String(
                              associatedFilters.status || "all",
                            )}
                            name="associated_status"
                          >
                            {Object.entries(associatedStatusOptions).map(
                              ([key, label]) => (
                                <option key={key} value={key}>
                                  {String(label)}
                                </option>
                              ),
                            )}
                          </select>
                        </label>
                        <div className="flex items-end gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            type="submit"
                          >
                            Filtrar
                          </button>
                        </div>
                      </form>
                      {associatedCount === 0 ? (
                        <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
                          Nenhum associado cadastrado ainda.
                        </div>
                      ) : (
                        associatedCustomers.map((associated) => (
                          <div
                            key={String(
                              associated.id || JSON.stringify(associated),
                            )}
                            className="rounded-xl border border-base-300 bg-base-200/40 p-4"
                          >
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <h3 className="font-bold">
                                  {String(associated.full_name || "-")}
                                </h3>
                                <p className="text-xs text-base-content/65">
                                  {String(associated.email || "-")}
                                </p>
                              </div>
                              <span className="badge badge-outline">
                                {String(associated.status_label || "Ativo")}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <BackendForm
                                backendPath={`/meu-espaco/associados/${String(associated.id || 0)}/status`}
                              >
                                <button
                                  className="btn btn-sm btn-outline"
                                  type="submit"
                                >
                                  {String(associated.status || "active") ===
                                  "blocked"
                                    ? "Desbloquear"
                                    : "Bloquear"}
                                </button>
                              </BackendForm>
                              <BackendForm
                                backendPath={`/meu-espaco/associados/${String(associated.id || 0)}/reset-senha`}
                              >
                                <button
                                  className="btn btn-sm btn-outline"
                                  type="submit"
                                >
                                  Resetar senha
                                </button>
                              </BackendForm>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </section>
          </>
        )}
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-news") {
    const news = asRecordArray(data.news);
    return (
      <DashboardShell
        activeMenu="news"
        headerIcon="newspaper"
        headerTitle="Notícias"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-1">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="newspaper" /> Nova notícia
              </h2>
              <BackendForm
                backendPath="/meu-espaco/noticias"
                className="space-y-3"
              >
                <label className="form-control">
                  <span className="label-text font-semibold">Título</span>
                  <input
                    className="input input-bordered"
                    name="title"
                    required
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Resumo</span>
                  <input
                    className="input input-bordered"
                    name="summary"
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">
                    Data de publicação
                  </span>
                  <input
                    className="input input-bordered"
                    name="published_at"
                    type="datetime-local"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Conteúdo</span>
                  <textarea
                    className="textarea textarea-bordered min-h-28"
                    name="content"
                    required
                  />
                </label>
                <button className="btn btn-primary btn-block" type="submit">
                  Publicar notícia
                </button>
              </BackendForm>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="newspaper" /> Notícias da
                empresa ({String(data.newsCount || news.length)})
              </h2>
              <div className="space-y-4">
                {news.length === 0 ? (
                  <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
                    Nenhuma notícia publicada ainda.
                  </div>
                ) : (
                  news.map((newsItem) => (
                    <div
                      key={String(newsItem.id || JSON.stringify(newsItem))}
                      className="rounded-xl border border-base-300 bg-base-200/40 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="font-bold">
                          {String(newsItem.title || "-")}
                        </h3>
                        <span className="badge badge-outline">
                          {String(newsItem.status_label || "-")}
                        </span>
                      </div>
                      <BackendForm
                        backendPath={`/meu-espaco/noticias/${String(newsItem.id || 0)}/atualizar`}
                        className="grid gap-3 md:grid-cols-2"
                      >
                        <label className="form-control md:col-span-2">
                          <span className="label-text">Título</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(newsItem.title || "")}
                            name="title"
                            required
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-2">
                          <span className="label-text">Resumo</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(newsItem.summary || "")}
                            name="summary"
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Publicação</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(
                              newsItem.published_at_input || "",
                            )}
                            name="published_at"
                            type="datetime-local"
                          />
                        </label>
                        <label className="form-control md:col-span-2">
                          <span className="label-text">Conteúdo</span>
                          <textarea
                            className="textarea textarea-bordered textarea-sm"
                            defaultValue={String(newsItem.content || "")}
                            name="content"
                            required
                          />
                        </label>
                        <div className="md:col-span-2">
                          <button
                            className="btn btn-sm btn-primary"
                            type="submit"
                          >
                            Salvar notícia
                          </button>
                        </div>
                      </BackendForm>
                      <BackendForm
                        backendPath={`/meu-espaco/noticias/${String(newsItem.id || 0)}/status`}
                        className="mt-2"
                      >
                        <button
                          className="btn btn-sm btn-outline"
                          type="submit"
                        >
                          {String(newsItem.is_active || "0") === "1"
                            ? "Desativar notícia"
                            : "Ativar notícia"}
                        </button>
                      </BackendForm>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-catalog") {
    const tenant = asRecord(data.tenant);
    const isVendorTenant = String(tenant.card_type || "") === "empreendedor";
    const products = asRecordArray(data.products);
    const benefits = asRecordArray(data.benefits);
    return (
      <DashboardShell
        activeMenu="catalog"
        headerIcon="shopping-bag"
        headerTitle="Catálogo"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        {!isVendorTenant ? (
          <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 text-sm text-base-content/75 shadow-sm">
            O módulo de catálogo completo está disponível para empresas
            vendedoras.
          </section>
        ) : (
          <section className="mt-4 grid gap-4 lg:grid-cols-3">
            <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-1">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="plus" /> Novo
                  produto/serviço
                </h2>
                <BackendForm
                  backendPath="/meu-espaco/produtos"
                  className="space-y-3"
                >
                  <label className="form-control">
                    <span className="label-text font-semibold">Nome</span>
                    <input
                      className="input input-bordered"
                      name="name"
                      required
                      type="text"
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text font-semibold">Descrição</span>
                    <textarea
                      className="textarea textarea-bordered min-h-24"
                      name="description"
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text font-semibold">Preço</span>
                    <input
                      className="input input-bordered"
                      name="price"
                      type="text"
                    />
                  </label>
                  <button className="btn btn-primary btn-block" type="submit">
                    Cadastrar item
                  </button>
                </BackendForm>
              </div>
            </article>
            <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-2">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="shopping-bag" /> Itens
                  do marketplace (
                  {String(data.productsCount || products.length)})
                </h2>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
                      Nenhum item cadastrado ainda.
                    </div>
                  ) : (
                    products.map((product) => (
                      <div
                        key={String(product.id || JSON.stringify(product))}
                        className="rounded-xl border border-base-300 bg-base-200/40 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold">
                              {String(product.name || "-")}
                            </h3>
                            <p className="text-xs text-base-content/65">
                              {String(product.price || "-")}
                            </p>
                          </div>
                          <span className="badge badge-outline">
                            {String(product.status_label || "-")}
                          </span>
                        </div>
                        <BackendForm
                          backendPath={`/meu-espaco/produtos/${String(product.id || 0)}/atualizar`}
                          className="grid gap-3 md:grid-cols-2"
                        >
                          <label className="form-control md:col-span-1">
                            <span className="label-text">Nome</span>
                            <input
                              className="input input-bordered input-sm"
                              defaultValue={String(product.name || "")}
                              name="name"
                              required
                              type="text"
                            />
                          </label>
                          <label className="form-control md:col-span-1">
                            <span className="label-text">Preço</span>
                            <input
                              className="input input-bordered input-sm"
                              defaultValue={String(product.price_value || "")}
                              name="price"
                              type="text"
                            />
                          </label>
                          <label className="form-control md:col-span-2">
                            <span className="label-text">Descrição</span>
                            <textarea
                              className="textarea textarea-bordered textarea-sm"
                              defaultValue={String(product.description || "")}
                              name="description"
                            />
                          </label>
                          <div className="md:col-span-2">
                            <button
                              className="btn btn-sm btn-primary"
                              type="submit"
                            >
                              Salvar alterações
                            </button>
                          </div>
                        </BackendForm>
                        <BackendForm
                          backendPath={`/meu-espaco/produtos/${String(product.id || 0)}/status`}
                          className="mt-2"
                        >
                          <button
                            className="btn btn-sm btn-outline"
                            type="submit"
                          >
                            {String(product.is_active || "0") === "1"
                              ? "Desativar item"
                              : "Ativar item"}
                          </button>
                        </BackendForm>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </article>
          </section>
        )}
        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-1">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="gift" /> Nova vantagem
              </h2>
              <BackendForm
                backendPath="/meu-espaco/beneficios"
                className="space-y-3"
              >
                <label className="form-control">
                  <span className="label-text font-semibold">Título</span>
                  <input
                    className="input input-bordered"
                    name="title"
                    required
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Resumo</span>
                  <input
                    className="input input-bordered"
                    name="short_description"
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Desconto</span>
                  <input
                    className="input input-bordered"
                    name="discount_label"
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Cupom</span>
                  <input
                    className="input input-bordered"
                    name="coupon_code"
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Público</span>
                  <select
                    className="select select-bordered"
                    name="target_audience"
                  >
                    <option value="associados">Associados</option>
                    <option value="colaboradores">Colaboradores</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Válido até</span>
                  <input
                    className="input input-bordered"
                    name="ends_at"
                    type="datetime-local"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Regras</span>
                  <textarea
                    className="textarea textarea-bordered min-h-24"
                    name="rules_text"
                  />
                </label>
                <button className="btn btn-primary btn-block" type="submit">
                  Cadastrar vantagem
                </button>
              </BackendForm>
            </div>
          </article>
          <article className="card border border-base-300 bg-base-100 shadow-sm lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="gift" /> Vantagens da sua
                empresa ({String(data.benefitsCount || benefits.length)})
              </h2>
              <div className="space-y-4">
                {benefits.length === 0 ? (
                  <div className="rounded-xl border border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
                    Nenhuma vantagem cadastrada ainda.
                  </div>
                ) : (
                  benefits.map((benefit) => (
                    <div
                      key={String(benefit.id || JSON.stringify(benefit))}
                      className="rounded-xl border border-base-300 bg-base-200/40 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <h3 className="font-bold">
                            {String(benefit.title || "-")}
                          </h3>
                          <p className="text-xs text-base-content/65">
                            {String(benefit.discount_label || "-")}
                          </p>
                        </div>
                        <span className="badge badge-outline">
                          {String(benefit.status_label || "-")}
                        </span>
                      </div>
                      <BackendForm
                        backendPath={`/meu-espaco/beneficios/${String(benefit.id || 0)}/atualizar`}
                        className="grid gap-3 md:grid-cols-2"
                      >
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Título</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(benefit.title || "")}
                            name="title"
                            required
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Desconto</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(benefit.discount_label || "")}
                            name="discount_label"
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Resumo</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(
                              benefit.short_description || "",
                            )}
                            name="short_description"
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Cupom</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(benefit.coupon_code || "")}
                            name="coupon_code"
                            type="text"
                          />
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Público</span>
                          <select
                            className="select select-bordered select-sm"
                            defaultValue={String(
                              benefit.target_audience || "associados",
                            )}
                            name="target_audience"
                          >
                            <option value="associados">Associados</option>
                            <option value="colaboradores">Colaboradores</option>
                            <option value="ambos">Ambos</option>
                          </select>
                        </label>
                        <label className="form-control md:col-span-1">
                          <span className="label-text">Válido até</span>
                          <input
                            className="input input-bordered input-sm"
                            defaultValue={String(benefit.ends_at || "")}
                            name="ends_at"
                            type="datetime-local"
                          />
                        </label>
                        <label className="form-control md:col-span-2">
                          <span className="label-text">Regras</span>
                          <textarea
                            className="textarea textarea-bordered textarea-sm"
                            defaultValue={String(benefit.rules_text || "")}
                            name="rules_text"
                          />
                        </label>
                        <div className="md:col-span-2">
                          <button
                            className="btn btn-sm btn-primary"
                            type="submit"
                          >
                            Salvar alterações
                          </button>
                        </div>
                      </BackendForm>
                      <BackendForm
                        backendPath={`/meu-espaco/beneficios/${String(benefit.id || 0)}/status`}
                        className="mt-2"
                      >
                        <button
                          className="btn btn-sm btn-outline"
                          type="submit"
                        >
                          {String(benefit.is_active || "0") === "1"
                            ? "Desativar vantagem"
                            : "Ativar vantagem"}
                        </button>
                      </BackendForm>
                    </div>
                  ))
                )}
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-sales") {
    const summary = asRecord(data.companySalesSummary);
    const salesRows = asRecordArray(data.companySalesRows);
    return (
      <DashboardShell
        activeMenu="sales"
        headerBadge={`${String(summary.sales_count || 0)} vendas`}
        headerIcon="shopping-cart"
        headerTitle="Compras e vendas"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            [
              "Volume total",
              String(summary.total_amount || "R$ 0,00"),
              `${String(summary.sales_count || 0)} vendas`,
            ],
            [
              "Pagas",
              String(summary.paid_amount || "R$ 0,00"),
              `${String(summary.paid_count || 0)} pedidos pagos`,
            ],
            [
              "Clientes",
              `${String(summary.guest_count || 0)} associados`,
              `${String(summary.associated_count || 0)} vinculados`,
            ],
            [
              "Comissões recebidas",
              String(summary.commissions_amount || "R$ 0,00"),
              `${String(summary.commissions_count || 0)} lançamentos`,
            ],
          ].map(([label, value, help]) => (
            <article
              key={label}
              className="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body p-4">
                <p className="text-xs uppercase text-base-content/55">
                  {label}
                </p>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-sm text-base-content/70">{help}</p>
              </div>
            </article>
          ))}
        </section>
        <section className="mt-4">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="receipt" /> Histórico de
                compras relacionadas
              </h2>
              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Data</th>
                      <th>Loja</th>
                      <th>Cliente</th>
                      <th>Perfil</th>
                      <th>Status</th>
                      <th>Pagamento</th>
                      <th>Total</th>
                      <th>Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesRows.length === 0 ? (
                      <tr>
                        <td
                          className="text-center text-sm text-base-content/65"
                          colSpan={9}
                        >
                          Nenhuma compra vinculada encontrada.
                        </td>
                      </tr>
                    ) : (
                      salesRows.map((sale) => (
                        <tr key={String(sale.id || JSON.stringify(sale))}>
                          <td className="font-semibold">
                            #{String(sale.id || "0")}
                          </td>
                          <td>{String(sale.created_at || "-")}</td>
                          <td>{String(sale.seller_tenant_name || "-")}</td>
                          <td>
                            {String(sale.customer_name || "Não identificado")}
                          </td>
                          <td>{String(sale.customer_type_label || "-")}</td>
                          <td>{String(sale.status || "-")}</td>
                          <td>{String(sale.payment_status || "-")}</td>
                          <td>{String(sale.total_amount || "R$ 0,00")}</td>
                          <td>{String(sale.commission_amount || "R$ 0,00")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-payment-requests") {
    const company = asRecord(data.company);
    const stripeReady =
      boolish(company.stripe_charges_enabled) &&
      boolish(company.stripe_payouts_enabled);
    const paymentRequests = asRecordArray(data.paymentRequests);
    return (
      <DashboardShell
        activeMenu="payments"
        headerIcon="credit-card"
        headerTitle="Cobranças Stripe"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
                    Stripe Connect
                  </p>
                  <h2 className="card-title">Recebimento da empresa</h2>
                  <p className="text-sm text-base-content/70">
                    As cobranças usam destino direto para a conta conectada da
                    empresa.
                  </p>
                </div>
                <span className="badge badge-outline">
                  {stripeReady
                    ? "Pronto para receber"
                    : String(
                        company.stripe_onboarding_status ||
                          "Cadastro não iniciado",
                      )}
                </span>
              </div>
              {!stripeReady ? (
                <div className="alert alert-warning mt-4">
                  <span>
                    Complete ou finalize o cadastro Stripe Connect para liberar
                    cobranças.
                  </span>
                </div>
              ) : (
                <div className="alert alert-success mt-4">
                  <span>Conta apta para receber pagamentos e repasses.</span>
                </div>
              )}
              {company.stripe_last_error ? (
                <p className="mt-3 rounded-xl bg-warning/15 p-3 text-sm text-warning-content">
                  {String(company.stripe_last_error)}
                </p>
              ) : null}
            </div>
          </article>
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Nova cobrança</h2>
              <BackendForm
                backendPath="/meu-espaco/cobrancas"
                className="space-y-3"
              >
                <label className="form-control">
                  <span className="label-text font-semibold">Descrição</span>
                  <input
                    className="input input-bordered"
                    maxLength={255}
                    name="description"
                    required
                    type="text"
                  />
                </label>
                <label className="form-control">
                  <span className="label-text font-semibold">Valor</span>
                  <input
                    className="input input-bordered"
                    name="amount"
                    placeholder="R$ 150,00"
                    required
                    type="text"
                  />
                </label>
                <button
                  className="btn btn-primary w-full"
                  disabled={!stripeReady}
                  type="submit"
                >
                  Criar cobrança
                </button>
              </BackendForm>
            </div>
          </article>
        </section>
        <section className="mt-5">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Cobranças criadas</h2>
              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>QR Code</th>
                      <th>Link</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRequests.length === 0 ? (
                      <tr>
                        <td
                          className="text-center text-sm text-base-content/65"
                          colSpan={7}
                        >
                          Nenhuma cobrança criada.
                        </td>
                      </tr>
                    ) : (
                      paymentRequests.map((item) => (
                        <tr key={String(item.id || JSON.stringify(item))}>
                          <td className="font-semibold">
                            #{String(item.id || "0")}
                          </td>
                          <td>{String(item.description || "-")}</td>
                          <td>{String(item.amount_label || "-")}</td>
                          <td>
                            <span className="badge badge-outline">
                              {String(item.status_label || "-")}
                            </span>
                          </td>
                          <td>
                            {item.qrcode_data_uri ? (
                              <img
                                alt="QR Code da cobrança"
                                className="h-20 w-20 rounded-lg border border-base-300 bg-white p-1"
                                src={String(item.qrcode_data_uri)}
                              />
                            ) : null}
                          </td>
                          <td>
                            <a
                              className="link link-primary break-all text-sm"
                              href={String(item.payment_url || "#")}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {String(item.payment_url || "-")}
                            </a>
                          </td>
                          <td>
                            {[
                              "pending",
                              "requires_payment_method",
                              "processing",
                            ].includes(String(item.status || "")) ? (
                              <BackendForm
                                backendPath={`/meu-espaco/cobrancas/${String(item.id || 0)}/cancelar`}
                              >
                                <button
                                  className="btn btn-ghost btn-xs text-error"
                                  type="submit"
                                >
                                  Cancelar
                                </button>
                              </BackendForm>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.company.portal-users") {
    const isAdminMember = boolish(data.isAdminMember);
    const teamUsers = asRecordArray(data.teamUsers);
    const teamInvites = asRecordArray(data.teamInvites);
    const permissionOptions = asRecordArray(data.permissionOptions);
    return (
      <DashboardShell
        activeMenu="users"
        headerIcon="users"
        headerTitle="Equipe da empresa"
        navItems={companyNavItems}
        panelDescription="Navegação da empresa"
        panelTitle="Portal da empresa"
      >
        <section className="grid gap-4 lg:grid-cols-[1.2fr,1.8fr]">
          <article className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">
                <LucideIcon className="h-4 w-4" name="user-plus" /> Convidar
                usuário
              </h2>
              {!isAdminMember ? (
                <div className="alert alert-warning mt-2 text-sm">
                  Somente administradores da empresa podem enviar convites.
                </div>
              ) : null}
              <BackendForm
                backendPath="/meu-espaco/usuarios/convites"
                className="mt-3 space-y-3"
              >
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">E-mail</span>
                  <input
                    className="input input-bordered w-full"
                    defaultValue={String(data.oldInviteEmail || "")}
                    name="email"
                    required
                    type="email"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">Escopo</span>
                  <select
                    className="select select-bordered w-full"
                    defaultValue={String(data.oldInviteScope || "dashboard")}
                    name="access_scope"
                  >
                    <option value="dashboard">Acesso ao dashboard</option>
                    <option value="employee_purchase">Apenas compras</option>
                  </select>
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">Perfil</span>
                  <select
                    className="select select-bordered w-full"
                    defaultValue={String(data.oldInviteRole || "manager")}
                    name="relationship_role"
                  >
                    <option value="manager">Funcionário do dashboard</option>
                    <option value="admin">Administrador do dashboard</option>
                    <option value="employee">Funcionário</option>
                  </select>
                </label>
                <div className="space-y-2 rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <span className="block text-sm font-semibold">
                    Permissões específicas
                  </span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {permissionOptions.map((option) => (
                      <label
                        key={String(option.key || JSON.stringify(option))}
                        className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 bg-base-100 px-3 py-2"
                      >
                        <input
                          className="checkbox checkbox-sm checkbox-primary"
                          name="permissions[]"
                          type="checkbox"
                          value={String(option.key || "")}
                        />
                        <span className="label-text font-medium">
                          {String(option.label || "-")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary w-full"
                  disabled={!isAdminMember}
                  type="submit"
                >
                  Enviar convite
                </button>
              </BackendForm>
            </div>
          </article>
          <article className="space-y-4">
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="users-round" /> Usuários
                  da empresa
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Perfil</th>
                        <th>Permissões</th>
                        <th>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamUsers.map((teamUser) => (
                        <tr
                          key={String(teamUser.id || JSON.stringify(teamUser))}
                        >
                          <td>{String(teamUser.name || "-")}</td>
                          <td>{String(teamUser.email || "-")}</td>
                          <td>{String(teamUser.relationship_role || "-")}</td>
                          <td>{String(teamUser.permissions_label || "-")}</td>
                          <td>{String(teamUser.role || "-")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base">
                  <LucideIcon className="h-4 w-4" name="mail-search" /> Convites
                  recentes
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>E-mail</th>
                        <th>Escopo</th>
                        <th>Permissões</th>
                        <th>Status</th>
                        <th>Expira em</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamInvites.map((invite) => (
                        <tr key={String(invite.id || JSON.stringify(invite))}>
                          <td>{String(invite.invited_email || "-")}</td>
                          <td>{String(invite.scope_label || "-")}</td>
                          <td>{String(invite.permissions_label || "-")}</td>
                          <td>{String(invite.status || "-")}</td>
                          <td>{String(invite.expires_at || "-")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>
        </section>
      </DashboardShell>
    );
  }

  if (view === "pages.customer.dashboard") {
    const profile = (data.profile as Record<string, unknown>) || {};
    const summary = (data.summary as Record<string, unknown>) || {};
    return (
      <DashboardShell
        activeMenu="overview"
        headerIcon="layout-dashboard"
        headerTitle="Minha área"
        navItems={customerNavItems}
        panelDescription="Acesso do cliente"
        panelTitle="Portal do cliente"
      >
        <main className="mx-auto max-w-6xl py-6 sm:py-8">
          <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Minha Área do Cliente
              </h1>
              <p className="text-sm text-base-content/70">
                <span className="badge badge-ghost badge-sm uppercase">
                  {String(profile.membership_label || "Cliente associado")}
                </span>
              </p>
            </div>
            <a className="btn btn-primary btn-sm" href="/meu-cartao">
              <LucideIcon className="h-4 w-4" name="qr-code" />
              Meu Cartão
            </a>
          </header>

          <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              ["Compras", String(summary.sales_count || 0)],
              ["Total gasto", String(summary.total_spent || "0")],
              ["Pagas", String(summary.paid_count || 0)],
              ["Pendentes", String(summary.pending_count || 0)],
            ].map(([label, value]) => (
              <article
                key={label}
                className="card border border-base-300 bg-base-100 shadow-sm"
              >
                <div className="card-body p-4 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                    {label}
                  </p>
                  <p className="text-xl font-black sm:text-2xl">{value}</p>
                </div>
              </article>
            ))}
          </section>
        </main>
      </DashboardShell>
    );
  }

  return genericUnsupportedView(view || routePath || currentPath, flashData);
}
