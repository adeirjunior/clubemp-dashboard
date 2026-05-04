type PageRoute = { type: "page"; backendPath: string };
type LocalRoute = { type: "local"; view: string };
type RedirectRoute = { type: "redirect"; to: string };
type ResolvedRoute = PageRoute | RedirectRoute | LocalRoute;

const exactRoutes = new Map<string, ResolvedRoute>([
  ["/", { type: "redirect", to: "/login" }],
  ["/login", { type: "local", view: "pages.auth.login" }],
  ["/senha/recuperar", { type: "local", view: "pages.auth.forgot-password" }],
  ["/senha/redefinir", { type: "local", view: "pages.auth.reset-password" }],
  [
    "/clientes/cadastro",
    { type: "page", backendPath: "/auth/clientes/cadastro" },
  ],
  ["/central", { type: "page", backendPath: "/dashboard/central" }],
  [
    "/central/solicitacoes",
    { type: "page", backendPath: "/dashboard/central/solicitacoes" },
  ],
  [
    "/central/repasses",
    { type: "page", backendPath: "/dashboard/central/repasses" },
  ],
  [
    "/central/compras",
    { type: "page", backendPath: "/dashboard/central/compras" },
  ],
  [
    "/central/empresas",
    { type: "page", backendPath: "/dashboard/central/empresas" },
  ],
  [
    "/central/empresas/ver",
    { type: "page", backendPath: "/dashboard/central/empresas/ver" },
  ],
  [
    "/central/clientes",
    { type: "page", backendPath: "/dashboard/central/clientes" },
  ],
  [
    "/central/clientes/ver",
    { type: "page", backendPath: "/dashboard/central/clientes/ver" },
  ],
  [
    "/central/privacidade",
    { type: "page", backendPath: "/dashboard/central/privacidade" },
  ],
  [
    "/central/privacidade/ver",
    { type: "page", backendPath: "/dashboard/central/privacidade/ver" },
  ],
  ["/central/saude", { type: "page", backendPath: "/dashboard/central/saude" }],
  ["/central/tv", { type: "redirect", to: "/central/noticias" }],
  [
    "/central/convites/empreendedores",
    { type: "page", backendPath: "/dashboard/central/convites/empreendedores" },
  ],
  [
    "/central/cidades",
    { type: "page", backendPath: "/dashboard/central/cidades" },
  ],
  [
    "/central/cidades/novo",
    { type: "page", backendPath: "/dashboard/central/cidades/novo" },
  ],
  [
    "/central/cidades/editar",
    { type: "page", backendPath: "/dashboard/central/cidades/editar" },
  ],
  [
    "/central/cidades/ver",
    { type: "page", backendPath: "/dashboard/central/cidades/ver" },
  ],
  [
    "/central/categorias",
    { type: "page", backendPath: "/dashboard/central/categorias" },
  ],
  [
    "/central/categorias/novo",
    { type: "page", backendPath: "/dashboard/central/categorias/novo" },
  ],
  [
    "/central/categorias/editar",
    { type: "page", backendPath: "/dashboard/central/categorias/editar" },
  ],
  [
    "/central/categorias/ver",
    { type: "page", backendPath: "/dashboard/central/categorias/ver" },
  ],
  [
    "/central/noticias",
    { type: "page", backendPath: "/dashboard/central/noticias" },
  ],
  [
    "/central/noticias/novo",
    { type: "page", backendPath: "/dashboard/central/noticias/novo" },
  ],
  [
    "/central/noticias/editar",
    { type: "page", backendPath: "/dashboard/central/noticias/editar" },
  ],
  [
    "/central/noticias/ver",
    { type: "page", backendPath: "/dashboard/central/noticias/ver" },
  ],
  [
    "/central/eventos",
    { type: "page", backendPath: "/dashboard/central/eventos" },
  ],
  [
    "/central/eventos/index",
    { type: "page", backendPath: "/dashboard/central/eventos/index" },
  ],
  [
    "/central/eventos/novo",
    { type: "page", backendPath: "/dashboard/central/eventos/novo" },
  ],
  [
    "/central/eventos/editar",
    { type: "page", backendPath: "/dashboard/central/eventos/editar" },
  ],
  [
    "/central/eventos/ver",
    { type: "page", backendPath: "/dashboard/central/eventos/ver" },
  ],
  [
    "/central/cursos",
    { type: "page", backendPath: "/dashboard/central/cursos" },
  ],
  [
    "/central/cursos/index",
    { type: "page", backendPath: "/dashboard/central/cursos/index" },
  ],
  [
    "/central/cursos/novo",
    { type: "page", backendPath: "/dashboard/central/cursos/novo" },
  ],
  [
    "/central/cursos/editar",
    { type: "page", backendPath: "/dashboard/central/cursos/editar" },
  ],
  [
    "/central/cursos/ver",
    { type: "page", backendPath: "/dashboard/central/cursos/ver" },
  ],
  [
    "/central/sorteios",
    { type: "page", backendPath: "/dashboard/central/sorteios" },
  ],
  [
    "/central/sorteios/index",
    { type: "page", backendPath: "/dashboard/central/sorteios/index" },
  ],
  [
    "/central/sorteios/novo",
    { type: "page", backendPath: "/dashboard/central/sorteios/novo" },
  ],
  [
    "/central/sorteios/editar",
    { type: "page", backendPath: "/dashboard/central/sorteios/editar" },
  ],
  [
    "/central/sorteios/ver",
    { type: "page", backendPath: "/dashboard/central/sorteios/ver" },
  ],
  [
    "/central/repasses/index",
    { type: "page", backendPath: "/dashboard/central/repasses/index" },
  ],
  [
    "/central/repasses/ver",
    { type: "page", backendPath: "/dashboard/central/repasses/ver" },
  ],
  [
    "/central/solicitacoes/index",
    { type: "page", backendPath: "/dashboard/central/solicitacoes/index" },
  ],
  [
    "/central/solicitacoes/ver",
    { type: "page", backendPath: "/dashboard/central/solicitacoes/ver" },
  ],
  ["/configuracoes", { type: "page", backendPath: "/portal/configuracoes" }],
  ["/minha-area", { type: "page", backendPath: "/portal/minha-area" }],
  [
    "/empresas/adicionar",
    { type: "page", backendPath: "/portal/empresas/adicionar" },
  ],
  ["/meu-espaco", { type: "page", backendPath: "/portal/meu-espaco" }],
  [
    "/meu-espaco/perfil",
    { type: "page", backendPath: "/portal/meu-espaco/perfil" },
  ],
  [
    "/meu-espaco/associados",
    { type: "page", backendPath: "/portal/meu-espaco/associados" },
  ],
  [
    "/meu-espaco/noticias",
    { type: "page", backendPath: "/portal/meu-espaco/noticias" },
  ],
  [
    "/meu-espaco/catalogo",
    { type: "page", backendPath: "/portal/meu-espaco/catalogo" },
  ],
  [
    "/meu-espaco/compras",
    { type: "page", backendPath: "/portal/meu-espaco/compras" },
  ],
  [
    "/meu-espaco/cobrancas",
    { type: "page", backendPath: "/portal/meu-espaco/cobrancas" },
  ],
  [
    "/meu-espaco/usuarios",
    { type: "page", backendPath: "/portal/meu-espaco/usuarios" },
  ],
  ["/meu-cartao", { type: "page", backendPath: "/portal/meu-cartao" }],
  ["/minhas-compras", { type: "page", backendPath: "/portal/minhas-compras" }],
  [
    "/minha-area/pagamentos",
    { type: "page", backendPath: "/portal/minha-area/pagamentos" },
  ],
  [
    "/minha-area/pagamentos/ler-qrcode",
    { type: "page", backendPath: "/portal/minha-area/pagamentos/ler-qrcode" },
  ],
  [
    "/meu-espaco/senha",
    { type: "page", backendPath: "/portal/meu-espaco/senha" },
  ],
]);

const tokenRoutePatterns = [
  {
    pattern: /^\/convite\/empresa\/([A-Za-z0-9\-_]+)$/,
    backendPath: (token: string) => `/auth/convite/empresa/${token}`,
  },
  {
    pattern: /^\/convite\/empreendedor\/([A-Za-z0-9\-_]+)$/,
    backendPath: (token: string) => `/auth/convite/empreendedor/${token}`,
  },
  {
    pattern: /^\/pagamento\/([A-Za-z0-9\-_]+)$/,
    backendPath: (token: string) => `/pagamento/${token}`,
  },
];

export function resolveLegacyRoute(pathname: string): ResolvedRoute | null {
  const exact = exactRoutes.get(pathname);
  if (exact) {
    return exact;
  }

  for (const item of tokenRoutePatterns) {
    const match = pathname.match(item.pattern);
    if (match) {
      return {
        type: "page",
        backendPath: item.backendPath(match[1]),
      };
    }
  }

  return null;
}

const exactViewRoutes = new Map<string, string>([
  ["/login", "pages.auth.login"],
  ["/senha/recuperar", "pages.auth.forgot-password"],
  ["/senha/redefinir", "pages.auth.reset-password"],
  ["/clientes/cadastro", "pages.auth.customer-register"],
  ["/central", "pages.central.index"],
  ["/central/empresas", "pages.central.empresas.index"],
  ["/central/empresas/ver", "pages.central.empresas.ver"],
  ["/central/clientes", "pages.central.clientes.index"],
  ["/central/clientes/ver", "pages.central.clientes.ver"],
  ["/central/privacidade", "pages.central.privacidade.index"],
  ["/central/privacidade/ver", "pages.central.privacidade.ver"],
  ["/central/saude", "pages.central.health"],
  ["/central/convites/empreendedores", "pages.central.entrepreneur-invites"],
  ["/central/cidades", "pages.central.cidades.index"],
  ["/central/cidades/novo", "pages.central.cidades.novo"],
  ["/central/cidades/editar", "pages.central.cidades.editar"],
  ["/central/cidades/ver", "pages.central.cidades.ver"],
  ["/central/categorias", "pages.central.categorias.index"],
  ["/central/categorias/novo", "pages.central.categorias.novo"],
  ["/central/categorias/editar", "pages.central.categorias.editar"],
  ["/central/categorias/ver", "pages.central.categorias.ver"],
  ["/central/noticias", "pages.central.noticias.index"],
  ["/central/noticias/novo", "pages.central.noticias.novo"],
  ["/central/noticias/editar", "pages.central.noticias.editar"],
  ["/central/noticias/ver", "pages.central.noticias.ver"],
  ["/central/eventos", "pages.central.eventos.index"],
  ["/central/eventos/index", "pages.central.eventos.index"],
  ["/central/eventos/novo", "pages.central.eventos.novo"],
  ["/central/eventos/editar", "pages.central.eventos.editar"],
  ["/central/eventos/ver", "pages.central.eventos.ver"],
  ["/central/cursos", "pages.central.cursos.index"],
  ["/central/cursos/index", "pages.central.cursos.index"],
  ["/central/cursos/novo", "pages.central.cursos.novo"],
  ["/central/cursos/editar", "pages.central.cursos.editar"],
  ["/central/cursos/ver", "pages.central.cursos.ver"],
  ["/central/sorteios", "pages.central.sorteios.index"],
  ["/central/sorteios/index", "pages.central.sorteios.index"],
  ["/central/sorteios/novo", "pages.central.sorteios.novo"],
  ["/central/sorteios/editar", "pages.central.sorteios.editar"],
  ["/central/sorteios/ver", "pages.central.sorteios.ver"],
  ["/central/repasses", "pages.central.payouts"],
  ["/central/repasses/index", "pages.central.repasses.index"],
  ["/central/repasses/ver", "pages.central.repasses.ver"],
  ["/central/solicitacoes", "pages.central.requests"],
  ["/central/solicitacoes/index", "pages.central.solicitacoes.index"],
  ["/central/solicitacoes/ver", "pages.central.solicitacoes.ver"],
  ["/configuracoes", "pages.account.settings"],
  ["/minha-area", "pages.customer.dashboard"],
  ["/empresas/adicionar", "pages.account.add-company"],
  ["/meu-espaco", "pages.company.portal"],
  ["/meu-espaco/perfil", "pages.company.portal-profile"],
  ["/meu-espaco/associados", "pages.company.portal-associates"],
  ["/meu-espaco/noticias", "pages.company.portal-news"],
  ["/meu-espaco/catalogo", "pages.company.portal-catalog"],
  ["/meu-espaco/compras", "pages.company.portal-sales"],
  ["/meu-espaco/cobrancas", "pages.company.portal-payment-requests"],
  ["/meu-espaco/usuarios", "pages.company.portal-users"],
  ["/meu-espaco/senha", "pages.company.change-password"],
  ["/meu-cartao", "pages.account.card"],
  ["/minhas-compras", "pages.account.purchases"],
  ["/minha-area/pagamentos", "pages.customer.payments"],
  ["/minha-area/pagamentos/ler-qrcode", "pages.customer.payment-scanner"],
]);

export function resolveViewForPath(pathname: string) {
  const exact = exactViewRoutes.get(pathname);
  if (exact) {
    return exact;
  }

  if (/^\/convite\/empresa\/[A-Za-z0-9\-_]+$/.test(pathname)) {
    return "pages.auth.company-user-invite-register";
  }

  if (/^\/convite\/empreendedor\/[A-Za-z0-9\-_]+$/.test(pathname)) {
    return "pages.auth.convite.empreendedor";
  }

  if (/^\/pagamento\/[A-Za-z0-9\-_]+$/.test(pathname)) {
    return "pages.payments.show";
  }

  return "";
}

const backendToFrontendAuthRoutes = new Map<string, string>([
  ["/auth/login", "/login"],
  ["/auth/senha/recuperar", "/senha/recuperar"],
  ["/auth/senha/redefinir", "/senha/redefinir"],
  ["/auth/clientes/cadastro", "/clientes/cadastro"],
]);

export function frontendPathFromBackendPath(pathname: string) {
  const normalized = pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  const authRoute = backendToFrontendAuthRoutes.get(normalized);
  if (authRoute) {
    return authRoute;
  }

  if (exactRoutes.has(normalized)) {
    return normalized;
  }

  for (const [frontendPath, route] of exactRoutes.entries()) {
    if (route.type === "page" && route.backendPath === normalized) {
      return frontendPath;
    }
  }

  for (const item of tokenRoutePatterns) {
    if (item.pattern.test(normalized)) {
      return normalized;
    }
  }

  return normalized;
}
