export const adminNavItems = [
  ["overview", "/", "layout-dashboard", "Visão geral"],
  ["analytics", "/analytics", "bar-chart-3", "Analytics"],
  ["requests", "/solicitacoes", "building-2", "Solicitações"],
  ["payouts", "/repasses", "hand-coins", "Repasses"],
  ["sales", "/compras", "shopping-cart", "Compras"],
  ["companies", "/empresas", "store", "Empresas"],
  ["customers", "/clientes", "users-round", "Clientes"],
  ["news", "/noticias", "newspaper", "Notícias"],
  ["events", "/eventos", "calendar-days", "Eventos"],
  ["courses", "/cursos", "graduation-cap", "Cursos"],
  ["giveaways", "/sorteios", "ticket", "Sorteios"],
  ["privacy", "/privacidade", "shield-check", "Privacidade"],
  ["health", "/saude", "activity", "Saúde do sistema"],
  [
    "entrepreneur-invites",
    "/convites/empreendedores",
    "mail-plus",
    "Convites empreendedor",
  ],
  ["cities", "/cidades", "map-pin", "Cidades"],
  ["categories", "/categorias", "tag", "Categorias"],
] as const;

export const companyNavItems = [
  ["overview", "/", "layout-dashboard", "Visão geral"],
  ["analytics", "/analytics", "bar-chart-3", "Analytics"],
  ["associates", "/associados", "users", "Associados"],
  ["users", "/usuarios", "users-round", "Equipe"],
  ["sales", "/compras", "shopping-cart", "Compras"],
  ["payments", "/pagamentos", "credit-card", "Cobranças"],
  ["news", "/noticias", "newspaper", "Notícias"],
  ["events", "/eventos", "calendar-days", "Eventos"],
  ["catalog", "/catalogo", "shopping-bag", "Catálogo"],
  ["card", "/meu-cartao", "qr-code", "Meu cartão"],
  ["company-settings", "/perfil", "settings", "Configurações"],
] as const;

export const customerNavItems = [
  ["overview", "/", "layout-dashboard", "Minha área"],
  ["payments", "/pagamentos", "credit-card", "Pagamentos"],
  ["payment-scanner", "/pagamentos/ler-qrcode", "scan-qr-code", "Ler QR Code"],
  ["card", "/meu-cartao", "qr-code", "Meu cartão"],
  ["purchases", "/compras", "receipt", "Compras"],
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
        items: compact([
          byKey.get("overview"),
          byKey.get("analytics"),
          byKey.get("health"),
        ]),
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

  if (
    items === companyNavItems ||
    (hasKey("company-settings") && hasKey("users"))
  ) {
    return [
      {
        label: "Visão geral",
        items: compact([
          byKey.get("overview"),
          byKey.get("analytics"),
          byKey.get("card"),
        ]),
      },
      {
        label: "Empresa",
        items: compact([
          byKey.get("catalog"),
          byKey.get("news"),
          byKey.get("events"),
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
      {
        label: "Conta",
        items: compact([byKey.get("company-settings")]),
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
  if (pathname === "/") {
    return {
      activeMenu: "overview",
      headerIcon: "layout-dashboard",
      headerTitle: "Visão geral",
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
