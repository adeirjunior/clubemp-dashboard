import { redirect } from "next/navigation";
import { readBackendSession } from "@/lib/backend";
import { frontendPathFromBackendPath } from "@/lib/frontend-routes";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await readBackendSession();
  const activeContext = session.dashboard_contexts?.find(
    (context) => context.key === session.active_dashboard_context,
  );
  const fallbackContext = session.dashboard_contexts?.[0];
  const targetPath =
    typeof activeContext?.path === "string"
      ? activeContext.path
      : typeof fallbackContext?.path === "string"
        ? fallbackContext.path
        : "/login";

  redirect(frontendPathFromBackendPath(targetPath));
}
