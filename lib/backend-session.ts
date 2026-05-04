export const BACKEND_STATE_KEYS = [
  "auth_user",
  "dashboard_contexts",
  "active_dashboard_context",
  "flash_error",
  "flash_success",
  "old_email",
] as const;

export type BackendAuthUser = {
  name?: string;
  email?: string;
  profile_image_url?: string;
  preferred_theme?: string;
};

export type DashboardContext = {
  key?: string;
  label?: string;
  badge?: string;
  path?: string;
  kind?: string;
};

export type BackendSessionState = {
  auth_user?: BackendAuthUser;
  dashboard_contexts?: DashboardContext[];
  active_dashboard_context?: string;
  flash_error?: string;
  flash_success?: string;
  old_email?: string;
};

export function decodeBackendSessionState(
  encoded: string | undefined | null,
): BackendSessionState {
  if (!encoded) {
    return {};
  }

  try {
    const json = Buffer.from(encoded, "base64").toString("utf-8");
    const parsed = JSON.parse(json) as BackendSessionState;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}
