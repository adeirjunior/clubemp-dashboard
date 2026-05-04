import Link from "next/link";
import { readBackendSession } from "@/lib/backend";
import { BackendForm } from "./backend-form";
import { DashboardContextSwitcher } from "./dashboard-context-switcher";
import { LucideIcon } from "./lucide-icon";

const defaultNavItems = [
  ["overview", "/central", "layout-dashboard", "Visão geral"],
  ["requests", "/central/solicitacoes", "building-2", "Solicitações"],
  ["payouts", "/central/repasses", "hand-coins", "Repasses"],
  ["sales", "/central/compras", "shopping-cart", "Compras"],
  ["companies", "/central/empresas", "store", "Empresas"],
  ["customers", "/central/clientes", "users-round", "Clientes"],
  ["news", "/central/noticias", "newspaper", "Notícias"],
  ["events", "/central/eventos", "calendar-days", "Eventos"],
  ["courses", "/central/cursos", "graduation-cap", "Cursos"],
  ["giveaways", "/central/sorteios", "ticket", "Sorteios"],
  ["privacy", "/central/privacidade", "shield-check", "Privacidade"],
  ["health", "/central/saude", "activity", "Saúde do sistema"],
  [
    "entrepreneur-invites",
    "/central/convites/empreendedores",
    "mail-plus",
    "Convites empreendedor",
  ],
  ["cities", "/central/cidades", "map-pin", "Cidades"],
  ["categories", "/central/categorias", "tag", "Categorias"],
] as const;

export const companyNavItems = [
  ["overview", "/meu-espaco", "layout-dashboard", "Visão geral"],
  ["profile", "/meu-espaco/perfil", "building-2", "Perfil"],
  ["associates", "/meu-espaco/associados", "users", "Associados"],
  ["users", "/meu-espaco/usuarios", "users-round", "Equipe"],
  ["sales", "/meu-espaco/compras", "shopping-cart", "Compras"],
  ["payments", "/meu-espaco/cobrancas", "credit-card", "Cobranças"],
  ["news", "/meu-espaco/noticias", "newspaper", "Notícias"],
  ["catalog", "/meu-espaco/catalogo", "shopping-bag", "Catálogo"],
  ["card", "/meu-cartao", "qr-code", "Meu cartão"],
] as const;

export const customerNavItems = [
  ["overview", "/minha-area", "layout-dashboard", "Minha área"],
  ["payments", "/minha-area/pagamentos", "credit-card", "Pagamentos"],
  [
    "payment-scanner",
    "/minha-area/pagamentos/ler-qrcode",
    "scan-qr-code",
    "Ler QR Code",
  ],
  ["card", "/meu-cartao", "qr-code", "Meu cartão"],
  ["purchases", "/minhas-compras", "receipt", "Compras"],
  ["settings", "/configuracoes", "settings", "Configurações"],
] as const;

export async function DashboardShell({
  activeMenu,
  children,
  headerBadge,
  headerIcon,
  headerTitle,
  navItems = defaultNavItems,
  panelDescription = "Navegação por módulos",
  panelTitle = "Gestão administrativa",
}: {
  activeMenu?: string;
  children: React.ReactNode;
  headerBadge?: string;
  headerIcon?: string;
  headerTitle?: string;
  navItems?: ReadonlyArray<readonly [string, string, string, string]>;
  panelDescription?: string;
  panelTitle?: string;
}) {
  const session = await readBackendSession();
  const authUser = session.auth_user ?? {};
  const dashboardContexts = session.dashboard_contexts ?? [];
  const activeContext =
    dashboardContexts.find(
      (context) => context.key === session.active_dashboard_context,
    ) ?? dashboardContexts[0];

  return (
    <div className="drawer min-h-screen lg:drawer-open">
      <input id="dashboard-sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-200">
        <header className="sticky top-0 z-10 border-b border-base-300 bg-base-100/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <label
                htmlFor="dashboard-sidebar"
                className="btn btn-square btn-ghost lg:hidden"
              >
                <LucideIcon name="menu" className="h-4 w-4" />
              </label>
              <div>
                <p className="text-xs uppercase tracking-wider text-base-content/55">
                  Clubemp
                </p>
                <h1 className="flex items-center gap-2 text-lg font-bold">
                  <LucideIcon
                    name={headerIcon || "layout-dashboard"}
                    className="h-5 w-5"
                  />
                  {headerTitle || "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {headerBadge ? (
                <span className="badge badge-outline">{headerBadge}</span>
              ) : null}
              {dashboardContexts.length > 0 ? (
                <DashboardContextSwitcher
                  activeContextKey={activeContext?.key || ""}
                  addCompanyHref="/empresas/adicionar"
                  contexts={dashboardContexts}
                  currentLabel={activeContext?.label || "Modo atual"}
                />
              ) : null}
              <Link
                className="btn btn-ghost btn-sm gap-2"
                href="/configuracoes"
              >
                {authUser.profile_image_url ? (
                  <img
                    alt="Perfil"
                    className="h-7 w-7 rounded-full border border-base-300 object-cover"
                    src={authUser.profile_image_url}
                  />
                ) : (
                  <LucideIcon name="user-round" className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Perfil</span>
              </Link>
            </div>
          </div>
        </header>
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="dashboard-sidebar" className="drawer-overlay">
          <span className="sr-only">Fechar menu lateral</span>
        </label>
        <aside className="min-h-full w-72 border-r border-base-300 bg-base-100 p-4">
          <div className="mb-6 rounded-xl border border-base-300 bg-base-200/50 p-4">
            <p className="text-xs uppercase tracking-wide text-base-content/60">
              Painel Clubemp
            </p>
            <p className="mt-1 text-sm font-bold">{panelTitle}</p>
            <p className="text-xs text-base-content/70">{panelDescription}</p>
          </div>

          <ul className="menu mb-4 w-full gap-1 rounded-box bg-base-100 p-0">
            {navItems.map(([key, href, icon, label]) => (
              <li key={key}>
                <Link
                  className={activeMenu === key ? "active" : ""}
                  href={href}
                >
                  <LucideIcon name={icon} className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <BackendForm backendPath="/auth/logout" onSuccess="stay">
            <button className="btn btn-outline btn-sm gap-2" type="submit">
              <LucideIcon name="log-out" className="h-4 w-4" />
              Sair
            </button>
          </BackendForm>
        </aside>
      </div>
    </div>
  );
}
