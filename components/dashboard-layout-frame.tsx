"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BackendSessionState } from "@/lib/backend-session";
import {
  getActiveDashboardContext,
  getDashboardContextLabel,
} from "@/lib/dashboard-context.mjs";
import {
  groupNavItems,
  navItemsForContext,
  routeMetaForPathname,
} from "@/lib/dashboard-navigation";
import { BackendForm } from "./backend-form";
import { DashboardContextSwitcher } from "./dashboard-context-switcher";
import { ForcePasswordChangeModal } from "./force-password-change-modal";
import { LucideIcon } from "./lucide-icon";

const publicPathPrefixes = [
  "/login",
  "/clientes/cadastro",
  "/senha",
  "/convite",
  "/pagamento",
];

function isPublicPath(pathname: string) {
  return publicPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function DashboardLayoutFrame({
  children,
  session,
}: {
  children: React.ReactNode;
  session: BackendSessionState;
}) {
  const pathname = usePathname() || "/";
  const activeContext = getActiveDashboardContext(
    session.dashboard_contexts,
    session.active_dashboard_context,
  );
  const shouldRenderDashboard =
    Boolean(session.auth_user) && !isPublicPath(pathname);

  if (!shouldRenderDashboard) {
    return <>{children}</>;
  }

  const navItems = navItemsForContext(activeContext);
  const navSections = groupNavItems(navItems);
  const routeMeta = routeMetaForPathname(pathname);
  const authUser = session.auth_user ?? {};
  const mustChangePassword =
    authUser.role === "company" && authUser.must_change_password === "1";

  return (
    <>
      <div
        aria-hidden={mustChangePassword}
        className={`drawer min-h-screen lg:drawer-open ${
          mustChangePassword ? "pointer-events-none select-none blur-[1px]" : ""
        }`}
      >
        <input
          id="dashboard-sidebar"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content bg-base-200">
          <header className="sticky top-0 z-10 border-b border-base-300/80 bg-base-100/90 backdrop-blur">
            <div className="flex min-h-16 items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <label
                  htmlFor="dashboard-sidebar"
                  className="btn btn-square btn-ghost btn-sm lg:hidden"
                >
                  <LucideIcon name="menu" className="h-4 w-4" />
                </label>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-base-content/50">
                    Clubemp
                  </p>
                  <h1 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                    <LucideIcon
                      name={routeMeta.headerIcon}
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                    <span className="truncate">{routeMeta.headerTitle}</span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {session.dashboard_contexts &&
                session.dashboard_contexts.length > 0 ? (
                  <DashboardContextSwitcher
                    activeContextKey={activeContext?.key || ""}
                    addCompanyHref="/empresas/adicionar"
                    contexts={session.dashboard_contexts}
                    currentLabel={getDashboardContextLabel(activeContext)}
                  />
                ) : null}
                <Link
                  className="btn btn-ghost btn-sm btn-square"
                  href="/configuracoes"
                  aria-label="Perfil"
                >
                  {authUser.profile_image_url ? (
                    <span
                      className="h-7 w-7 rounded-full border border-base-300 bg-cover bg-center"
                      role="img"
                      style={{
                        backgroundImage: `url(${String(authUser.profile_image_url)})`,
                      }}
                    />
                  ) : (
                    <LucideIcon name="user-round" className="h-4 w-4" />
                  )}
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
              <p className="mt-1 text-sm font-bold">
                {getDashboardContextLabel(activeContext)}
              </p>
            </div>

            <div className="mb-4 space-y-4">
              {navSections.map((section) => (
                <section key={section.label} className="space-y-2">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-[0.22em] text-base-content/45">
                    {section.label}
                  </p>
                  <ul className="menu w-full gap-1 rounded-box bg-base-100 p-0">
                    {section.items.map(([key, href, icon, label]) => (
                      <li key={`${section.label}-${key}`}>
                        <Link
                          className={
                            routeMeta.activeMenu === key ? "active" : ""
                          }
                          href={href}
                        >
                          <LucideIcon name={icon} className="h-4 w-4" />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <BackendForm backendPath="/auth/logout" onSuccess="stay">
              <button className="btn btn-outline btn-sm gap-2" type="submit">
                <LucideIcon name="log-out" className="h-4 w-4" />
                Sair
              </button>
            </BackendForm>
          </aside>
        </div>
      </div>
      <ForcePasswordChangeModal
        flashError={session.flash_error}
        open={mustChangePassword}
      />
    </>
  );
}
