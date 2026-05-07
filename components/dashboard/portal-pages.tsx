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
    <main className="mx-auto max-w-6xl py-6 sm:py-8">
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Minha Área do Cliente
          </h1>
          <p className="text-sm text-base-content/70">
            <span className="badge badge-ghost badge-sm uppercase">
              {String(profile.membership_label || "Cliente associado")}
            </span>
          </p>
        </div>
        <Link className="btn btn-primary btn-sm" href="/meu-cartao">
          <LucideIcon className="h-4 w-4" name="qr-code" />
          Meu Cartão
        </Link>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {[
          ["Compras", String(summary.sales_count || 0)],
          ["Total gasto", String(summary.total_spent || "0")],
          ["Pagas", String(summary.paid_count || 0)],
          ["Pendentes", String(summary.pending_count || 0)],
        ].map(([label, value]) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50">
                {label}
              </p>
              <p className="text-xl font-black sm:text-2xl">{value}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function CustomerPayments({ data }: { data: DashboardData }) {
  const paymentRequests = asRecordArray(data.paymentRequests);

  return (
    <>
      <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
              Pagamentos Clubemp
            </p>
            <h2 className="text-2xl font-black">Cobranças recebidas</h2>
            <p className="text-sm text-base-content/70">
              Acesse o link ou leia o QR Code recebido da empresa para concluir
              o pagamento.
            </p>
          </div>
          <Link
            className="btn btn-primary"
            href="/minha-area/pagamentos/ler-qrcode"
          >
            <LucideIcon className="h-4 w-4" name="scan-qr-code" />
            Ler QR Code
          </Link>
        </div>
      </section>

      <section className="mt-5">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Histórico</h2>
            <DataTable
              columns={["#", "Empresa", "Descrição", "Valor", "Status", "Ação"]}
              emptyMessage="Nenhuma cobrança vinculada ao seu usuário."
              rows={paymentRequests.map((item) => [
                `#${String(item.id || "0")}`,
                String(item.company_name || item.companyName || "-"),
                String(item.description || "-"),
                String(item.amount_label || item.amountLabel || "-"),
                String(item.status_label || item.statusLabel || "-"),
                item.payment_url ? (
                  <Link
                    key="payment-link"
                    className="btn btn-xs btn-primary"
                    href={String(item.payment_url)}
                  >
                    Pagar
                  </Link>
                ) : (
                  "Sem link"
                ),
              ])}
            />
          </div>
        </article>
      </section>
    </>
  );
}

export function AccountSettings({ data }: { data: DashboardData }) {
  const profile = asRecord(data.profile);
  const themeOptions = asRecord(data.themeOptions);

  return (
    <main className="mx-auto max-w-4xl py-6">
      <section className="mb-5 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <h1 className="text-xl font-bold">Configurações da conta</h1>
        <p className="text-sm text-base-content/70">
          Atualize seus dados pessoais, imagem e tema da interface.
        </p>
      </section>

      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <BackendForm
            backendPath="/portal/configuracoes"
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              {profile.profile_image_url ? (
                <div
                  aria-label="Imagem de perfil"
                  className="h-16 w-16 rounded-full border border-base-300 bg-cover bg-center"
                  role="img"
                  style={{
                    backgroundImage: `url(${String(profile.profile_image_url)})`,
                  }}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-base-300 text-xs text-base-content/60">
                  Sem foto
                </div>
              )}
              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold">
                  Imagem de perfil
                </span>
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="file-input file-input-bordered w-full"
                  name="profile_image"
                  type="file"
                />
              </label>
            </div>
            <TextInput
              defaultValue={String(profile.name || "")}
              label="Nome"
              name="name"
              required
            />
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">E-mail</span>
              <input
                className="input input-bordered w-full"
                readOnly
                type="email"
                value={String(profile.email || "")}
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text mb-1 font-semibold">
                Tema do site
              </span>
              <select
                className="select select-bordered w-full"
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
            <TextInput label="Nova senha" name="password" type="password" />
            <button className="btn btn-primary w-full" type="submit">
              Salvar configurações
            </button>
          </BackendForm>
        </div>
      </section>
    </main>
  );
}

export function CompanyHome({ data }: { data: DashboardData }) {
  const tenant = asRecord(data.tenant);
  const notifications = asRecordArray(data.notifications);
  const finance = asRecord(data.vendorFinanceSummary);
  const sales = asRecord(data.companySalesSummary);

  return (
    <>
      <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-base-content/60">
          Portal da empresa
        </p>
        <h2 className="text-2xl font-black">
          {String(tenant.name || "Empresa")}
        </h2>
        <p className="text-sm text-base-content/70">
          Gestão por módulos para perfil, associados, notícias e catálogo.
        </p>
      </section>
      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["/meu-espaco/perfil", "Perfil", "Empresa", "Dados institucionais"],
          [
            "/meu-espaco/compras",
            "Compras",
            String(sales.sales_count || 0),
            "Histórico e estatísticas",
          ],
          [
            "/meu-espaco/noticias",
            "Notícias",
            String(data.newsCount || 0),
            "Publicações",
          ],
          ["/meu-espaco/cobrancas", "Cobranças", "Stripe", "Recebimentos"],
        ].map(([href, label, value, help]) => (
          <Link
            key={href}
            className="card border border-base-300 bg-base-100 shadow-sm hover:border-primary"
            href={href}
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">{label}</p>
              <p className="text-lg font-bold">{value}</p>
              <p className="text-sm text-base-content/70">{help}</p>
            </div>
          </Link>
        ))}
      </section>
      {Object.keys(finance).length > 0 ? (
        <SummaryCards
          cards={[
            [
              "Vendas totais",
              String(finance.sales_total || "-"),
              `${String(finance.sales_count || 0)} vendas`,
            ],
            [
              "Repasses devidos",
              String(finance.pending_commissions_total || "-"),
              `${String(finance.pending_commissions_count || 0)} pendentes`,
            ],
            [
              "Saldo líquido",
              String(finance.net_total || "-"),
              "Vendas menos repasses",
            ],
          ]}
        />
      ) : null}
      <Notifications notifications={notifications} />
    </>
  );
}

export function CompanyGenericList({
  columns,
  data,
  description,
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
    <>
      <section className="mt-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="text-xl font-black">{headerTitle}</h2>
        <p className="text-sm text-base-content/70">{description}</p>
      </section>
      <section className="mt-4">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <DataTable
              columns={columns}
              emptyMessage="Nenhum registro encontrado."
              rows={rows.map((row) =>
                columns.map((column) => cellForColumn(column, row, data)),
              )}
            />
          </div>
        </article>
      </section>
    </>
  );
}

export function AddCompany({ data }: { data: DashboardData }) {
  const prefill = asRecord(data.prefill);
  const invites = asRecordArray(data.invites);

  return (
    <main className="mx-auto w-full max-w-5xl py-6">
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-base-content">
              Status atual da conta
            </h2>
            <p className="mt-3 text-sm text-base-content/70">
              Solicite uma empresa vinculada à sua conta ou conclua convites
              pendentes.
            </p>
          </article>
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-base-content">
              Convites pendentes
            </h2>
            {invites.length === 0 ? (
              <p className="mt-4 text-sm text-base-content/65">
                Nenhum convite pendente foi encontrado para este e-mail.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {invites.map((invite) => (
                  <div
                    key={String(invite.id || JSON.stringify(invite))}
                    className="rounded-2xl border border-warning/30 bg-warning/10 p-4"
                  >
                    <p className="font-semibold text-base-content">
                      {String(invite.invite_type_label || "-")}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-base-content/50">
                      Expira em {String(invite.expires_at || "-")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
        <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
          <h2 className="mb-5 text-xl font-black text-base-content">
            Solicitação interna
          </h2>
          <BackendForm
            backendPath="/portal/empresas/adicionar"
            className="grid gap-5"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["conveniada", "Conveniada"],
                ["empreendedora", "Empreendedora"],
                ["ambas", "As duas"],
              ].map(([value, label]) => (
                <label key={value} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    defaultChecked={
                      String(data.defaultRequestMode || "conveniada") === value
                    }
                    name="request_mode"
                    type="radio"
                    value={value}
                  />
                  <span className="flex h-full items-center justify-center rounded-2xl border border-base-300 px-4 py-4 text-center text-sm font-black uppercase tracking-[0.18em] transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-content">
                    {label}
                  </span>
                </label>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["legal_name", "Razão social"],
                ["trade_name", "Nome fantasia"],
                ["company_document", "Documento"],
                ["contact_name", "Contato responsável"],
                ["entrepreneur_name", "Nome do empreendedor"],
                ["whatsapp", "WhatsApp"],
                ["website", "Website"],
                ["city", "Cidade"],
                ["state", "Estado"],
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
              <span className="label-text mb-1 font-semibold">
                Proposta ou observações
              </span>
              <textarea
                className="textarea textarea-bordered min-h-28 w-full"
                defaultValue={String(prefill.message || "")}
                name="message"
                required
              />
            </label>
            <label className="label cursor-pointer justify-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <input
                className="checkbox checkbox-primary"
                defaultChecked
                name="privacy_consent"
                type="checkbox"
                value="1"
              />
              <span className="label-text text-sm leading-relaxed">
                Li e concordo com a política de privacidade.
              </span>
            </label>
            <button className="btn btn-primary w-full" type="submit">
              Enviar solicitação interna
            </button>
          </BackendForm>
        </article>
      </section>
    </main>
  );
}

export function PurchasesPage({ data }: { data: DashboardData }) {
  const summary = asRecord(data.summary);
  const purchases = asRecordArray(data.purchases);
  return (
    <main className="mx-auto w-full max-w-5xl py-8">
      <SummaryCards
        cards={[
          ["Compras", String(summary.purchases_count || 0), ""],
          ["Pagas", String(summary.paid_count || 0), ""],
          ["Pendentes", String(summary.pending_count || 0), ""],
          ["Total gasto", String(summary.total_spent || "R$ 0,00"), ""],
        ]}
      />
      <section className="mt-6">
        <article className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-base">
              <LucideIcon className="h-4 w-4" name="receipt" />
              Histórico de compras
            </h2>
            <DataTable
              columns={["#", "Data", "Loja", "Item", "Qtd", "Status", "Total"]}
              emptyMessage="Nenhuma compra registrada."
              rows={purchases.map((purchase) => [
                `#${String(purchase.id || "0")}`,
                String(purchase.created_at || "-"),
                String(purchase.seller_name || "-"),
                String(purchase.item_name || "-"),
                String(purchase.quantity || "0"),
                String(purchase.status || "-"),
                String(purchase.total_amount || "R$ 0,00"),
              ])}
            />
          </div>
        </article>
      </section>
    </main>
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
    <div className="overflow-x-auto rounded-xl border border-base-300">
      <table className="table table-zebra">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                className="text-center text-sm text-base-content/65"
                colSpan={columns.length}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.map(String).join("|")}>
                {columns.map((column, index) => (
                  <td key={column}>{row[index] || "-"}</td>
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
    <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, help]) => (
        <article
          key={label}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body p-4">
            <p className="text-xs uppercase text-base-content/55">{label}</p>
            <p className="text-2xl font-black">{value}</p>
            {help ? (
              <p className="text-xs text-base-content/65">{help}</p>
            ) : null}
          </div>
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

function TextInput({
  defaultValue = "",
  label,
  name,
  required,
  type = "text",
}: {
  defaultValue?: string;
  label: string;
  name: string;
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
