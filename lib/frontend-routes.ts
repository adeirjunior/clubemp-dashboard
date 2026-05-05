const backendToFrontendRoutes = new Map<string, string>([
  ["/auth/login", "/login"],
  ["/auth/senha/recuperar", "/senha/recuperar"],
  ["/auth/senha/redefinir", "/senha/redefinir"],
  ["/auth/clientes/cadastro", "/clientes/cadastro"],
  ["/dashboard/central", "/central"],
  ["/dashboard/central/solicitacoes", "/central/solicitacoes"],
  ["/dashboard/central/repasses", "/central/repasses"],
  ["/dashboard/central/compras", "/central/compras"],
  ["/dashboard/central/empresas", "/central/empresas"],
  ["/dashboard/central/clientes", "/central/clientes"],
  ["/dashboard/central/privacidade", "/central/privacidade"],
  ["/dashboard/central/saude", "/central/saude"],
  ["/portal/configuracoes", "/configuracoes"],
  ["/portal/minha-area", "/minha-area"],
  ["/portal/empresas/adicionar", "/empresas/adicionar"],
  ["/portal/meu-espaco", "/meu-espaco"],
  ["/portal/meu-espaco/perfil", "/meu-espaco/perfil"],
  ["/portal/meu-espaco/associados", "/meu-espaco/associados"],
  ["/portal/meu-espaco/noticias", "/meu-espaco/noticias"],
  ["/portal/meu-espaco/catalogo", "/meu-espaco/catalogo"],
  ["/portal/meu-espaco/compras", "/meu-espaco/compras"],
  ["/portal/meu-espaco/cobrancas", "/meu-espaco/cobrancas"],
  ["/portal/meu-espaco/usuarios", "/meu-espaco/usuarios"],
  ["/portal/meu-cartao", "/meu-cartao"],
  ["/portal/minhas-compras", "/minhas-compras"],
  ["/portal/minha-area/pagamentos", "/minha-area/pagamentos"],
  [
    "/portal/minha-area/pagamentos/ler-qrcode",
    "/minha-area/pagamentos/ler-qrcode",
  ],
  ["/portal/meu-espaco/senha", "/meu-espaco/senha"],
]);

export function frontendPathFromBackendPath(pathname: string) {
  const normalized = pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  return backendToFrontendRoutes.get(normalized) || normalized;
}
