"use client";

import { useEffect, useState } from "react";
import {
  createPaymentIntentAction,
  syncPaymentStatusAction,
} from "@/app/actions/backend-actions";

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => {
      elements: (options: {
        appearance?: Record<string, unknown>;
        clientSecret: string;
      }) => {
        create: (
          type: string,
          options?: Record<string, unknown>,
        ) => {
          mount: (selector: string) => void;
        };
      };
      confirmPayment: (options: {
        elements: {
          create: (
            type: string,
            options?: Record<string, unknown>,
          ) => {
            mount: (selector: string) => void;
          };
        };
        redirect: "if_required";
      }) => Promise<{
        error?: { message?: string };
        paymentIntent?: { status?: string };
      }>;
    };
  }
}

async function loadStripeJs() {
  if (window.Stripe) {
    return window.Stripe;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://js.stripe.com/v3/"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Não foi possível carregar o Stripe.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Não foi possível carregar o Stripe."));
    document.head.appendChild(script);
  });

  if (!window.Stripe) {
    throw new Error("Não foi possível inicializar o Stripe.");
  }

  return window.Stripe;
}

export function StripePaymentForm({
  amountLabel,
  token,
}: {
  amountLabel: string;
  token: string;
}) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeState, setStripeState] = useState<{
    elements?: {
      create: (
        type: string,
        options?: Record<string, unknown>,
      ) => {
        mount: (selector: string) => void;
      };
    };
    stripe?: ReturnType<NonNullable<Window["Stripe"]>>;
  }>({});

  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const Stripe = await loadStripeJs();
        const intentPayload = (await createPaymentIntentAction(token)) as {
          client_secret?: string;
          message?: string;
          publishable_key?: string;
          success?: boolean;
        };

        const stripe = Stripe(String(intentPayload.publishable_key || ""));
        const elements = stripe.elements({
          appearance: {
            theme: "stripe",
            variables: {
              borderRadius: "14px",
              colorPrimary: "#f59e0b",
            },
          },
          clientSecret: String(intentPayload.client_secret || ""),
        });
        const paymentElement = elements.create("payment", {
          billingDetails: "auto",
          layout: "tabs",
        });
        paymentElement.mount("#payment-element");

        if (!active) {
          return;
        }

        setStripeState({ elements, stripe });
        setStripeReady(true);
      } catch (error) {
        if (!active) {
          return;
        }
        setMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar o Stripe.",
        );
        setMessageType("error");
      }
    }

    init();
    return () => {
      active = false;
    };
  }, [token]);

  async function syncPaymentStatus() {
    await syncPaymentStatusAction(token);
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!stripeState.stripe || !stripeState.elements) {
          return;
        }

        setMessage("");
        setMessageType("error");
        setIsSubmitting(true);

        try {
          const result = await stripeState.stripe.confirmPayment({
            elements: stripeState.elements,
            redirect: "if_required",
          });

          if (result.error) {
            setMessage(result.error.message || "Pagamento recusado.");
            setIsSubmitting(false);
            return;
          }

          if (
            result.paymentIntent &&
            ["succeeded", "processing"].includes(
              String(result.paymentIntent.status || ""),
            )
          ) {
            setMessageType("success");
            setMessage(
              result.paymentIntent.status === "succeeded"
                ? "Pagamento aprovado. Atualizando a cobrança..."
                : "Pagamento em processamento. Atualizando a cobrança...",
            );
            try {
              await syncPaymentStatus();
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "Pagamento aprovado, mas a sincronização local falhou.",
              );
            }
            window.setTimeout(() => window.location.reload(), 900);
            return;
          }

          setMessageType("success");
          setMessage("Pagamento enviado. Aguarde a atualização do status.");
          try {
            await syncPaymentStatus();
          } catch {
            // O webhook ainda pode atualizar o status depois.
          }
          window.setTimeout(() => window.location.reload(), 900);
        } catch (error) {
          setMessage(
            error instanceof Error ? error.message : "Pagamento recusado.",
          );
          setMessageType("error");
          setIsSubmitting(false);
        }
      }}
    >
      <div
        id="payment-element"
        className="rounded-2xl border border-base-300 p-4"
      />
      <button
        className="btn btn-primary w-full"
        disabled={!stripeReady || isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-sm" />
        ) : null}
        Pagar {amountLabel}
      </button>
      {message ? (
        <p
          aria-live="polite"
          className={
            messageType === "success"
              ? "text-sm text-success"
              : "text-sm text-error"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
