import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { EditorJsField } from "@/components/editor-js-field";
import { ImagePicker } from "@/components/image-picker";
import { LucideIcon } from "@/components/lucide-icon";
import {
  type ModuleFormField,
  ModuleFormPage,
  ModuleShowPage,
} from "./crud-pages";

type Row = Record<string, unknown>;
type EditorialModule = "eventos" | "cursos" | "sorteios";

const moduleConfig = {
  eventos: {
    columns: ["Nome", "Origem", "Formato", "Local", "Status", "Início"],
    createHref: "/eventos/novo",
    description:
      "Planeje eventos presenciais, transmissão, patrocínio e publicação institucional.",
    emptyMessage: "Nenhum evento encontrado.",
    headerIcon: "calendar-days",
    headerTitle: "Eventos",
    title: "Agenda de eventos",
  },
  cursos: {
    columns: ["Curso", "Slug", "Tipo", "Status", "Atualizado"],
    createHref: "/cursos/novo",
    description:
      "Centralize trilhas, aulas e forma de publicação dos cursos da plataforma.",
    emptyMessage: "Nenhum curso encontrado.",
    headerIcon: "graduation-cap",
    headerTitle: "Cursos",
    title: "Catálogo de cursos",
  },
  sorteios: {
    columns: ["Campanha", "Prêmio", "Status", "Cupons", "Encerramento"],
    createHref: "/sorteios/novo",
    description:
      "Acompanhe sorteios, cupons emitidos e campanhas promocionais da plataforma.",
    emptyMessage: "Nenhum sorteio encontrado.",
    headerIcon: "ticket",
    headerTitle: "Sorteios",
    title: "Campanhas e sorteios",
  },
} as const;

function moduleCells(module: EditorialModule, row: Row) {
  if (module === "eventos") {
    return [
      String(row.title || "-"),
      String(row.sourceLabel || row.source_label || "-"),
      String(row.event_mode_label || "-"),
      String(
        (row.event_mode || "") === "online"
          ? row.online_url || "Online"
          : row.location_name || "-",
      ),
      String(row.published_label || "-"),
      String(row.starts_at || "-"),
    ];
  }

  if (module === "cursos") {
    return [
      String(row.title || "-"),
      String(row.slug || "-"),
      String(row.price || "-"),
      String(row.published_label || "-"),
      String(row.created_at || "-"),
    ];
  }

  return [
    String(row.title || "-"),
    String(row.prize_description || "-"),
    String(row.status_label || "-"),
    String(row.coupons_count || "0"),
    String(row.ends_at || "-"),
  ];
}

export function EditorialModuleList({
  module,
  rows,
  statusFilter = "pending",
  statusOptions = {},
}: {
  module: EditorialModule;
  rows: Row[];
  statusFilter?: string;
  statusOptions?: Record<string, unknown>;
}) {
  const config = moduleConfig[module];

  return (
    <section className="mt-4 space-y-6">
      {/* Header Profissional */}
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name={config.headerIcon} className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">
                  {config.headerTitle}
                </h1>
                <span className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-wider">
                  Módulo Editorial
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                {config.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ContentStatusFilter
              statusFilter={statusFilter}
              statusOptions={statusOptions}
            />
            <Link
              className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20"
              href={config.createHref}
            >
              <LucideIcon name="plus" className="h-4 w-4" />
              Novo
            </Link>
          </div>
        </div>
      </article>

      {/* Tabela de Conteúdo */}
      <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 text-xs font-black uppercase tracking-widest text-base-content/70">
                {config.columns.map((column) => (
                  <th
                    key={column}
                    className="py-5 px-6 first:pl-8 last:pr-8 last:text-right"
                  >
                    {column}
                  </th>
                ))}
                <th className="py-5 px-6 pr-8 text-right text-xs">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {rows.length === 0 ? (
                <tr>
                  <td
                    className="py-16 text-center text-base-content/50 italic"
                    colSpan={config.columns.length + 1}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <LucideIcon
                        name="search"
                        className="h-8 w-8 opacity-20"
                      />
                      {config.emptyMessage}
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={String(row.id || row.title || row.slug || "-")}
                    className="group hover:bg-primary/5 transition-colors"
                  >
                    {moduleCells(module, row).map((cell, index) => (
                      <td
                        key={`${String(row.id || row.title)}-${index}`}
                        className="py-4 px-6 first:pl-8"
                      >
                        {cell}
                      </td>
                    ))}
                    <td className="py-4 px-6 pr-8">
                      <div className="flex justify-end gap-2">
                        <Link
                          className="btn btn-outline btn-xs rounded-lg group-hover:bg-base-100"
                          href={`/${module}/ver?id=${String(row.id || 0)}`}
                        >
                          Ver
                        </Link>
                        {String(row.reviewStatus || row.review_status) ===
                        "pending" ? (
                          <ReviewActions
                            approveValue="approve_now"
                            backendPath={`/dashboard/central/tv/revisao/${module}/${String(row.id || 0)}`}
                          />
                        ) : (
                          <Link
                            className="btn btn-primary btn-xs rounded-lg shadow-sm"
                            href={`/${module}/editar?id=${String(row.id || 0)}`}
                          >
                            Editar
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export function EventFormPage({
  formAction,
  formItem,
  isEdit,
  title,
}: {
  formAction?: string;
  formItem: Row;
  isEdit: boolean;
  title?: string;
}) {
  const backendPath =
    formAction || (isEdit ? "#" : "/dashboard/central/eventos");

  return (
    <section className="mt-4">
      <Link
        className="btn btn-ghost btn-sm -ml-2 mb-4 gap-2 text-base-content/60"
        href="/eventos"
      >
        <LucideIcon name="arrow-left" className="h-4 w-4" />
        Voltar para eventos
      </Link>

      <BackendForm backendPath={backendPath}>
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Coluna Principal */}
          <div className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <h1 className="text-3xl font-black tracking-tight">
                {title || (isEdit ? "Editar evento" : "Novo evento")}
              </h1>
              <p className="mt-2 text-sm text-base-content/60">
                {isEdit
                  ? "Atualize as informações e logística do evento."
                  : "Cadastre um novo evento institucional no ecossistema."}
              </p>

              <div className="mt-8 space-y-6">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Nome do evento
                  </span>
                  <input
                    className="input input-bordered"
                    defaultValue={String(formItem.title || "")}
                    name="title"
                    required
                    placeholder="Ex: Workshop de Estratégia Digital"
                  />
                </label>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Local / Plataforma
                    </span>
                    <input
                      className="input input-bordered"
                      defaultValue={String(formItem.location_name || "")}
                      name="location_name"
                      placeholder="Ex: Hotel Plaza ou Google Meet"
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Capacidade (opcional)
                    </span>
                    <input
                      className="input input-bordered"
                      defaultValue={String(formItem.capacity || "")}
                      name="capacity"
                      type="number"
                    />
                  </label>
                </div>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Endereço ou URL
                  </span>
                  <input
                    className="input input-bordered"
                    defaultValue={String(
                      formItem.location_address || formItem.online_url || "",
                    )}
                    name="location_address"
                    placeholder="Link ou endereço completo"
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Resumo operacional
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-[100px]"
                    defaultValue={String(formItem.summary || "")}
                    name="summary"
                    placeholder="Uma breve descrição técnica..."
                  />
                </label>

                <EditorJsField
                  help="Use títulos, listas, citações, separadores e imagens para organizar programação, palestrantes e detalhes do evento."
                  initialValue={formItem.description || ""}
                  label="Descrição completa"
                  name="description"
                  placeholder="Detalhe programação, palestrantes, local, regras e benefícios para participantes..."
                />
              </div>
            </article>
          </div>

          {/* Coluna Lateral */}
          <aside className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-primary">
                Logística & Publicação
              </h2>

              <div className="space-y-6">
                <ImagePicker
                  defaultValue={String(
                    formItem.image || formItem.cover_image || "",
                  )}
                  help="Imagem promocional do evento"
                  label="Banner do Evento"
                  name="cover_image"
                />

                <div className="grid gap-4">
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold text-xs uppercase opacity-70">
                      Data de Início
                    </span>
                    <input
                      className="input input-bordered"
                      defaultValue={String(formItem.starts_at || "")}
                      name="starts_at"
                      type="datetime-local"
                      required
                    />
                  </label>
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold text-xs uppercase opacity-70">
                      Data de Término
                    </span>
                    <input
                      className="input input-bordered"
                      defaultValue={String(formItem.ends_at || "")}
                      name="ends_at"
                      type="datetime-local"
                    />
                  </label>
                </div>

                <div className="divider opacity-50 my-0"></div>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">Formato</span>
                  <select
                    className="select select-bordered"
                    defaultValue={String(formItem.event_mode || "local")}
                    name="event_mode"
                  >
                    <option value="local">Presencial</option>
                    <option value="online">Online</option>
                  </select>
                </label>

                {publicationFlowField(formItem) && (
                  <label className="form-control w-full">
                    <span className="label-text mb-1 font-semibold">
                      Status de Publicação
                    </span>
                    <select
                      className="select select-bordered"
                      defaultValue={String(
                        formItem.publication_flow || "draft",
                      )}
                      name="publication_flow"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="review">Em revisão</option>
                      <option value="publish">Publicado</option>
                      <option value="schedule">Agendado</option>
                    </select>
                  </label>
                )}

                <div className="pt-2">
                  <button
                    className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20"
                    type="submit"
                  >
                    <LucideIcon name="save" />
                    {isEdit ? "Salvar alterações" : "Criar evento"}
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-blue-500/10 bg-blue-500/5 p-6 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 mb-3">
                Informação
              </h3>
              <p className="text-xs text-blue-900/70 leading-relaxed">
                Eventos publicados aparecem automaticamente na agenda da TV
                Clubemp e no portal do associado.
              </p>
            </article>
          </aside>
        </div>
      </BackendForm>
    </section>
  );
}

export function CourseFormPage({
  formAction,
  formItem,
  isEdit,
  title,
}: {
  formAction?: string;
  formItem: Row;
  isEdit: boolean;
  title?: string;
}) {
  return (
    <ModuleFormPage
      action={formAction || (isEdit ? "#" : "/dashboard/central/cursos")}
      backHref="/cursos"
      description={
        isEdit
          ? "Atualize metadados, descrição e estado do curso selecionado."
          : "Estruture um novo curso, trilha ou workshop para a TV Clubemp."
      }
      fields={[
        {
          label: "Título",
          name: "title",
          required: true,
          span: "full",
          value: String(formItem.title || ""),
        },
        {
          label: "Tipo",
          name: "is_paid",
          options: { "1": "Pago", "0": "Gratuito" },
          type: "select",
          value: String(formItem.is_paid || "1"),
        },
        {
          label: "Valor (R$)",
          name: "price_brl",
          value: String(formItem.price_brl || ""),
        },
        {
          label: "Resumo",
          name: "summary",
          span: "full",
          type: "textarea",
          value: String(formItem.summary || ""),
        },
        {
          label: "Descrição",
          name: "description",
          span: "full",
          type: "textarea",
          value: String(formItem.description || ""),
        },
        {
          label: "Conteúdo",
          name: "content_body",
          required: true,
          span: "full",
          type: "textarea",
          value: String(formItem.content_body || ""),
        },
        publicationFlowField(formItem),
        publishAtField(formItem),
      ]}
      headerIcon={isEdit ? "pencil" : "plus"}
      headerTitle={isEdit ? "Editar curso" : "Novo curso"}
      submitLabel={isEdit ? "Salvar alterações" : "Salvar curso"}
      title={title || (isEdit ? "Editar curso" : "Cadastrar curso")}
    />
  );
}

export function GiveawayFormPage({
  formAction,
  formItem,
  isEdit,
  title,
}: {
  formAction?: string;
  formItem: Row;
  isEdit: boolean;
  title?: string;
}) {
  return (
    <ModuleFormPage
      action={formAction || (isEdit ? "#" : "/dashboard/central/sorteios")}
      backHref="/sorteios"
      description={
        isEdit
          ? "Ajuste prêmio, status e regras da campanha."
          : "Configure uma nova campanha promocional com prêmio, regras e janela de execução."
      }
      fields={[
        {
          label: "Nome da campanha",
          name: "title",
          required: true,
          span: "full",
          value: String(formItem.title || ""),
        },
        {
          label: "Prêmio",
          name: "prize_description",
          value: String(formItem.prize_description || ""),
        },
        {
          label: "Status",
          name: "status",
          options: { draft: "Rascunho", open: "Aberto", closed: "Encerrado" },
          type: "select",
          value: String(formItem.status || "draft"),
        },
        {
          label: "Publicar agora",
          name: "is_published",
          placeholder: "Disponibilizar no site",
          type: "checkbox",
          value: String(formItem.is_published || "0"),
        },
        {
          label: "Início",
          name: "starts_at",
          type: "datetime-local",
          value: String(formItem.starts_at || ""),
        },
        {
          label: "Encerramento",
          name: "ends_at",
          type: "datetime-local",
          value: String(formItem.ends_at || ""),
        },
        {
          label: "Resumo",
          name: "summary",
          span: "full",
          type: "textarea",
          value: String(formItem.summary || ""),
        },
        {
          label: "Regras",
          name: "description",
          span: "full",
          type: "textarea",
          value: String(formItem.description || ""),
        },
      ]}
      headerIcon={isEdit ? "pencil" : "plus"}
      headerTitle={isEdit ? "Editar sorteio" : "Novo sorteio"}
      submitLabel={isEdit ? "Salvar alterações" : "Salvar sorteio"}
      title={title || (isEdit ? "Editar sorteio" : "Cadastrar sorteio")}
    />
  );
}

export function EditorialShowPage({
  item,
  module,
}: {
  item: Row;
  module: EditorialModule;
}) {
  if (module === "eventos") {
    return (
      <ModuleShowPage
        backHref="/eventos"
        description="Resumo operacional do evento e seus dados de publicação."
        editHref={`/eventos/editar?id=${String(item.id || 0)}`}
        headerIcon="eye"
        headerTitle="Ver evento"
        items={[
          { label: "Início", value: String(item.starts_at || "-") },
          { label: "Fim", value: String(item.ends_at || "-") },
          {
            label: "Descrição",
            span: "full",
            value: String(item.description || "-"),
          },
        ]}
        meta={[
          {
            label: "Formato",
            value: String(
              (item.event_mode || "") === "online" ? "Online" : "Presencial",
            ),
          },
          {
            label: "Local",
            value: String(
              (item.event_mode || "") === "online"
                ? item.online_url || "-"
                : item.location_name || "-",
            ),
          },
          { label: "Status", value: String(item.publication_status || "-") },
          {
            label: "Inscrições",
            value: String(item.registrations_count || "0"),
          },
        ]}
        title={`Evento: ${String(item.title || "-")}`}
      />
    );
  }

  if (module === "cursos") {
    return (
      <ModuleShowPage
        backHref="/cursos"
        description="Visualização do curso e seus dados de publicação."
        editHref={`/cursos/editar?id=${String(item.id || 0)}`}
        headerIcon="eye"
        headerTitle="Ver curso"
        items={[
          { label: "Resumo", span: "full", value: String(item.summary || "-") },
          {
            label: "Descrição",
            span: "full",
            value: String(item.description || "-"),
          },
          {
            label: "Conteúdo",
            span: "full",
            value: String(item.content_body || "-"),
          },
        ]}
        meta={[
          { label: "Slug", value: String(item.slug || "-") },
          {
            label: "Tipo",
            value: String((item.is_paid || "0") === "1" ? "Pago" : "Gratuito"),
          },
          { label: "Status", value: String(item.publication_status || "-") },
          { label: "Acessos", value: String(item.access_count || "0") },
        ]}
        title={`Curso: ${String(item.title || "-")}`}
      />
    );
  }

  return (
    <ModuleShowPage
      backHref="/sorteios"
      description="Painel de visualização da campanha promocional."
      editHref={`/sorteios/editar?id=${String(item.id || 0)}`}
      headerIcon="eye"
      headerTitle="Ver sorteio"
      items={[
        { label: "Resumo", span: "full", value: String(item.summary || "-") },
        {
          label: "Regras",
          span: "full",
          value: String(item.description || "-"),
        },
      ]}
      meta={[
        { label: "Prêmio", value: String(item.prize_description || "-") },
        { label: "Status", value: String(item.status || "-") },
        { label: "Cupons", value: String(item.coupons_count || "0") },
        { label: "Encerramento", value: String(item.ends_at || "-") },
      ]}
      title={`Sorteio: ${String(item.title || "-")}`}
    />
  );
}

export function NewsListPage({
  posts,
  statusFilter = "pending",
  statusOptions = {},
}: {
  posts: Row[];
  statusFilter?: string;
  statusOptions?: Record<string, unknown>;
}) {
  return (
    <section className="mt-4 space-y-6">
      {/* Header Profissional */}
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name="newspaper" className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">
                  Notícias TV Clubemp
                </h1>
                <span className="badge badge-primary badge-outline text-[10px] font-black uppercase tracking-wider">
                  Editorial
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                Gerencie o ciclo de notícias, blog e comunicados oficiais da
                plataforma.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ContentStatusFilter
              statusFilter={statusFilter}
              statusOptions={statusOptions}
            />
            <Link
              className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20"
              href="/noticias/novo"
            >
              <LucideIcon name="plus" className="h-4 w-4" />
              Nova notícia
            </Link>
          </div>
        </div>
      </article>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <article className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-16 text-center text-sm text-base-content/50 shadow-sm italic flex flex-col items-center gap-2">
            <LucideIcon name="search" className="h-8 w-8 opacity-20" />
            Nenhuma notícia cadastrada ainda.
          </article>
        ) : (
          posts.map((post) => (
            <article
              key={String(post.id || post.slug || post.title || "-")}
              className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`badge badge-sm font-black uppercase text-[9px] ${String(post.published_badge || "badge-outline")}`}
                    >
                      {String(post.published_label || "Rascunho")}
                    </span>
                    <span className="badge badge-outline badge-sm font-bold opacity-70">
                      {String(post.review_label || "Sem revisão")}
                    </span>
                    <span className="badge badge-ghost badge-sm font-bold opacity-70">
                      {String(post.sourceLabel || post.source_label || "-")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">
                      {String(post.title || "-")}
                    </h3>
                    {post.companyName || post.company_name ? (
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-base-content/40">
                        <LucideIcon name="building-2" className="h-3 w-3" />
                        {String(post.companyName || post.company_name)}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-base-content/60 font-medium line-clamp-2 max-w-3xl">
                    {String(post.summary || "Sem resumo editorial.")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[9rem]">
                  {String(post.source || "") === "company" ? (
                    <>
                      <Link
                        className="btn btn-outline btn-sm rounded-xl"
                        href={`/empresas/ver?id=${String(post.tenantId || post.tenant_id || 0)}`}
                      >
                        Ver empresa
                      </Link>
                      {String(post.reviewStatus || post.review_status) ===
                      "pending" ? (
                        <div className="mt-2 p-3 rounded-xl bg-warning/10 border border-warning/20">
                          <ReviewActions
                            approveValue="approve"
                            backendPath={`/dashboard/central/empresas/noticias/${String(post.id || 0)}/revisao`}
                            tenantId={String(
                              post.tenantId || post.tenant_id || "",
                            )}
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Link
                        className="btn btn-outline btn-sm rounded-xl group-hover:bg-primary group-hover:text-primary-content transition-all"
                        href={`/noticias/ver?id=${String(post.id || 0)}`}
                      >
                        Ver detalhes
                      </Link>
                      <Link
                        className="btn btn-ghost btn-sm rounded-xl text-base-content/50 hover:text-primary"
                        href={`/noticias/editar?id=${String(post.id || 0)}`}
                      >
                        <LucideIcon name="pencil" className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function ContentStatusFilter({
  statusFilter,
  statusOptions,
}: {
  statusFilter: string;
  statusOptions: Record<string, unknown>;
}) {
  return (
    <form className="flex flex-wrap items-center gap-2">
      <select
        className="select select-bordered select-sm"
        defaultValue={statusFilter}
        name="status"
      >
        {Object.entries(statusOptions).map(([value, label]) => (
          <option key={value} value={value}>
            {String(label)}
          </option>
        ))}
      </select>
      <button className="btn btn-outline btn-sm" type="submit">
        Filtrar
      </button>
    </form>
  );
}

function ReviewActions({
  approveValue,
  backendPath,
  tenantId = "",
}: {
  approveValue: string;
  backendPath: string;
  tenantId?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <BackendForm backendPath={backendPath}>
        {tenantId ? (
          <input name="tenant_id" type="hidden" value={tenantId} />
        ) : null}
        <input name="decision" type="hidden" value={approveValue} />
        <button className="btn btn-success btn-xs" type="submit">
          Aprovar
        </button>
      </BackendForm>
      <BackendForm backendPath={backendPath}>
        {tenantId ? (
          <input name="tenant_id" type="hidden" value={tenantId} />
        ) : null}
        <input name="decision" type="hidden" value="reject" />
        <button className="btn btn-error btn-xs" type="submit">
          Rejeitar
        </button>
      </BackendForm>
    </div>
  );
}

export function NewsFormPage({
  formAction,
  formItem,
  isEdit,
  title,
}: {
  formAction?: string;
  formItem: Row;
  isEdit: boolean;
  title?: string;
}) {
  const backendPath = formAction || (isEdit ? "#" : "/dashboard/central/blog");

  return (
    <section className="mt-4">
      <Link
        className="btn btn-ghost btn-sm -ml-2 mb-4 gap-2 text-base-content/60"
        href="/noticias"
      >
        <LucideIcon name="arrow-left" className="h-4 w-4" />
        Voltar para notícias
      </Link>

      <BackendForm backendPath={backendPath}>
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          {/* Coluna Principal: Conteúdo */}
          <div className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <h1 className="text-3xl font-black tracking-tight">
                {title || (isEdit ? "Editar notícia" : "Cadastrar notícia")}
              </h1>
              <p className="mt-2 text-sm text-base-content/60">
                {isEdit
                  ? "Revise o conteúdo e metadados antes de atualizar a publicação."
                  : "Crie uma nova matéria para ser publicada na TV Clubemp."}
              </p>

              <div className="mt-8 space-y-6">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">Título</span>
                  <input
                    className="input input-bordered"
                    defaultValue={String(formItem.title || "")}
                    name="title"
                    required
                  />
                </label>

                <div className="space-y-2">
                  <span className="label-text block font-semibold">
                    Conteúdo
                  </span>
                  <div className="rounded-2xl border border-base-300 bg-base-50/30 p-2 focus-within:border-primary/50 transition-colors">
                    <EditorJsField
                      help="Use blocos de título, parágrafo, imagens e listas."
                      initialValue={
                        formItem.content ||
                        formItem.content_body ||
                        formItem.body ||
                        ""
                      }
                      name="content"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Coluna Lateral: Publicação e Imagem */}
          <aside className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-primary">
                Publicação
              </h2>

              <div className="space-y-6">
                <ImagePicker
                  defaultValue={String(
                    formItem.cover_image || formItem.coverImage || "",
                  )}
                  help="Capa da notícia (1200x630px)"
                  label="Imagem de capa"
                  name="cover_image"
                />

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Resumo curto
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-[100px]"
                    defaultValue={String(formItem.summary || "")}
                    name="summary"
                    placeholder="Descrição para as listagens..."
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Fluxo de publicação
                  </span>
                  <select
                    className="select select-bordered"
                    defaultValue={String(
                      formItem.publication_status || "draft",
                    )}
                    name="publication_status"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="review">Em revisão</option>
                    <option value="published">Publicado</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Agendar para
                  </span>
                  <input
                    className="input input-bordered"
                    defaultValue={String(formItem.published_at || "")}
                    name="published_at"
                    type="datetime-local"
                  />
                </label>

                <div className="pt-2">
                  <button
                    className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20"
                    type="submit"
                  >
                    <LucideIcon name="save" />
                    {isEdit ? "Salvar alterações" : "Salvar notícia"}
                  </button>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </BackendForm>
    </section>
  );
}

export function NewsShowPage({
  contentHtml,
  post,
}: {
  contentHtml?: string;
  post: Row;
}) {
  const renderedContent =
    contentHtml ||
    String(post.contentHtml || post.content_html || "") ||
    editorContentToHtml(post.content || post.content_body || post.body);

  return (
    <section className="mt-4 space-y-5">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              TV Clubemp
            </p>
            <h2 className="text-2xl font-black">{String(post.title || "-")}</h2>
            <p className="text-sm text-base-content/65">
              Acompanhe o estado editorial e revise a matéria antes de novas
              publicações.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="btn btn-outline rounded-2xl" href="/noticias">
              Voltar
            </Link>
            <Link
              className="btn btn-primary rounded-2xl"
              href={`/noticias/editar?id=${String(post.id || 0)}`}
            >
              Editar
            </Link>
          </div>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Slug", String(post.slug || "-")],
          [
            "Status",
            String(post.publication_label || post.publication_status || "-"),
          ],
          ["Revisão", String(post.review_label || post.review_status || "-")],
          ["Publicação", String(post.published_at || "-")],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <p className="text-xs uppercase text-base-content/55">{label}</p>
            <p className="mt-2 text-lg font-bold">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_20rem]">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Resumo
              </p>
              <p className="mt-2 text-sm leading-7 text-base-content/75">
                {String(post.summary || "Sem resumo editorial.")}
              </p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                Conteúdo
              </p>
              {renderedContent ? (
                <div
                  className="prose prose-sm mt-4 max-w-none text-base-content/85"
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              ) : (
                <p className="mt-4 text-sm leading-7 text-base-content/65">
                  Sem conteúdo editorial.
                </p>
              )}
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h3 className="text-base font-black">Ações rápidas</h3>
            <div className="mt-4 flex flex-col gap-3">
              {[
                [
                  String(post.publication_status || "") === "inactive"
                    ? "draft"
                    : "inactive",
                  String(post.publication_status || "") === "inactive"
                    ? "Reativar notícia"
                    : "Desativar notícia",
                ],
                ["published", "Publicar agora"],
                ["review", "Enviar para revisão"],
              ].map(([status, label]) => (
                <BackendForm
                  key={status}
                  backendPath={`/dashboard/central/blog/${String(post.id || 0)}/status`}
                >
                  <input name="status" type="hidden" value={status} />
                  <button
                    className="btn btn-outline w-full rounded-2xl"
                    type="submit"
                  >
                    {label}
                  </button>
                </BackendForm>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}

function editorContentToHtml(value: unknown) {
  const document = normalizeEditorDocument(value);
  if (!document) {
    return "";
  }

  return document.blocks
    .map((block) => {
      const type = String(block.type || "");
      const data = isRecord(block.data) ? block.data : {};

      if (type === "paragraph") {
        return wrapHtml("p", stringValue(data.text));
      }

      if (type === "header") {
        const level = Math.max(1, Math.min(6, Number(data.level || 2)));
        return wrapHtml(`h${level}`, stringValue(data.text));
      }

      if (type === "quote") {
        const text = stringValue(data.text);
        const caption = stringValue(data.caption);
        if (!text) return "";

        return `<blockquote><p>${text}</p>${caption ? `<cite>${caption}</cite>` : ""}</blockquote>`;
      }

      if (type === "delimiter") {
        return "<hr>";
      }

      if (type === "list") {
        const items = Array.isArray(data.items) ? data.items : [];
        const tag = data.style === "ordered" ? "ol" : "ul";
        const children = items
          .map((item) => {
            if (typeof item === "string") return wrapHtml("li", item);
            if (isRecord(item))
              return wrapHtml("li", stringValue(item.content));
            return "";
          })
          .join("");

        return children ? `<${tag}>${children}</${tag}>` : "";
      }

      return "";
    })
    .filter(Boolean)
    .join("");
}

function normalizeEditorDocument(value: unknown) {
  if (isRecord(value) && Array.isArray(value.blocks)) {
    return value as { blocks: Array<{ data?: unknown; type?: unknown }> };
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "[object Object]") {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (isRecord(parsed) && Array.isArray(parsed.blocks)) {
      return parsed as { blocks: Array<{ data?: unknown; type?: unknown }> };
    }
  } catch {
    return {
      blocks: [{ type: "paragraph", data: { text: escapeHtml(trimmed) } }],
    };
  }

  return null;
}

function wrapHtml(tag: string, html: string) {
  const content = html.trim();
  return content ? `<${tag}>${content}</${tag}>` : "";
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function publicationFlowField(formItem: Row): ModuleFormField {
  return {
    label: "Fluxo de publicação",
    name: "publication_flow",
    options: {
      draft: "Rascunho",
      review: "Enviar para revisão",
      publish: "Publicar agora",
      schedule: "Agendar",
    },
    type: "select",
    value: String(formItem.publication_flow || "draft"),
  };
}

function publishAtField(formItem: Row): ModuleFormField {
  return {
    label: "Agendar para",
    name: "publish_at",
    type: "datetime-local",
    value: String(formItem.publish_at || ""),
  };
}
