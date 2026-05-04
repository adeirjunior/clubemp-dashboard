import { cookies } from "next/headers";
import { decodeBackendSessionState } from "./backend-session";
import { frontendPathFromBackendPath } from "./route-map";

export const BACKEND_STATE_COOKIE = "clubemp_backend_state";

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

  return raw.replace(/\/+$/, "");
}

function enableInsecureTlsForLocalBackend() {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.BACKEND_ALLOW_SELF_SIGNED_TLS === "1"
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
}

export function backendApiUrl(path: string, searchParams?: URLSearchParams) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = backendBaseUrl();
  const url = new URL(`${base}${normalizedPath}`);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
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
  enableInsecureTlsForLocalBackend();
  const cookieStore = await cookies();
  const backendState = cookieStore.get(BACKEND_STATE_COOKIE)?.value ?? "";
  const url = new URL(backendApiUrl(path));
  appendQuery(url, query);

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(backendState ? { "X-Clubemp-Session-State": backendState } : {}),
    },
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400) {
    return {
      data: {},
      redirectTo: sanitizeBackendLocation(
        response.headers.get("location") || "/login",
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
    const pathname = frontendPathFromBackendPath(url.pathname);
    return `${pathname}${url.search}${url.hash}` || "/login";
  } catch {
    const base = backendBaseUrl();
    const relative = location.replace(base, "") || "/login";
    const [pathname, suffix = ""] = relative.split(/(?=[?#])/);
    return `${frontendPathFromBackendPath(pathname)}${suffix}` || "/login";
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
  enableInsecureTlsForLocalBackend();
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

  return fetch(backendApiUrl(path), {
    ...init,
    cache: "no-store",
    headers,
    redirect: "manual",
  });
}
