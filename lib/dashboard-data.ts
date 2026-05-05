import { redirect } from "next/navigation";
import { fetchBackendDataPayload } from "@/lib/backend";

export type QueryParams = Record<string, string | string[] | undefined>;
export type DashboardData = Record<string, unknown>;

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

export function normalizeBackendData<T>(input: T): T {
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

export function firstQueryValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  return Array.isArray(value) ? value[0] : "";
}

function overrideBackendPath(
  pathname: string,
  query: QueryParams,
  path: string,
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

  return path;
}

export async function loadDashboardData(
  backendPath: string,
  query: QueryParams,
  pathname = backendPath,
) {
  const path = overrideBackendPath(pathname, query, backendPath);
  const payload = await fetchBackendDataPayload(path, query);

  if (payload.redirectTo) {
    redirect(payload.redirectTo);
  }

  return normalizeBackendData(payload.data);
}

export async function loadCentralOverviewData() {
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

  const redirectTarget =
    requests.redirectTo ||
    payouts.redirectTo ||
    companies.redirectTo ||
    customers.redirectTo ||
    news.redirectTo ||
    events.redirectTo ||
    courses.redirectTo ||
    giveaways.redirectTo;

  if (redirectTarget) {
    redirect(redirectTarget);
  }

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
  } satisfies DashboardData;
}

export function asRecord(value: unknown) {
  return (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
}

export function asRecordArray(value: unknown) {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

export function boolish(value: unknown) {
  return value === true || value === 1 || value === "1";
}
