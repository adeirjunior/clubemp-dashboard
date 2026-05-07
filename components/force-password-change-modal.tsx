"use client";

import { useEffect } from "react";
import { BackendForm } from "./backend-form";
import { LucideIcon } from "./lucide-icon";

type ForcePasswordChangeModalProps = {
  open: boolean;
  flashError?: string;
};

export function ForcePasswordChangeModal({
  open,
  flashError,
}: ForcePasswordChangeModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="force-password-change-title"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <LucideIcon name="shield-check" className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Primeiro acesso
            </p>
            <h2
              className="mt-1 text-2xl font-black leading-tight text-base-content"
              id="force-password-change-title"
            >
              Altere sua senha para continuar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/65">
              Esta etapa é obrigatória para liberar a navegação no dashboard.
            </p>
          </div>
        </div>

        {flashError ? (
          <div className="alert alert-error mb-4">
            <span>{flashError}</span>
          </div>
        ) : null}

        <BackendForm
          backendPath="/portal/meu-espaco/senha"
          className="space-y-4"
          defaultError="Não foi possível alterar a senha."
        >
          <label className="form-control w-full">
            <span className="label">
              <span className="label-text font-semibold">Nova senha</span>
            </span>
            <input
              autoComplete="new-password"
              className="input input-bordered w-full"
              minLength={8}
              name="password"
              placeholder="Mínimo de 8 caracteres"
              required
              type="password"
            />
          </label>

          <label className="form-control w-full">
            <span className="label">
              <span className="label-text font-semibold">
                Confirme a nova senha
              </span>
            </span>
            <input
              autoComplete="new-password"
              className="input input-bordered w-full"
              minLength={8}
              name="password_confirmation"
              placeholder="Digite a senha novamente"
              required
              type="password"
            />
          </label>

          <button className="btn btn-primary w-full gap-2" type="submit">
            <LucideIcon name="lock-keyhole" className="h-4 w-4" />
            Salvar nova senha
          </button>
        </BackendForm>
      </div>
    </div>
  );
}
