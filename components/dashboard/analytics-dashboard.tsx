import { asRecord, asRecordArray } from "@/lib/dashboard-data";

const eventLabels: Record<string, string> = {
  company_page_viewed: "Visualizações da página",
  company_card_clicked: "Cliques no card",
  company_whatsapp_clicked: "Cliques no WhatsApp",
  company_phone_clicked: "Cliques no telefone",
  company_site_clicked: "Cliques no site",
  company_offer_clicked: "Cliques em ofertas",
  product_viewed: "Produtos visualizados",
  coupon_copied: "Cupons copiados",
  favorite_added: "Favoritos adicionados",
  order_completed: "Compras concluídas",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

function numberValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatNumber(value: unknown) {
  return numberFormatter.format(numberValue(value));
}

function formatPercent(value: unknown) {
  return `${numberValue(value).toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}%`;
}

export function AnalyticsDashboard({
  data,
  days,
  isAdmin,
  periodFormHiddenFields,
  showHeader = true,
}: {
  data: Record<string, unknown>;
  days: string;
  isAdmin: boolean;
  periodFormHiddenFields?: Record<string, string>;
  showHeader?: boolean;
}) {
  const summary = asRecord(data.summary);
  const eventsByType = asRecord(summary.eventsByType || summary.events_by_type);
  const daily = asRecordArray(data.daily);
  const topCompanies = asRecordArray(data.topCompanies || data.top_companies);
  const cards: Array<{ help: string; label: string; value: unknown }> = [
    {
      help: "Interações registradas no período",
      label: "Eventos totais",
      value: summary.totalEvents || summary.total_events,
    },
    {
      help: "Acessos a páginas públicas",
      label: "Visualizações",
      value: summary.companyPageViews || summary.company_page_views,
    },
    {
      help: "Visitantes únicos em páginas",
      label: "Visitantes únicos",
      value:
        summary.companyPageUniqueVisitors ||
        summary.company_page_unique_visitors,
    },
    {
      help: "Ações diretas de contato",
      label: "Cliques WhatsApp",
      value: summary.whatsappClicks || summary.whatsapp_clicks,
    },
    {
      help: "Cliques / visualizações",
      label: "Conversão WhatsApp",
      value: summary.whatsappConversionRate || summary.whatsapp_conversion_rate,
    },
    {
      help: "Volume capturado no dia atual",
      label: "Eventos hoje",
      value: summary.todayEvents || summary.today_events,
    },
  ];

  return (
    <>
      {showHeader && (
        <section className="mt-4 rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                {isAdmin ? "Analytics global" : "Analytics da empresa"}
              </p>
              <h1 className="mt-2 text-2xl font-black">
                Desempenho e conversão
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-base-content/70">
                Acompanhe visualizações, cliques, engajamento e conversão das
                empresas cadastradas no ecossistema ClubEmp.
              </p>
            </div>
            <PeriodForm days={days} hiddenFields={periodFormHiddenFields} />
          </div>
        </section>
      )}

      {!showHeader && (
        <div className="flex justify-end">
          <PeriodForm days={days} hiddenFields={periodFormHiddenFields} />
        </div>
      )}

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            className="card border border-base-300 bg-base-100 shadow-sm"
            key={card.label}
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">
                {card.label}
              </p>
              <p className="text-3xl font-black">
                {card.label.includes("Conversão")
                  ? formatPercent(card.value)
                  : formatNumber(card.value)}
              </p>
              <p className="text-sm text-base-content/70">{card.help}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-black">Eventos por tipo</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(eventLabels).map(([eventType, label]) => (
              <div
                className="rounded-2xl border border-base-200 bg-base-200/35 p-4"
                key={eventType}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/55">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-black">
                  {formatNumber(eventsByType[eventType])}
                </p>
              </div>
            ))}
          </div>
        </article>

        {isAdmin ? (
          <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="text-lg font-black">Empresas mais acessadas</h2>
            <div className="mt-4 space-y-3">
              {topCompanies.length === 0 ? (
                <p className="text-sm text-base-content/60">
                  Sem eventos suficientes para ranking.
                </p>
              ) : (
                topCompanies.map((company, index) => (
                  <div
                    className="rounded-2xl border border-base-200 p-4"
                    key={`${company.tenantId || company.tenant_id}-${index}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">
                          {String(
                            company.companyName ||
                              company.company_name ||
                              "Empresa",
                          )}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {formatNumber(
                            company.totalEvents || company.total_events,
                          )}{" "}
                          eventos totais
                        </p>
                      </div>
                      <span className="badge badge-primary badge-outline">
                        {formatNumber(company.pageViews || company.page_views)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        ) : (
          <article className="rounded-3xl border border-primary/15 bg-primary/5 p-5 shadow-sm">
            <h2 className="text-lg font-black">Leitura prática</h2>
            <p className="mt-3 text-sm leading-relaxed text-base-content/70">
              Use visualizações e visitantes únicos para medir alcance. Compare
              com cliques no WhatsApp para entender a intenção real de contato.
            </p>
          </article>
        )}
      </section>

      <section className="mt-4 rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="text-lg font-black">Histórico diário</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="table table-zebra table-sm">
            <thead>
              <tr>
                <th>Data</th>
                {isAdmin && <th>Empresa</th>}
                <th>Evento</th>
                <th className="text-right">Total</th>
                <th className="text-right">Únicos</th>
              </tr>
            </thead>
            <tbody>
              {daily.length === 0 ? (
                <tr>
                  <td
                    className="text-center text-base-content/60"
                    colSpan={isAdmin ? 5 : 4}
                  >
                    Nenhum evento registrado neste período.
                  </td>
                </tr>
              ) : (
                daily.map((row, index) => {
                  const eventType = String(
                    row.eventType || row.event_type || "",
                  );
                  return (
                    <tr
                      key={`${row.tenantId || row.tenant_id || "tenant"}-${row.eventDate || row.event_date}-${eventType}-${index}`}
                    >
                      <td>{String(row.eventDate || row.event_date || "-")}</td>
                      {isAdmin && (
                        <td>
                          {String(
                            row.companyName || row.company_name || "Empresa",
                          )}
                        </td>
                      )}
                      <td>{eventLabels[eventType] || eventType || "-"}</td>
                      <td className="text-right">
                        {formatNumber(row.totalEvents || row.total_events)}
                      </td>
                      <td className="text-right">
                        {formatNumber(
                          row.uniqueVisitors || row.unique_visitors,
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function PeriodForm({
  days,
  hiddenFields,
}: {
  days: string;
  hiddenFields?: Record<string, string>;
}) {
  return (
    <form className="flex items-end gap-2" method="get">
      {Object.entries(hiddenFields || {}).map(([name, value]) => (
        <input key={name} name={name} type="hidden" value={value} />
      ))}
      <label className="form-control">
        <span className="label-text text-xs font-semibold">Período</span>
        <select
          className="select select-bordered select-sm"
          defaultValue={days}
          name="days"
        >
          <option value="7">7 dias</option>
          <option value="30">30 dias</option>
          <option value="90">90 dias</option>
          <option value="365">365 dias</option>
        </select>
      </label>
      <button className="btn btn-primary btn-sm" type="submit">
        Aplicar
      </button>
    </form>
  );
}
