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

  if (pathname === "/clientes/ver" && queryId) {
    return `/dashboard/central/clientes/${queryId}`;
  }

  if (
    (pathname === "/cidades/ver" || pathname === "/cidades/editar") &&
    queryId
  ) {
    return `/dashboard/central/cidades/${queryId}`;
  }

  if (
    (pathname === "/categorias/ver" || pathname === "/categorias/editar") &&
    queryId
  ) {
    return `/dashboard/central/categorias/${queryId}`;
  }

  if (pathname === "/repasses/ver" && queryId) {
    return `/dashboard/central/repasses/${queryId}`;
  }

  if (pathname === "/solicitacoes/ver" && queryId) {
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
  const payload = await fetchBackendDataPayload("/dashboard/central", {});

  if (payload.redirectTo) {
    redirect(payload.redirectTo);
  }

  const data = normalizeBackendData(payload.data);
  const counters = asRecord(data.counters);

  return {
    blogPostsCount: counters.blogPosts ?? 0,
    companiesCount: counters.companies ?? 0,
    coursesCount: counters.courses ?? 0,
    customersCount: counters.customers ?? 0,
    eventsCount: counters.events ?? 0,
    financeMetrics: asRecord(data.financeMetrics),
    giveawaysCount: counters.giveaways ?? 0,
    pendingPayoutsCount: counters.pendingPayouts ?? 0,
    requestsCount: counters.requests ?? 0,
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
