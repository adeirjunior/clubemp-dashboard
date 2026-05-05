"use server";

import { cookies } from "next/headers";
import {
  BACKEND_STATE_COOKIE,
  fetchBackendResponse,
  sanitizeBackendLocation,
} from "@/lib/backend";

type BackendActionState = {
  error?: string;
  redirectTo?: string;
  success?: boolean;
};

async function persistBackendState(response: Response, backendPath: string) {
  const cookieStore = await cookies();
  const nextState = response.headers.get("x-clubemp-session-state");

  if (nextState) {
    cookieStore.set(BACKEND_STATE_COOKIE, nextState, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return;
  }

  if (backendPath === "/auth/logout") {
    cookieStore.delete(BACKEND_STATE_COOKIE);
  }
}

export async function submitBackendFormAction(
  _previousState: BackendActionState,
  formData: FormData,
): Promise<BackendActionState> {
  const backendPathValue = formData.get("__backendPath");
  const onSuccessValue = formData.get("__onSuccess");
  const backendPath =
    typeof backendPathValue === "string" ? backendPathValue : "";
  const onSuccess = onSuccessValue === "stay" ? "stay" : "reload";

  if (!backendPath) {
    return {
      error: "Ação de backend inválida.",
      success: false,
    };
  }

  formData.delete("__backendPath");
  formData.delete("__onSuccess");

  const response = await fetchBackendResponse(backendPath, {
    body: formData,
    method: "POST",
  });

  await persistBackendState(response, backendPath);

  const location = response.headers.get("location");
  if (response.status >= 300 && response.status < 400 && location) {
    return {
      redirectTo: sanitizeBackendLocation(location),
      success: true,
    };
  }

  if (backendPath === "/auth/logout") {
    return {
      redirectTo: "/login",
      success: true,
    };
  }

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    redirect_url?: string;
    success?: boolean;
  };

  if (!response.ok || payload.success === false) {
    return {
      error: payload.message || "Não foi possível concluir a solicitação.",
      success: false,
    };
  }

  return {
    redirectTo:
      typeof payload.redirect_url === "string" && payload.redirect_url
        ? sanitizeBackendLocation(payload.redirect_url)
        : onSuccess === "reload"
          ? "__refresh__"
          : "",
    success: true,
  };
}

export async function createPaymentIntentAction(token: string) {
  const response = await fetchBackendResponse(`/pagamento/${token}/intent`, {
    method: "POST",
  });

  await persistBackendState(response, `/pagamento/${token}/intent`);

  const payload = (await response.json().catch(() => ({}))) as {
    client_secret?: string;
    message?: string;
    publishable_key?: string;
    success?: boolean;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Não foi possível iniciar o pagamento.");
  }

  return payload;
}

export async function syncPaymentStatusAction(token: string) {
  const response = await fetchBackendResponse(
    `/pagamento/${token}/sincronizar`,
    {
      method: "POST",
    },
  );

  await persistBackendState(response, `/pagamento/${token}/sincronizar`);

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    success?: boolean;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(
      payload.message || "Não foi possível sincronizar o status do pagamento.",
    );
  }

  return payload;
}
