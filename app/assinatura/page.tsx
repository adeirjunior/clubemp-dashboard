import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/assinatura",
    await searchParams,
    "/assinatura",
  );
  const user = asRecord(data.user);
  const subscription = asRecord(data.subscription);
  const plan = asRecord(subscription.plan);
  const status = String(subscription.status || "pending");
  const isActive = status === "active" || status === "trialing";
  const hasScheduledCancel = Boolean(subscription.cancel_requested_at);

  return (
    <section className="space-y-5">
      <header className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
          Assinatura
        </p>
        <h1 className="mt-1 text-2xl font-black">Plano empreendedor</h1>
        <p className="mt-2 text-sm text-base-content/70">
          Consulte o plano atual e acesse o portal do cliente Stripe para
          atualizar pagamento, nota fiscal, cartão ou cancelamento.
        </p>
      </header>

      <article className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="card-title">
                  <LucideIcon name="wallet" className="h-5 w-5" />
                  {String(plan.name || "Assinatura empreendedora")}
                </h2>
                <p className="text-sm text-base-content/65">
                  Conta de {String(user.name || "empreendedor")}
                </p>
              </div>
              <span
                className={`badge ${isActive ? "badge-success" : "badge-warning"} font-bold`}
              >
                {statusLabel(status)}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Valor"
                value={String(plan.amount_label || "Indisponível")}
              />
              <Metric label="Recorrência" value={intervalLabel(plan)} />
              <Metric
                label="Válido até"
                value={formatDate(subscription.valid_until)}
              />
              <Metric
                label="Compromisso até"
                value={formatDate(subscription.minimum_commitment_until)}
              />
              <Metric
                label="Cancelamento"
                value={
                  hasScheduledCancel
                    ? `Agendado para ${formatDate(subscription.cancel_effective_at)}`
                    : "Não solicitado"
                }
              />
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4 text-sm text-base-content/70">
              <p>
                O status é sincronizado pelo webhook do gateway de assinatura.
                Alterações feitas no portal do cliente podem levar alguns
                instantes para aparecer aqui.
              </p>
            </div>
          </div>
        </section>

        <aside className="card border border-primary/20 bg-primary/10 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-base">
              <LucideIcon name="external-link" className="h-4 w-4" />
              Portal da assinatura
            </h3>
            <p className="text-sm text-base-content/70">
              Abra o portal seguro do gateway para gerenciar sua assinatura.
            </p>
            <BackendForm
              backendPath="/portal/meu-espaco/assinatura/portal"
              className="mt-2"
            >
              <button className="btn btn-primary w-full gap-2" type="submit">
                <LucideIcon name="credit-card" className="h-4 w-4" />
                Acessar portal do cliente
              </button>
            </BackendForm>
            {hasScheduledCancel ? (
              <BackendForm
                backendPath="/portal/meu-espaco/assinatura/reverter-cancelamento"
                className="mt-2"
              >
                <button className="btn btn-outline w-full gap-2" type="submit">
                  <LucideIcon name="rotate-ccw" className="h-4 w-4" />
                  Reverter cancelamento
                </button>
              </BackendForm>
            ) : (
              <BackendForm
                backendPath="/portal/meu-espaco/assinatura/cancelar"
                className="mt-2"
              >
                <button className="btn btn-outline w-full gap-2" type="submit">
                  <LucideIcon name="calendar-x" className="h-4 w-4" />
                  Solicitar cancelamento
                </button>
              </BackendForm>
            )}
          </div>
        </aside>
      </article>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-base-content/50">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value || "-"}</p>
    </div>
  );
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    active: "Ativa",
    canceled: "Cancelada",
    incomplete: "Incompleta",
    incomplete_expired: "Expirada",
    past_due: "Em atraso",
    pending: "Pendente",
    trialing: "Teste",
    unpaid: "Não paga",
  };

  return labels[status] || status || "Pendente";
}

function intervalLabel(plan: Record<string, unknown>) {
  const interval = String(plan.interval || "");
  const count = Number(plan.interval_count || 1);
  const labels: Record<string, string> = {
    day: count === 1 ? "dia" : "dias",
    month: count === 1 ? "mês" : "meses",
    week: count === 1 ? "semana" : "semanas",
    year: count === 1 ? "ano" : "anos",
  };

  if (!interval) {
    return "Indisponível";
  }

  return count > 1
    ? `A cada ${count} ${labels[interval] || "períodos"}`
    : `Por ${labels[interval] || "período"}`;
}

function formatDate(value: unknown) {
  const raw = String(value || "");
  if (!raw) {
    return "Indisponível";
  }

  const date = new Date(raw.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) {
    return raw;
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
