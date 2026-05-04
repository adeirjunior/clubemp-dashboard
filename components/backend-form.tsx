"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { submitBackendFormAction } from "@/app/actions/backend-actions";

type BackendFormProps = {
  backendPath: string;
  children: React.ReactNode;
  className?: string;
  defaultError?: string;
  loadingLabel?: string;
  onSuccess?: "reload" | "stay";
};

export function BackendForm({
  backendPath,
  children,
  className,
  defaultError = "Não foi possível concluir a solicitação.",
  loadingLabel = "Enviando...",
  onSuccess = "reload",
}: BackendFormProps) {
  const router = useRouter();
  const [state, formAction, isSubmitting] = useActionState(
    submitBackendFormAction,
    {},
  );

  useEffect(() => {
    if (!state?.success) {
      return;
    }

    if (state.redirectTo && state.redirectTo !== "__refresh__") {
      router.push(state.redirectTo);
      router.refresh();
      return;
    }

    if (state.redirectTo === "__refresh__" && onSuccess === "reload") {
      router.refresh();
    }
  }, [onSuccess, router, state]);

  return (
    <form action={formAction} className={className}>
      <input name="__backendPath" type="hidden" value={backendPath} />
      <input name="__onSuccess" type="hidden" value={onSuccess} />
      {state?.error ? (
        <div className="alert alert-error mb-4">
          <span>{state.error || defaultError}</span>
        </div>
      ) : null}
      <fieldset disabled={isSubmitting} className="contents w-full!">
        {children}
      </fieldset>
      {isSubmitting ? <span className="hidden">{loadingLabel}</span> : null}
    </form>
  );
}
