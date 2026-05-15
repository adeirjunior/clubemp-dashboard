import { cookies } from "next/headers";
import { decodeBackendSessionState } from "./backend-session";
import { frontendPathFromBackendPath } from "./frontend-routes";

export const BACKEND_STATE_COOKIE = "clubemp_backend_state";

let selfSignedBackendTlsConfigured = false;

function backendBaseUrl() {
  const raw =
    process.env.BACKEND_API_URL?.trim() ||
    process.env.BACKEND_BASE_URL?.trim() ||
    "";
  if (!raw) {
    throw new Error(
      "Configure BACKEND_API_URL apontando para o backend já com /api.",
    );
  }

  return normalizeBackendBaseUrl(raw);
}

function normalizeBackendBaseUrl(raw: string) {
  const withoutTrailingSlash = raw.replace(/\/+$/, "");

  if (!allowSelfSignedBackendTls()) {
    return withoutTrailingSlash;
  }

  try {
    const url = new URL(withoutTrailingSlash);
    if (url.protocol === "https:" && url.hostname.endsWith(".ddev.site")) {
      url.protocol = "http:";
      return url.toString().replace(/\/+$/, "");
    }
  } catch {
    return withoutTrailingSlash;
  }

  return withoutTrailingSlash;
}

export function backendApiUrl(path: string, searchParams?: URLSearchParams) {
  const base = backendBaseUrl();
  const rawPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath =
    base.endsWith("/api") && rawPath.startsWith("/api/")
      ? rawPath.slice(4)
      : rawPath;
  const url = new URL(`${base}${normalizedPath}`);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
}

function allowSelfSignedBackendTls() {
  const value = process.env.BACKEND_ALLOW_SELF_SIGNED_TLS?.trim();
  return value === "1" || value === "true";
}

function backendFetchInit(init: RequestInit): RequestInit {
  if (
    !allowSelfSignedBackendTls() ||
    !backendBaseUrl().startsWith("https://")
  ) {
    return init;
  }

  if (!selfSignedBackendTlsConfigured) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    selfSignedBackendTlsConfigured = true;
  }

  return init;
}

function appendQuery(
  url: URL,
  query: Record<string, string | string[] | undefined>,
) {
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string") {
      url.searchParams.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, item);
      }
    }
  }
}

export async function fetchBackendDataPayload(
  path: string,
  query: Record<string, string | string[] | undefined>,
) {
  const cookieStore = await cookies();
  const backendState = cookieStore.get(BACKEND_STATE_COOKIE)?.value ?? "";
  const url = new URL(backendApiUrl(path));
  appendQuery(url, query);

  const response = await fetch(
    url,
    backendFetchInit({
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(backendState ? { "X-Clubemp-Session-State": backendState } : {}),
      },
      redirect: "manual",
    }),
  );

  if (response.status >= 300 && response.status < 400) {
    return {
      data: {},
      redirectTo: sanitizeBackendLocation(
        response.headers.get("location") || "/login",
      ),
      status: response.status,
    };
  }

  if (response.status === 401 || response.status === 403) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      redirect_url?: string;
    } | null;

    if (response.status === 403) {
      throw new Error(
        payload?.message || "Você não possui permissão para acessar esta área.",
      );
    }

    return {
      data: {},
      redirectTo: sanitizeBackendLocation(
        payload?.redirect_url || response.headers.get("location") || "/login",
      ),
      status: response.status,
    };
  }

  const payload = (await response.json().catch(() => null)) as {
    data?: Record<string, unknown>;
    message?: string;
    success?: boolean;
  } | null;

  if (!response.ok) {
    throw new Error(
      payload?.message || `Falha ao carregar dados do backend em ${path}.`,
    );
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(`Resposta inválida do backend em ${path}.`);
  }

  if (payload.success === false) {
    throw new Error(payload.message || `Falha ao carregar dados em ${path}.`);
  }

  if (!payload.data || typeof payload.data !== "object") {
    throw new Error(`Resposta inválida do backend em ${path}.`);
  }

  return {
    data: payload.data as Record<string, unknown>,
    redirectTo: "",
    status: response.status,
  };
}

export function sanitizeBackendLocation(location: string) {
  if (!location) {
    return "/login";
  }

  try {
    const url = new URL(location);
    const backendOrigin = new URL(backendBaseUrl()).origin;
    if (url.origin !== backendOrigin && !isDashboardOrigin(url.origin)) {
      return url.toString();
    }

    const pathname = frontendPathFromBackendPath(url.pathname);
    return `${pathname}${url.search}${url.hash}` || "/login";
  } catch {
    const base = backendBaseUrl();
    const relative = location.replace(base, "") || "/login";
    const [pathname, suffix = ""] = relative.split(/(?=[?#])/);
    return `${frontendPathFromBackendPath(pathname)}${suffix}` || "/login";
  }
}

function isDashboardOrigin(origin: string) {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_APP_URL?.trim() ||
    process.env.DASHBOARD_APP_URL?.trim() ||
    "";
  if (dashboardUrl === "") {
    return false;
  }

  try {
    return new URL(dashboardUrl).origin === origin;
  } catch {
    return false;
  }
}

export async function readBackendSession() {
  const cookieStore = await cookies();
  return decodeBackendSessionState(
    cookieStore.get(BACKEND_STATE_COOKIE)?.value,
  );
}

export async function fetchBackendResponse(
  path: string,
  init?: RequestInit & {
    accept?: string;
  },
) {
  const cookieStore = await cookies();
  const backendState = cookieStore.get(BACKEND_STATE_COOKIE)?.value ?? "";
  const headers = new Headers(init?.headers);

  headers.set(
    "Accept",
    init?.accept || headers.get("Accept") || "application/json",
  );
  headers.set(
    "X-Requested-With",
    headers.get("X-Requested-With") || "XMLHttpRequest",
  );

  if (backendState) {
    headers.set("X-Clubemp-Session-State", backendState);
  }

  return fetch(
    backendApiUrl(path),
    backendFetchInit({
      ...init,
      cache: "no-store",
      headers,
      redirect: "manual",
    }),
  );
}
