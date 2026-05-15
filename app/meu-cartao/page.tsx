import Image from "next/image";
import Link from "next/link";
import { ClubempCardCanvas } from "@/components/dashboard/clubemp-card-canvas";
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
  const holderName = String(card.holder_name || "Membro Clubemp");
  const holderType = String(card.card_type_label || card.card_type || card.holder_label || "Cliente associado");
  const cardCode = String(card.card_code || "CLI-000000");
  const cardSite = String(
    card.public_url || qrTargetUrl || "www.clubemp.valeriawaz.com.br",
  );
  const validationQrUrl = qrCardImageUrl || qrImageUrl;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 py-4">
      {/* Header Premium com Badge de Status */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 bg-[#06101f] p-8 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#f4c55a]/10 blur-[130px]" />

        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-1 items-center gap-6">
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-primary/30 bg-primary/10 text-[#f4c55a] shadow-inner backdrop-blur-sm">
              <LucideIcon name="id-card" className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Meu Cartão Digital
                </h1>
                <span className="badge badge-success badge-sm h-6 gap-1.5 px-3 font-black uppercase text-[10px] tracking-wider text-success-content shadow-lg shadow-success/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-content animate-pulse"></span>
                  Ativo
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-400">
                Sua credencial oficial no ecossistema Clubemp. Utilize para validar benefícios, parcerias e conexões estratégicas.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {qrTargetUrl && (
              <Link className="btn btn-primary rounded-2xl gap-2 font-black uppercase tracking-wider text-xs px-6 shadow-xl shadow-primary/25" href={qrTargetUrl}>
                <LucideIcon className="h-4 w-4" name="external-link" />
                Validação Web
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Card Preview Area - Removido fundo branco e largura forçada */}
        <article className="group relative flex items-center justify-center overflow-hidden rounded-[2.5rem] border border-base-300 bg-base-100/50 p-8 shadow-sm transition-all hover:border-primary/30 sm:p-12 lg:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,197,90,0.08),transparent_60%)]" />

          <div className="relative w-92 sm:w-[680px] transition-transform duration-500 group-hover:scale-[1.02]">
            <ClubempCardCanvas
              code={cardCode}
              name={holderName}
              qrCodeUrl={validationQrUrl}
              site={cardSite}
              type={holderType}
            />
          </div>
        </article>

        <aside className="space-y-6">
          {/* Dados do Titular */}
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h3 className="mb-5 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/40">Dados da Credencial</h3>
            <div className="space-y-3">
              <InfoRow label="Nome do Titular" value={holderName} />
              <InfoRow label="Nível de Acesso" value={holderType} />
              <InfoRow label="Código Único" value={cardCode} monospace />
            </div>
          </article>

          {/* QR Code Section - Redimensionado e Sem Wrapper Branco Forçado */}
          {validationQrUrl ? (
            <article className="relative overflow-hidden rounded-3xl border flex flex-col justify-center items-center gap-4 border-base-300 bg-base-100 p-8 text-center shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-[#f4c55a]/30 to-transparent" />
              <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-base-content/50">
                Ponto de Validação
              </h3>

              <div className="w-fit relative group/qr cursor-help flex justify-center">
                <div className="absolute -inset-4 bg-[#f4c55a]/10 rounded-full blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity" />
                <div className="relative size-32 flex items-center justify-center overflow-hidden rounded-2xl border border-base-300 bg-base-200/50 p-2">
                  <Image
                    alt="QR Code para validação presencial Clubemp"
                    className="size-full mix-blend-multiply object-contain"
                    height={128 * 2}
                    unoptimized
                    src={validationQrUrl}
                    width={128 * 2}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-1">
                <p className="text-xs font-black uppercase text-base-content tracking-tight">QR Code de Validação</p>
                <p className="text-[11px] font-medium leading-relaxed text-base-content/50 px-4">
                  Apresente este código em empresas parceiras para liberar vantagens exclusivas.
                </p>
              </div>
            </article>
          ) : null}

          {/* Link Público */}
          {String(card.public_url || "") !== "" && (
            <article className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center group hover:bg-primary/10 transition-colors">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <LucideIcon name="globe" className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Sua Vitrine Online</p>
                  <p className="text-[11px] font-medium text-base-content/60 mt-1 mb-4">Compartilhe seu perfil com clientes e parceiros.</p>
                </div>
                <Link
                  className="btn btn-primary btn-sm w-full rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                  href={String(card.public_url)}
                >
                  Acessar Perfil Público
                </Link>
              </div>
            </article>
          )}
        </aside>
      </section>

      <Notifications notifications={notifications} />
    </main>
  );
}

function InfoRow({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-200/35 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40">
        {label}
      </p>
      <p
        className={`mt-1 font-bold text-base-content ${monospace ? "font-mono tracking-wider" : ""
          }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function Notifications({ notifications }: { notifications: any[] }) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <section className="mt-8">
      <article className="rounded-3xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="bg-primary/5 px-6 py-4 border-b border-base-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LucideIcon className="h-4 w-4" name="bell" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">
              Notificações do Cartão
            </h2>
          </div>
          <span className="badge badge-primary font-black text-[10px]">{notifications.length}</span>
        </div>
        <div className="divide-y divide-base-300/50">
          {notifications.map((notification, idx) => (
            <div
              key={String(notification.id || idx)}
              className="p-6 group hover:bg-base-200/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="font-bold text-base-content group-hover:text-primary transition-colors">
                  {String(notification.title || "-")}
                </p>
                <span className="text-[10px] font-black uppercase tracking-wider text-base-content/30 bg-base-200 px-2 py-1 rounded-lg">
                  {String(notification.created_at || "-")}
                </span>
              </div>
              <p className="mt-2 text-sm text-base-content/70 leading-relaxed font-medium">
                {String(notification.message || "-")}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
