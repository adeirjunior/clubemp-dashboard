const backendToFrontendRoutes = new Map<string, string>([
  ["/auth/login", "/login"],
  ["/auth/senha/recuperar", "/senha/recuperar"],
  ["/auth/senha/redefinir", "/senha/redefinir"],
  ["/auth/clientes/cadastro", "/clientes/cadastro"],
  ["/dashboard/central", "/"],
  ["/dashboard/central/solicitacoes", "/solicitacoes"],
  ["/dashboard/central/repasses", "/repasses"],
  ["/dashboard/central/compras", "/compras"],
  ["/dashboard/central/empresas", "/empresas"],
  ["/dashboard/central/clientes", "/clientes"],
  ["/dashboard/central/eventos", "/eventos"],
  ["/dashboard/central/cursos", "/cursos"],
  ["/dashboard/central/sorteios", "/sorteios"],
  ["/dashboard/central/cidades", "/cidades"],
  ["/dashboard/central/categorias", "/categorias"],
  ["/dashboard/central/privacidade", "/privacidade"],
  ["/dashboard/central/saude", "/saude"],
  ["/dashboard/central/convites/empreendedores", "/convites/empreendedores"],
  ["/portal/configuracoes", "/configuracoes"],
  ["/portal/minha-area", "/"],
  ["/portal/empresas/adicionar", "/empresas/adicionar"],
  ["/portal/meu-espaco", "/"],
  ["/portal/meu-espaco/perfil", "/perfil"],
  ["/portal/meu-espaco/assinatura", "/assinatura"],
  ["/portal/meu-espaco/assinatura/portal", "/assinatura"],
  ["/portal/meu-espaco/associados", "/associados"],
  ["/dashboard/central/noticias", "/noticias"],
  ["/dashboard/central/noticias/novo", "/noticias/novo"],
  ["/dashboard/central/noticias/ver", "/noticias/ver"],
  ["/dashboard/central/noticias/editar", "/noticias/editar"],
  ["/portal/meu-espaco/noticias", "/noticias"],
  ["/portal/meu-espaco/noticias/novo", "/noticias/novo"],
  ["/portal/meu-espaco/noticias/ver", "/noticias/ver"],
  ["/portal/meu-espaco/noticias/editar", "/noticias/editar"],
  ["/portal/meu-espaco/eventos", "/eventos"],
  ["/portal/meu-espaco/catalogo", "/catalogo"],
  ["/portal/meu-espaco/compras", "/compras"],
  ["/portal/meu-espaco/cobrancas", "/pagamentos"],
  ["/portal/meu-espaco/usuarios", "/usuarios"],
  ["/portal/meu-cartao", "/meu-cartao"],
  ["/portal/minhas-compras", "/compras"],
  ["/portal/minha-area/pagamentos", "/pagamentos"],
  ["/portal/minha-area/pagamentos/ler-qrcode", "/pagamentos/ler-qrcode"],
  ["/portal/meu-espaco/senha", "/"],
]);

export function frontendPathFromBackendPath(pathname: string) {
  const normalized = pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  const exactRoute = backendToFrontendRoutes.get(normalized);

  if (exactRoute) {
    return exactRoute;
  }

  if (normalized.startsWith("/dashboard/central/")) {
    return normalized.replace(/^\/dashboard\/central/, "");
  }

  return normalized;
}
