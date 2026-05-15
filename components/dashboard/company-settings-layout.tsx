"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "@/components/lucide-icon";

const items = [
  {
    description: "Dados institucionais e atuação",
    href: "/perfil",
    icon: "building-2",
    label: "Perfil",
  },
  {
    description: "Plano atual e portal Stripe",
    href: "/assinatura",
    icon: "wallet",
    label: "Assinatura",
  },
  {
    description: "Tema e preferências visuais",
    href: "/tema",
    icon: "settings",
    label: "Tema",
  },
] as const;

export function CompanySettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";

  return (
    <section className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="h-fit rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm lg:sticky lg:top-24">
        <div className="mb-4 rounded-2xl bg-primary/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            Configurações
          </p>
          <h2 className="mt-1 text-xl font-black">Empresa empreendedora</h2>
          <p className="mt-2 text-sm text-base-content/65">
            Gerencie perfil, assinatura e aparência em uma área unificada.
          </p>
        </div>

        <nav aria-label="Configurações da empresa">
          <ul className="menu gap-1 rounded-box p-0">
            {items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link className={active ? "active" : ""} href={item.href}>
                    <LucideIcon name={item.icon} className="h-4 w-4" />
                    <span>
                      <span className="block font-bold">{item.label}</span>
                      <span className="block text-xs opacity-60">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0">{children}</div>
    </section>
  );
}
