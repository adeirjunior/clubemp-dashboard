import { notFound, redirect } from "next/navigation";
import { LegacyViewRenderer } from "@/components/legacy-view-renderer";
import { fetchBackendDataPayload } from "@/lib/backend";
import { resolveLegacyRoute, resolveViewForPath } from "@/lib/route-map";

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function normalizeBackendData<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => normalizeBackendData(item)) as T;
  }

  if (!input || typeof input !== "object") {
    return input;
  }

  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    const nextValue = normalizeBackendData(value);
    normalized[key] = nextValue;
    const camelKey = toCamelCase(key);
    if (!(camelKey in normalized)) {
      normalized[camelKey] = nextValue;
    }
  }

  return normalized as T;
}

function firstQueryValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return Array.isArray(value) ? value[0] : "";
}

function overrideBackendPath(
  pathname: string,
  query: Record<string, string | string[] | undefined>,
  backendPath: string,
) {
  const queryId = firstQueryValue(query.id);

  if (pathname === "/central/clientes/ver" && queryId) {
    return `/dashboard/central/clientes/${queryId}`;
  }

  if (
    (pathname === "/central/cidades/ver" ||
      pathname === "/central/cidades/editar") &&
    queryId
  ) {
    return `/dashboard/central/cidades/${queryId}`;
  }

  if (
    (pathname === "/central/categorias/ver" ||
      pathname === "/central/categorias/editar") &&
    queryId
  ) {
    return `/dashboard/central/categorias/${queryId}`;
  }

  if (pathname === "/central/repasses/ver" && queryId) {
    return `/dashboard/central/repasses/${queryId}`;
  }

  if (pathname === "/central/solicitacoes/ver" && queryId) {
    return `/dashboard/central/solicitacoes/${queryId}`;
  }

  return backendPath;
}

function adaptDataForView(
  pathname: string,
  view: string,
  data: Record<string, unknown>,
  query: Record<string, string | string[] | undefined>,
) {
  const adapted = { ...data };
  const items = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const item =
    data.item && typeof data.item === "object"
      ? (data.item as Record<string, unknown>)
      : null;

  if (view === "pages.central.clientes.index") {
    adapted.customers = items;
    adapted.customersCount = items.length;
  }

  if (view === "pages.central.clientes.ver" && item) {
    adapted.customer = item;
  }

  if (view === "pages.central.cidades.index") {
    adapted.cities = items;
  }

  if (
    (view === "pages.central.cidades.ver" ||
      view === "pages.central.cidades.editar") &&
    item
  ) {
    adapted.city = item;
    adapted.cityId = item.id || firstQueryValue(query.id) || 0;
  }

  if (view === "pages.central.categorias.index") {
    adapted.categories = items;
  }

  if (
    (view === "pages.central.categorias.ver" ||
      view === "pages.central.categorias.editar") &&
    item
  ) {
    adapted.category = item;
    adapted.categoryId = item.id || firstQueryValue(query.id) || 0;
  }

  if (view === "pages.central.noticias.index") {
    adapted.posts = items;
  }

  if (view === "pages.central.eventos.index") {
    adapted.events = items;
  }

  if (view === "pages.central.cursos.index") {
    adapted.courses = items;
  }

  if (view === "pages.central.sorteios.index") {
    adapted.giveaways = items;
  }

  if (view === "pages.central.repasses.index") {
    adapted.payouts = items;
  }

  if (view === "pages.central.solicitacoes.index") {
    adapted.requests = items;
  }

  if (view === "pages.central.requests") {
    adapted.requests = items;
    adapted.requestsCount = items.length;
    adapted.statusFilter = firstQueryValue(query.status) || "all";
    adapted.typeFilter = firstQueryValue(query.type) || "all";
    adapted.statusOptions = {
      all: "Todos",
      new: "Novo",
      in_contact: "Em contato",
      approved: "Aprovado",
      rejected: "Recusado",
    };
    adapted.typeOptions = {
      all: "Todos",
      empreendedora: "Empreendedora",
      conveniada: "Conveniada",
      ambos: "Ambos",
    };
  }

  if (view === "pages.central.solicitacoes.ver" && item) {
    adapted.request = item;
  }

  if (view === "pages.central.payouts") {
    adapted.pendingPayouts = items;
    adapted.pendingPayoutsCount = items.length;
    adapted.financeMetrics = adapted.financeMetrics || {};
  }

  if (view === "pages.central.repasses.ver" && item) {
    adapted.payout = item;
  }

  if (view === "pages.central.sales") {
    adapted.salesRows = items;
    adapted.salesSummary = {
      paidCount: items.filter(
        (row) =>
          String(row.paymentStatus || row.payment_status || "") === "paid",
      ).length,
      pendingCount: items.filter(
        (row) =>
          String(row.paymentStatus || row.payment_status || "") !== "paid",
      ).length,
      salesCount: items.length,
      totalAmount: "-",
      paidAmount: "-",
      uniqueCustomers: new Set(
        items.map((row) =>
          String(row.buyerCustomerId || row.buyer_customer_id || ""),
        ),
      ).size,
    };
  }

  if (pathname === "/central") {
    return adapted;
  }

  return adapted;
}

async function loadCentralOverviewData() {
  const [
    requests,
    payouts,
    companies,
    customers,
    news,
    events,
    courses,
    giveaways,
  ] = await Promise.all([
    fetchBackendDataPayload("/dashboard/central/solicitacoes", {}),
    fetchBackendDataPayload("/dashboard/central/repasses", {}),
    fetchBackendDataPayload("/dashboard/central/empresas", {}),
    fetchBackendDataPayload("/dashboard/central/clientes", {}),
    fetchBackendDataPayload("/dashboard/central/noticias", {}),
    fetchBackendDataPayload("/dashboard/central/eventos", {}),
    fetchBackendDataPayload("/dashboard/central/cursos", {}),
    fetchBackendDataPayload("/dashboard/central/sorteios", {}),
  ]);

  const requestItems = Array.isArray(requests.data.items)
    ? requests.data.items
    : [];
  const payoutItems = Array.isArray(payouts.data.items)
    ? payouts.data.items
    : [];
  const companyItems = Array.isArray(companies.data.companies)
    ? companies.data.companies
    : [];
  const customerItems = Array.isArray(customers.data.items)
    ? customers.data.items
    : [];
  const newsItems = Array.isArray(news.data.items) ? news.data.items : [];
  const eventItems = Array.isArray(events.data.items) ? events.data.items : [];
  const courseItems = Array.isArray(courses.data.items)
    ? courses.data.items
    : [];
  const giveawayItems = Array.isArray(giveaways.data.items)
    ? giveaways.data.items
    : [];

  return {
    blogPostsCount: newsItems.length,
    companiesCount: companyItems.length,
    coursesCount: courseItems.length,
    customersCount: customerItems.length,
    eventsCount: eventItems.length,
    financeMetrics: {},
    giveawaysCount: giveawayItems.length,
    pendingPayoutsCount: payoutItems.length,
    requestsCount: requestItems.length,
  } satisfies Record<string, unknown>;
}

function paymentStatusLabel(status: string) {
  switch (status) {
    case "paid":
      return "Pago";
    case "canceled":
      return "Cancelado";
    case "processing":
      return "Processando";
    case "requires_payment_method":
      return "Aguardando pagamento";
    default:
      return "Pendente";
  }
}

async function loadCustomerPaymentsFallbackData() {
  const dashboard = await fetchBackendDataPayload("/portal/minha-area", {});
  const source = normalizeBackendData(dashboard.data);
  const purchases = Array.isArray(source.purchases)
    ? (source.purchases as Record<string, unknown>[])
    : [];
  const summary =
    source.summary && typeof source.summary === "object"
      ? (source.summary as Record<string, unknown>)
      : {};

  const paymentRequests = purchases.map((purchase) => {
    const status = String(purchase.paymentStatus || purchase.payment_status || "");
    return {
      amountLabel: String(
        purchase.totalAmount || purchase.total_amount || "R$ 0,00",
      ),
      companyName: String(
        purchase.vendorName || purchase.vendor_name || "Empresa Clubemp",
      ),
      createdAt: String(purchase.createdAt || purchase.created_at || ""),
      description: String(
        purchase.itemName ||
          purchase.item_name ||
          purchase.description ||
          "Compra registrada",
      ),
      id: String(purchase.id || ""),
      paymentUrl: "",
      status,
      statusLabel: paymentStatusLabel(status),
    };
  });

  return {
    flashError: String(source.flashError || source.flash_error || ""),
    flashSuccess: String(source.flashSuccess || source.flash_success || ""),
    navItems: Array.isArray(source.navItems) ? source.navItems : [],
    paymentRequests,
    summary,
  } satisfies Record<string, unknown>;
}

export async function renderLegacyPage(
  pathname: string,
  query: Record<string, string | string[] | undefined>,
) {
  const route = resolveLegacyRoute(pathname);

  if (!route) {
    notFound();
  }

  if (route.type === "redirect") {
    redirect(route.to);
  }

  if (route.type === "local") {
    return (
      <LegacyViewRenderer
        currentPath={pathname}
        data={{}}
        query={query}
        routePath={pathname}
        view={route.view}
      />
    );
  }

  const view = resolveViewForPath(pathname);
  if (!view) {
    notFound();
  }

  if (pathname === "/central") {
    return (
      <LegacyViewRenderer
        currentPath={pathname}
        data={normalizeBackendData(await loadCentralOverviewData())}
        query={query}
        routePath={route.backendPath}
        view={view}
      />
    );
  }

  if (
    pathname === "/central/cidades/novo" ||
    pathname === "/central/categorias/novo"
  ) {
    return (
      <LegacyViewRenderer
        currentPath={pathname}
        data={{}}
        query={query}
        routePath={route.backendPath}
        view={view}
      />
    );
  }

  if (pathname === "/minha-area/pagamentos") {
    return (
      <LegacyViewRenderer
        currentPath={pathname}
        data={await loadCustomerPaymentsFallbackData()}
        query={query}
        routePath={route.backendPath}
        view={view}
      />
    );
  }

  if (pathname === "/minha-area/pagamentos/ler-qrcode") {
    return (
      <LegacyViewRenderer
        currentPath={pathname}
        data={{}}
        query={query}
        routePath={route.backendPath}
        view={view}
      />
    );
  }

  const backendPath = overrideBackendPath(pathname, query, route.backendPath);
  const payload = await fetchBackendDataPayload(backendPath, query);

  if (payload.redirectTo) {
    redirect(payload.redirectTo);
  }

  const normalizedData = normalizeBackendData(payload.data);
  const adaptedData = adaptDataForView(pathname, view, normalizedData, query);

  return (
    <LegacyViewRenderer
      currentPath={pathname}
      data={adaptedData}
      query={query}
      routePath={backendPath}
      view={view}
    />
  );
}
