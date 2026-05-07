export const adminNavItems = [
  ["overview", "/", "layout-dashboard", "Visão geral"],
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
  ["overview", "/", "layout-dashboard", "Visão geral"],
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
  ["overview", "/", "layout-dashboard", "Minha área"],
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

export type NavItem = readonly [string, string, string, string];
export type NavSection = {
  label: string;
  items: NavItem[];
};

type DashboardContextLike = {
  kind?: string;
  company_type?: string;
  account_type?: string;
};

function compact(items: Array<NavItem | undefined>) {
  return items.filter(Boolean) as NavItem[];
}

export function groupNavItems(items: ReadonlyArray<NavItem>): NavSection[] {
  const byKey = new Map(items.map((item) => [item[0], item]));
  const hasKey = (key: string) => byKey.has(key);

  if (items === adminNavItems) {
    return [
      {
        label: "Visão geral",
        items: compact([byKey.get("overview"), byKey.get("health")]),
      },
      {
        label: "Operações",
        items: compact([
          byKey.get("requests"),
          byKey.get("payouts"),
          byKey.get("sales"),
        ]),
      },
      {
        label: "Cadastros",
        items: compact([
          byKey.get("companies"),
          byKey.get("customers"),
          byKey.get("cities"),
          byKey.get("categories"),
        ]),
      },
      {
        label: "Conteúdo",
        items: compact([
          byKey.get("news"),
          byKey.get("events"),
          byKey.get("courses"),
          byKey.get("giveaways"),
        ]),
      },
      { label: "Conformidade", items: compact([byKey.get("privacy")]) },
      {
        label: "Convites",
        items: compact([byKey.get("entrepreneur-invites")]),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (items === companyNavItems || (hasKey("profile") && hasKey("users"))) {
    return [
      {
        label: "Visão geral",
        items: compact([byKey.get("overview"), byKey.get("card")]),
      },
      {
        label: "Empresa",
        items: compact([
          byKey.get("profile"),
          byKey.get("catalog"),
          byKey.get("news"),
        ]),
      },
      {
        label: "Relacionamentos",
        items: compact([byKey.get("associates"), byKey.get("users")]),
      },
      {
        label: "Financeiro",
        items: compact([byKey.get("sales"), byKey.get("payments")]),
      },
    ].filter((section) => section.items.length > 0);
  }

  if (items === customerNavItems) {
    return [
      {
        label: "Visão geral",
        items: compact([byKey.get("overview"), byKey.get("card")]),
      },
      {
        label: "Pagamentos",
        items: compact([byKey.get("payments"), byKey.get("payment-scanner")]),
      },
      { label: "Compras", items: compact([byKey.get("purchases")]) },
      { label: "Conta", items: compact([byKey.get("settings")]) },
    ].filter((section) => section.items.length > 0);
  }

  return [{ label: "Navegação", items: [...items] }];
}

export function navItemsForContext(context: DashboardContextLike | null) {
  if (context?.kind === "company") {
    const isPartnerCompany =
      context.account_type === "company_partner" ||
      context.company_type === "conveniada";

    if (isPartnerCompany) {
      return companyNavItems;
    }

    return companyNavItems.filter(([key]) => key !== "associates");
  }

  if (context?.kind === "customer") {
    return customerNavItems;
  }

  return adminNavItems;
}

export function navItemsForContextKind(kind: string | undefined) {
  return navItemsForContext({ kind });
}

export function routeMetaForPathname(pathname: string) {
  if (
    pathname === "/" ||
    pathname === "/central" ||
    pathname === "/meu-espaco" ||
    pathname === "/minha-area"
  ) {
    return {
      activeMenu: "overview",
      headerIcon: "layout-dashboard",
      headerTitle: pathname === "/minha-area" ? "Minha área" : "Visão geral",
    };
  }

  const allItems = [...adminNavItems, ...companyNavItems, ...customerNavItems];
  const exact = allItems.find(([, href]) => href === pathname);
  if (exact) {
    return {
      activeMenu: exact[0],
      headerIcon: exact[2],
      headerTitle: exact[3],
    };
  }

  const matched = allItems
    .filter(([, href]) => href !== "/" && pathname.startsWith(`${href}/`))
    .sort((a, b) => b[1].length - a[1].length)[0];

  if (matched) {
    return {
      activeMenu: matched[0],
      headerIcon: matched[2],
      headerTitle: matched[3],
    };
  }

  return {
    activeMenu: "overview",
    headerIcon: "layout-dashboard",
    headerTitle: "Dashboard",
  };
}
