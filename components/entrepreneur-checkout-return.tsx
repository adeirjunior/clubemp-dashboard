"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { confirmEntrepreneurCheckoutReturn } from "@/app/actions/backend-actions";
import { LucideIcon } from "./lucide-icon";

export function EntrepreneurCheckoutReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const status = searchParams.get("entrepreneur_checkout");
  const sessionId = searchParams.get("session_id") || "";

  useEffect(() => {
    if (status !== "success" || !sessionId) {
      return;
    }

    startTransition(async () => {
      const result = await confirmEntrepreneurCheckoutReturn(sessionId);
      if (!result.success) {
        setError(result.error || "Não foi possível confirmar sua assinatura.");
        return;
      }

      router.replace("/?entrepreneur_checkout=welcome");
      router.refresh();
    });
  }, [router, sessionId, status]);

  if (status === "success" && sessionId && (isPending || !error)) {
    return (
      <div className="toast toast-end toast-bottom z-50">
        <div className="alert alert-info shadow-xl">
          <span className="loading loading-spinner loading-sm" />
          <span>
            Confirmando assinatura e preparando seu modo empreendedor...
          </span>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="toast toast-end toast-bottom z-50">
        <div className="alert alert-warning shadow-xl">
          <LucideIcon name="circle-alert" className="h-5 w-5" />
          <span>Pagamento cancelado. Você continua no modo cliente.</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="toast toast-end toast-bottom z-50">
        <div className="alert alert-error shadow-xl">
          <LucideIcon name="circle-alert" className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (status !== "welcome" || dismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="card w-full max-w-xl border border-amber-200/40 bg-base-100 shadow-2xl">
        <div className="card-body gap-5 p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400 text-amber-950 shadow-lg">
            <LucideIcon name="sparkles" className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-600">
              Assinatura ativa
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Bem-vindo ao modo empresa empreendedora.
            </h2>
            <p className="mt-3 text-sm text-base-content/70">
              Sua assinatura foi confirmada. Agora você pode configurar sua
              empresa, publicar produtos, acessar o marketplace e usar os
              recursos de gestão do Clubemp.
            </p>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary gap-2"
              type="button"
              onClick={() => {
                setDismissed(true);
                router.replace("/");
              }}
            >
              Entrar no painel empreendedor
              <LucideIcon name="arrow-right" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
