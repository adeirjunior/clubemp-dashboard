import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import {
  asRecord,
  asRecordArray,
  type DashboardData,
} from "@/lib/dashboard-data";

type Row = Record<string, unknown>;

export function CustomerHome({ data }: { data: DashboardData }) {
  const profile = asRecord(data.profile);
  const summary = asRecord(data.summary);

  return (
    <div className="mx-auto max-w-7xl py-4 space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name="user-round" className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">Olá, {String(profile.name || "Cliente")}</h1>
                <span className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-wider">
                  {String(profile.membership_label || "Cliente associado")}
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                Bem-vindo à sua área exclusiva Clubemp. Gerencie seus cartões, compras e benefícios.
              </p>
            </div>
          </div>
          <Link className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20" href="/meu-cartao">
            <LucideIcon className="h-4 w-4" name="qr-code" />
            Meu Cartão
          </Link>
        </div>
      </article>

      <SummaryCards
        cards={[
          ["Minhas Compras", String(summary.sales_count || 0), "Total de pedidos"],
          ["Investimento", String(summary.total_spent || "R$ 0,00"), "Valor total gasto"],
          ["Pagas", String(summary.paid_count || 0), "Assinaturas ativas"],
          ["Pendentes", String(summary.pending_count || 0), "Aguardando pagamento"],
        ]}
      />
    </div>
  );
}

export function CustomerPayments({ data }: { data: DashboardData }) {
  const paymentRequests = asRecordArray(data.paymentRequests);

  return (
    <div className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name="credit-card" className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">Cobranças</h1>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                Acesse o link ou leia o QR Code recebido da empresa para concluir o pagamento com segurança.
              </p>
            </div>
          </div>
          <Link className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20" href="/pagamentos/ler-qrcode">
            <LucideIcon className="h-4 w-4" name="scan-qr-code" />
            Ler QR Code
          </Link>
        </div>
      </article>

      <section>
        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="bg-base-200/50 px-6 py-4 border-b border-base-300">
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">Histórico de Cobranças</h2>
          </div>
          <DataTable
            columns={["#", "Empresa", "Descrição", "Valor", "Status", "Ação"]}
            emptyMessage="Nenhuma cobrança vinculada ao seu usuário."
            rows={paymentRequests.map((item) => [
              <span key="id" className="font-bold">#{String(item.id || "0")}</span>,
              String(item.company_name || item.companyName || "-"),
              String(item.description || "-"),
              <span key="amount" className="font-bold">{String(item.amount_label || item.amountLabel || "-")}</span>,
              <span key="status" className="badge badge-outline badge-sm font-bold opacity-80">{String(item.status_label || item.statusLabel || "-")}</span>,
              item.payment_url ? (
                <Link
                  key="payment-link"
                  className="btn btn-xs btn-primary rounded-lg shadow-sm"
                  href={String(item.payment_url)}
                >
                  Pagar agora
                </Link>
              ) : (
                <span key="no-link" className="text-xs opacity-40 italic">Sem link</span>
              ),
            ])}
          />
        </article>
      </section>
    </div>
  );
}

export function AccountSettings({
  data,
  successRedirectTo = "",
}: {
  data: DashboardData;
  successRedirectTo?: string;
}) {
  const profile = asRecord(data.profile);
  const themeOptions = asRecord(data.themeOptions);

  return (
    <div className="mx-auto max-w-5xl py-4 space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="settings" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Configurações</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Gerencie seus dados pessoais, preferências de interface e segurança da conta.
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <BackendForm
          backendPath="/portal/configuracoes"
          className="space-y-8"
          successRedirectTo={successRedirectTo}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              {profile.profile_image_url ? (
                <div
                  aria-label="Imagem de perfil"
                  className="h-32 w-32 rounded-3xl border-4 border-base-200 bg-cover bg-center shadow-xl ring-2 ring-primary/20"
                  role="img"
                  style={{
                    backgroundImage: `url(${String(profile.profile_image_url)})`,
                  }}
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-dashed border-base-300 bg-base-200/50 text-base-content/40">
                  <LucideIcon name="camera" className="h-10 w-10 opacity-30" />
                </div>
              )}
              <label className="btn btn-ghost btn-xs rounded-lg underline text-primary">
                Trocar foto
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  name="profile_image"
                  type="file"
                />
              </label>
            </div>

            <div className="grid gap-6 md:grid-cols-2 flex-1 w-full">
              <TextInput
                defaultValue={String(profile.name || "")}
                label="Nome completo"
                name="name"
                required
              />
              <label className="form-control w-full opacity-70">
                <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider">E-mail de acesso</span>
                <input
                  className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                  readOnly
                  type="email"
                  value={String(profile.email || "")}
                />
              </label>
              
              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider">Interface / Tema</span>
                <select
                  className="select select-bordered w-full font-bold"
                  defaultValue={String(profile.preferred_theme || "clubemp-luxe")}
                  name="preferred_theme"
                >
                  {Object.entries(themeOptions).map(([key, label]) => (
                    <option key={key} value={key}>
                      {String(label)}
                    </option>
                  ))}
                </select>
              </label>

              <TextInput 
                label="Alterar senha" 
                name="password" 
                type="password" 
                placeholder="Deixe em branco para manter"
              />

              <div className="md:col-span-2 pt-4">
                <button className="btn btn-primary btn-lg w-full md:w-auto px-12 rounded-2xl shadow-lg shadow-primary/20" type="submit">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </BackendForm>
      </article>
    </div>
  );
}

export function CompanyHome({ data }: { data: DashboardData }) {
  const tenant = asRecord(data.tenant);
  const notifications = asRecordArray(data.notifications);
  const finance = asRecord(data.vendorFinanceSummary);
  const sales = asRecord(data.companySalesSummary);

  return (
    <div className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="building-2" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">{String(tenant.name || "Minha Empresa")}</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Portal de gestão empresarial. Acompanhe vendas, notícias e relacionamento com associados.
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["/perfil", "Perfil", "Empresa", "Dados institucionais", "settings"],
          ["/compras", "Compras", String(sales.sales_count || 0), "Histórico e estatísticas", "shopping-cart"],
          ["/noticias", "Notícias", String(data.newsCount || 0), "Publicações oficiais", "newspaper"],
          ["/pagamentos", "Cobranças", "Ativas", "Gestão de recebíveis", "credit-card"],
        ].map(([href, label, value, help, icon]) => (
          <Link
            key={href}
            className="group card border border-base-300 bg-base-100 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden"
            href={href}
          >
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40">{label}</p>
                <LucideIcon name={icon as string} className="h-4 w-4 text-base-content/20 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xl font-black mt-2 group-hover:text-primary transition-colors">{value}</p>
              <p className="text-xs text-base-content/60 font-medium">{help}</p>
            </div>
          </Link>
        ))}
      </section>

      {Object.keys(finance).length > 0 ? (
        <SummaryCards
          cards={[
            ["Vendas totais", String(finance.sales_total || "-"), `${String(finance.sales_count || 0)} vendas`],
            ["Repasses devidos", String(finance.pending_commissions_total || "-"), `${String(finance.pending_commissions_count || 0)} pendentes`],
            ["Saldo líquido", String(finance.net_total || "-"), "Vendas menos repasses"],
          ]}
        />
      ) : null}
      
      <Notifications notifications={notifications} />
    </div>
  );
}

export function CompanyGenericList({
  columns,
  data,
  description,
  headerIcon,
  headerTitle,
  rows,
}: {
  activeMenu: string;
  columns: string[];
  data: DashboardData;
  description: string;
  headerIcon: string;
  headerTitle: string;
  rows: Row[];
}) {
  return (
    <div className="space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name={headerIcon} className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">{headerTitle}</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">{description}</p>
          </div>
        </div>
      </article>

      <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <DataTable
          columns={columns}
          emptyMessage="Nenhum registro encontrado."
          rows={rows.map((row) =>
            columns.map((column) => cellForColumn(column, row, data)),
          )}
        />
      </article>
    </div>
  );
}

export function AddCompany({ data }: { data: DashboardData }) {
  const prefill = asRecord(data.prefill);
  const invites = asRecordArray(data.invites);

  return (
    <div className="mx-auto w-full max-w-6xl py-4 space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="plus-circle" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Adicionar Empresa</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Solicite um novo vínculo empresarial ou conclua convites pendentes de acesso.
            </p>
          </div>
        </div>
      </article>

      <section className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
        <div className="space-y-6">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70 mb-4">Convites Pendentes</h2>
            {invites.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <LucideIcon name="mail-search" className="h-8 w-8 opacity-20" />
                <p className="text-xs text-base-content/50 font-medium">Nenhum convite encontrado para seu e-mail.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invites.map((invite) => (
                  <div
                    key={String(invite.id || JSON.stringify(invite))}
                    className="rounded-2xl border border-warning/30 bg-warning/5 p-4 group hover:bg-warning/10 transition-colors"
                  >
                    <p className="font-bold text-sm text-base-content">
                      {String(invite.invite_type_label || "Convite recebido")}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-warning-content/60">
                      Expira em {String(invite.expires_at || "-")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6 shadow-sm">
            <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 mb-2">Por que vincular?</h3>
            <p className="text-xs text-blue-900/70 leading-relaxed font-medium">
              Ao vincular sua empresa, você terá acesso ao catálogo de produtos, gestão de associados e ferramentas de venda exclusivas.
            </p>
          </article>
        </div>

        <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-black text-base-content flex items-center gap-2">
            <LucideIcon name="pencil" className="h-5 w-5 text-primary" />
            Dados da Solicitação
          </h2>
          <BackendForm
            backendPath="/portal/empresas/adicionar"
            className="grid gap-8"
          >
            <div className="space-y-3">
              <span className="label-text font-black text-[10px] uppercase tracking-widest opacity-50 ml-1">Tipo de vínculo desejado</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["conveniada", "Conveniada"],
                  ["empreendedora", "Empreendedora"],
                  ["ambas", "As duas"],
                ].map(([value, label]) => (
                  <label key={value} className="cursor-pointer group">
                    <input
                      className="peer sr-only"
                      defaultChecked={String(data.defaultRequestMode || "conveniada") === value}
                      name="request_mode"
                      type="radio"
                      value={value}
                    />
                    <span className="flex h-full items-center justify-center rounded-2xl border border-base-300 bg-base-200/30 px-4 py-4 text-center text-xs font-black uppercase tracking-wider transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-content peer-checked:shadow-lg group-hover:bg-base-200">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["legal_name", "Razão social"],
                ["trade_name", "Nome fantasia"],
                ["company_document", "Documento (CNPJ)"],
                ["contact_name", "Nome do responsável"],
                ["entrepreneur_name", "Nome do proprietário"],
                ["whatsapp", "WhatsApp comercial"],
                ["website", "Website / Instagram"],
                ["city", "Cidade sede"],
                ["state", "Estado (UF)"],
              ].map(([name, label]) => (
                <TextInput
                  key={name}
                  defaultValue={String(prefill[name] || "")}
                  label={label}
                  name={name}
                  required={name === "trade_name" || name === "contact_name"}
                />
              ))}
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider opacity-60">Proposta ou observações técnicas</span>
              <textarea
                className="textarea textarea-bordered min-h-32 w-full font-medium"
                defaultValue={String(prefill.message || "")}
                name="message"
                required
                placeholder="Conte-nos brevemente sobre o seu negócio..."
              />
            </label>

            <label className="label cursor-pointer justify-start gap-4 rounded-2xl border border-base-300 bg-base-200/30 p-5 group hover:bg-base-200 transition-colors">
              <input
                className="checkbox checkbox-primary"
                defaultChecked
                name="privacy_consent"
                type="checkbox"
                value="1"
              />
              <span className="label-text text-sm font-medium leading-relaxed">
                Li e aceito os <span className="underline text-primary">Termos de Uso</span> e a <span className="underline text-primary">Política de Privacidade</span> da plataforma.
              </span>
            </label>

            <div className="pt-2">
              <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20" type="submit">
                Enviar Solicitação Interna
              </button>
            </div>
          </BackendForm>
        </article>
      </section>
    </div>
  );
}

export function PurchasesPage({ data }: { data: DashboardData }) {
  const summary = asRecord(data.summary);
  const purchases = asRecordArray(data.purchases);
  return (
    <div className="mx-auto w-full max-w-7xl py-4 space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <LucideIcon name="receipt" className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">Histórico de Compras</h1>
            <p className="max-w-2xl text-sm font-medium text-base-content/60">
              Consulte todos os seus pedidos realizados no marketplace Clubemp.
            </p>
          </div>
        </div>
      </article>

      <SummaryCards
        cards={[
          ["Total de Compras", String(summary.purchases_count || 0), ""],
          ["Pagas", String(summary.paid_count || 0), ""],
          ["Pendentes", String(summary.pending_count || 0), ""],
          ["Total investido", String(summary.total_spent || "R$ 0,00"), ""],
        ]}
      />

      <section>
        <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
          <div className="bg-base-200/50 px-6 py-4 border-b border-base-300 flex items-center gap-2">
            <LucideIcon className="h-4 w-4 opacity-50" name="list" />
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70">Listagem de Pedidos</h2>
          </div>
          <DataTable
            columns={["#", "Data", "Loja", "Item", "Qtd", "Status", "Total"]}
            emptyMessage="Nenhuma compra registrada ainda."
            rows={purchases.map((purchase) => [
              <span key="id" className="font-bold">#{String(purchase.id || "0")}</span>,
              String(purchase.created_at || "-"),
              <span key="seller" className="font-semibold text-primary">{String(purchase.seller_name || "-")}</span>,
              String(purchase.item_name || "-"),
              String(purchase.quantity || "0"),
              <span key="status" className="badge badge-outline badge-sm font-bold opacity-80">{String(purchase.status || "-")}</span>,
              <span key="total" className="font-bold">{String(purchase.total_amount || "R$ 0,00")}</span>,
            ])}
          />
        </article>
      </section>
    </div>
  );
}

export function DataTable({
  columns,
  emptyMessage,
  rows,
}: {
  columns: string[];
  emptyMessage: string;
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200/30 text-[10px] font-black uppercase tracking-[0.15em] text-base-content/60">
            {columns.map((column) => (
              <th key={column} className="py-4 px-6 first:pl-8 last:pr-8 last:text-right">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm font-medium">
          {rows.length === 0 ? (
            <tr>
              <td
                className="py-16 text-center text-base-content/40 italic"
                colSpan={columns.length}
              >
                <div className="flex flex-col items-center gap-2">
                  <LucideIcon name="search" className="h-8 w-8 opacity-20" />
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={String(idx)} className="group hover:bg-primary/5 transition-colors">
                {columns.map((column, index) => (
                  <td key={`${column}-${index}`} className="py-4 px-6 first:pl-8 last:pr-8 last:text-right">
                    {row[index] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SummaryCards({ cards }: { cards: Array<[string, string, string]> }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value, help]) => (
        <article
          key={label}
          className="card border border-base-300 bg-base-100 shadow-sm overflow-hidden group hover:border-primary/30 transition-all"
        >
          <div className="card-body p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 group-hover:text-primary transition-colors">{label}</p>
            <p className="text-2xl font-black mt-1 group-hover:scale-105 transition-transform origin-left">{value}</p>
            {help ? (
              <p className="text-xs text-base-content/50 mt-1 font-medium italic">{help}</p>
            ) : null}
          </div>
          <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-500"></div>
        </article>
      ))}
    </section>
  );
}

function Notifications({ notifications }: { notifications: Row[] }) {
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
              Notificações Internas
            </h2>
          </div>
          <span className="badge badge-primary font-black text-[10px]">{notifications.length}</span>
        </div>
        <div className="divide-y divide-base-300/50">
          {notifications.map((notification) => (
            <div
              key={String(notification.id || notification.created_at || JSON.stringify(notification))}
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

function TextInput({
  defaultValue = "",
  label,
  name,
  placeholder,
  required,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="form-control w-full">
      <span className="label-text mb-1 font-semibold">{label}</span>
      <input
        className="input input-bordered w-full"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function cellForColumn(column: string, row: Row, data: DashboardData) {
  const map: Record<string, unknown> = {
    "#": row.id,
    Ações: row.payment_url || row.public_href || row.dashboard_href,
    Cliente: row.customer_name || row.full_name || row.name,
    Código: row.card_code || row.invite_code || row.code,
    Comissão: row.commission_amount,
    Data: row.created_at,
    Descrição: row.description || row.summary,
    "E-mail": row.email || row.invited_email,
    Empresa: row.company_name || row.name,
    Escopo: row.scope_label || row.access_scope,
    Item: row.item_name || row.name || row.title,
    Link: row.payment_url,
    Loja: row.seller_name || row.seller_tenant_name,
    Nome: row.name || row.full_name || row.title,
    Pagamento: row.payment_status || row.payment_status_label,
    Perfil: row.relationship_role || row.customer_type_label,
    Permissões: row.permissions_label,
    Preço: row.price,
    Qtd: row.quantity,
    Status: row.status_label || row.status,
    Tipo: row.type_label || row.invite_type_label || row.company_type_label,
    Total: row.total_amount,
    Valor: row.amount_label || row.amount,
  };
  const value = map[column] ?? row[column] ?? data[column];
  if (column === "Ações" && typeof value === "string" && value) {
    return (
      <a className="btn btn-xs btn-outline" href={value}>
        Abrir
      </a>
    );
  }
  if (column === "Link" && typeof value === "string" && value) {
    return (
      <a className="link link-primary break-all text-sm" href={value}>
        {value}
      </a>
    );
  }
  return String(value || "-");
}
