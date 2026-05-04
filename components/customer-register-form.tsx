"use client";

import { useState } from "react";
import { BackendForm } from "./backend-form";
import { LucideIcon } from "./lucide-icon";

function normalizeInviteCode(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

type CustomerRegisterFormProps = {
  loginUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
};

export function CustomerRegisterForm({
  loginUrl,
  privacyPolicyUrl,
  termsUrl,
}: CustomerRegisterFormProps) {
  const [useInviteCode, setUseInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  return (
    <>
      <BackendForm
        backendPath="/auth/clientes/cadastro"
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
      >
        <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3 lg:col-span-2">
          <input
            checked={useInviteCode}
            className="checkbox checkbox-primary mt-0.5"
            name="use_invite_code"
            onChange={(event) => {
              const active = event.target.checked;
              setUseInviteCode(active);
              if (!active) {
                setInviteCode("");
              }
            }}
            type="checkbox"
            value="1"
          />
          <span>
            <span className="block text-sm font-semibold text-base-content">
              Tenho código de convite
            </span>
            <span className="block text-xs text-base-content/70">
              Marque esta opção se você recebeu um código para conectar sua
              conta a uma empresa conveniada.
            </span>
          </span>
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="user-round" />
            Nome completo
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            name="name"
            required
            type="text"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="mail" />
            E-mail
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            name="email"
            required
            type="email"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="phone" />
            Telefone (opcional)
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            name="phone"
            placeholder="(00) 00000-0000"
            type="text"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="lock-keyhole" />
            Senha
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="shield-check" />
            Confirmar senha
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            minLength={6}
            name="password_confirmation"
            required
            type="password"
          />
        </label>

        <label
          className={`form-control w-full ${useInviteCode ? "" : "hidden"}`}
        >
          <span className="label-text mb-2 flex items-center gap-2 font-semibold text-base-content">
            <LucideIcon className="h-4 w-4 text-primary" name="ticket" />
            Código de convite
          </span>
          <input
            className="input input-bordered w-full border-primary/25 bg-base-100 focus:input-primary"
            name="invite_code"
            onChange={(event) => {
              setInviteCode(normalizeInviteCode(event.target.value));
            }}
            placeholder="CNV-123"
            required={useInviteCode}
            type="text"
            value={inviteCode}
          />
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-base-100/70 px-4 py-3 lg:col-span-2">
          <input name="privacy_consent" type="hidden" value="0" />
          <input
            className="checkbox checkbox-primary mt-0.5"
            name="privacy_consent"
            required
            type="checkbox"
            value="1"
          />
          <span className="text-sm text-base-content/80">
            Li e concordo com a{" "}
            <a
              className="link link-primary font-semibold"
              href={privacyPolicyUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Política de Privacidade
            </a>{" "}
            e com os{" "}
            <a
              className="link link-primary font-semibold"
              href={termsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Termos de Serviço
            </a>
            , autorizando o tratamento dos dados informados para este fluxo
            específico.
          </span>
        </label>

        <button
          className="btn btn-primary btn-block mt-2 gap-2 lg:col-span-2"
          type="submit"
        >
          Criar conta
          <LucideIcon className="h-4 w-4" name="arrow-right" />
        </button>
      </BackendForm>

      <p className="mt-5 text-center text-sm text-base-content/75">
        Já possui conta?{" "}
        <a className="link link-primary font-semibold" href={loginUrl}>
          Entrar
        </a>
      </p>
    </>
  );
}
