import { StripePaymentForm } from "@/components/stripe-payment-form";
import { asRecord, loadDashboardData } from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { token } = await params;
  const data = await loadDashboardData(
    `/pagamento/${token}`,
    await searchParams,
    `/pagamento/${token}`,
  );
  const paymentRequest = asRecord(data.paymentRequest);
  const status = String(paymentRequest.status || "pending");
  const canPay = ["pending", "requires_payment_method", "processing"].includes(
    status,
  );

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <section className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
            Pagamento seguro
          </p>
          <h1 className="mt-2 text-3xl font-black">Cobrança Clubemp</h1>
          <p className="mt-2 text-base-content/70">
            Confira os dados antes de concluir o pagamento.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-base-200 p-4">
              <p className="text-xs uppercase text-base-content/55">Empresa</p>
              <p className="font-bold">
                {String(paymentRequest.company_name || "-")}
              </p>
            </div>
            <div className="rounded-2xl bg-base-200 p-4">
              <p className="text-xs uppercase text-base-content/55">Valor</p>
              <p className="font-bold">
                {String(paymentRequest.amount_label || "-")}
              </p>
            </div>
            <div className="rounded-2xl bg-base-200 p-4 sm:col-span-2">
              <p className="text-xs uppercase text-base-content/55">
                Descrição
              </p>
              <p className="font-bold">
                {String(paymentRequest.description || "-")}
              </p>
            </div>
          </div>
          {!canPay ? (
            <div className="alert alert-info mt-6">
              <span>
                Esta cobrança está com status:{" "}
                {String(paymentRequest.status_label || status)}.
              </span>
            </div>
          ) : (
            <StripePaymentForm
              amountLabel={String(paymentRequest.amount_label || "")}
              token={token}
            />
          )}
        </article>
        <aside className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
            QR Code
          </p>
          <div className="mt-4 rounded-2xl border border-base-300 bg-white p-4">
            {paymentRequest.qrcode_data_uri ? (
              <div
                aria-label="QR Code do pagamento"
                className="mx-auto aspect-square w-full max-w-[260px] bg-contain bg-center bg-no-repeat"
                role="img"
                style={{
                  backgroundImage: `url(${String(paymentRequest.qrcode_data_uri)})`,
                }}
              />
            ) : null}
          </div>
          <p className="mt-4 break-all text-sm text-base-content/70">
            {String(paymentRequest.payment_url || "")}
          </p>
        </aside>
      </section>
    </main>
  );
}
