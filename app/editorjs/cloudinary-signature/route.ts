import { fetchBackendResponse, readBackendSession } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const kind =
    typeof (body as { kind?: unknown }).kind === "string"
      ? String((body as { kind: string }).kind)
      : "editor-image";
  const session = await readBackendSession();
  const role =
    typeof session.auth_user?.role === "string" ? session.auth_user.role : "";
  const isInternal = role === "admin" || role === "employee";

  const response = await fetchBackendResponse(
    isInternal
      ? "/dashboard/central/uploads/cloudinary/assinatura"
      : "/meu-espaco/uploads/cloudinary/assinatura",
    {
      body: JSON.stringify({ kind }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  return cloneJsonResponse(response);
}

async function cloneJsonResponse(response: Response) {
  const text = await response.text();

  return new Response(text || "{}", {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type":
        response.headers.get("content-type") || "application/json",
    },
    status: response.status,
  });
}
