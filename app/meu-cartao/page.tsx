import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "@/components/lucide-icon";
import {
  asRecord,
  asRecordArray,
  type DashboardData,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-cartao",
    await searchParams,
    "/meu-cartao",
  );

  const card = asRecord(data.card);
  const notifications = asRecordArray(data.notifications);
  const qrImageUrl = String(data.qrImageUrl || data.qr_image_url || "");
  const qrTargetUrl = String(data.qrTargetUrl || data.qr_target_url || "");
  const qrCardImageUrl = String(
    data.qrCardImageUrl || data.qr_card_image_url || "",
  );

  return (
    <main className="mx-auto w-full max-w-6xl py-8">
      <section className="mb-6 flex flex-col gap-3 rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Cartão Clubemp
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">
            Meu cartão
          </h1>
          <p className="text-sm text-base-content/70">
            Use este cartão para identificação e validação no ecossistema.
          </p>
        </div>
        {qrTargetUrl ? (
          <Link className="btn btn-outline btn-sm gap-2" href={qrTargetUrl}>
            <LucideIcon className="h-4 w-4" name="external-link" />
            Abrir validação
          </Link>
        ) : null}
      </section>

      <article className="overflow-hidden rounded-[2rem] border border-primary/20 bg-base-100 shadow-xl">
        <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:p-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-[#141008] p-6 text-white shadow-2xl">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                Cartão Clubemp
              </p>
              <h2 className="mt-4 text-3xl font-black">
                {String(card.holder_name || "")}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {String(card.card_type_label || card.card_type || "")}
              </p>
              <p className="mt-10 font-mono text-sm tracking-[0.25em]">
                {String(card.card_code || "")}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-base-300 bg-base-200/40 p-5">
              <p className="text-sm text-base-content/70">
                {String(card.holder_label || "Conta")}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {String(card.holder_name || "")}
              </h2>
              <p className="mt-4 break-all font-mono text-sm">
                {String(card.card_code || "")}
              </p>
              {card.public_url ? (
                <Link
                  className="link link-primary mt-4 inline-block text-sm font-semibold"
                  href={String(card.public_url)}
                >
                  Ver página pública vinculada
                </Link>
              ) : null}
            </div>

            {qrImageUrl || qrCardImageUrl ? (
              <div className="rounded-3xl border border-base-300 bg-base-100 p-5 text-center shadow-sm">
                <div className="mx-auto grid max-w-56 place-items-center rounded-2xl bg-white p-4">
                  <Image
                    alt="QR Code do cartão Clubemp"
                    className="h-auto w-full"
                    height={220}
                    unoptimized
                    src={qrCardImageUrl || qrImageUrl}
                    width={220}
                  />
                </div>
                <p className="mt-3 text-xs text-base-content/60">
                  QR Code de validação do cartão
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </article>

      <Notifications notifications={notifications} />
    </main>
  );
}

function Notifications({ notifications }: { notifications: DashboardData[] }) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <section className="mt-6">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base">
            <LucideIcon className="h-4 w-4" name="bell" />
            Notificações internas
          </h2>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={String(
                  notification.id ||
                    notification.created_at ||
                    JSON.stringify(notification),
                )}
                className="rounded-xl border border-base-300 bg-base-200/40 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {String(notification.title || "-")}
                  </p>
                  <span className="text-xs text-base-content/65">
                    {String(notification.created_at || "-")}
                  </span>
                </div>
                <p className="text-sm text-base-content/80">
                  {String(notification.message || "-")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
