import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import {
  type ModuleFormField,
  ModuleFormPage,
  ModuleShowPage,
} from "./crud-pages";

type Row = Record<string, unknown>;
type EditorialModule = "eventos" | "cursos" | "sorteios";

const moduleConfig = {
  eventos: {
    columns: ["Nome", "Formato", "Local", "Status", "Início"],
    createHref: "/central/eventos/novo",
    description:
      "Planeje eventos presenciais, transmissão, patrocínio e publicação institucional.",
    emptyMessage: "Nenhum evento encontrado.",
    headerIcon: "calendar-days",
    headerTitle: "Eventos",
    title: "Agenda de eventos",
  },
  cursos: {
    columns: ["Curso", "Slug", "Tipo", "Status", "Atualizado"],
    createHref: "/central/cursos/novo",
    description:
      "Centralize trilhas, aulas e forma de publicação dos cursos da plataforma.",
    emptyMessage: "Nenhum curso encontrado.",
    headerIcon: "graduation-cap",
    headerTitle: "Cursos",
    title: "Catálogo de cursos",
  },
  sorteios: {
    columns: ["Campanha", "Prêmio", "Status", "Cupons", "Encerramento"],
    createHref: "/central/sorteios/novo",
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
}: {
  module: EditorialModule;
  rows: Row[];
}) {
  const config = moduleConfig[module];

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{config.title}</h2>
              <p className="text-sm text-base-content/70">
                {config.description}
              </p>
            </div>
            <Link className="btn btn-primary btn-sm" href={config.createHref}>
              Novo
            </Link>
          </div>
        </div>
      </article>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  {[...config.columns, "Ações"].map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="py-8 text-center text-sm text-base-content/65"
                      colSpan={config.columns.length + 1}
                    >
                      {config.emptyMessage}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={String(row.id || row.title || row.slug || "-")}>
                      {moduleCells(module, row).map((cell, index) => (
                        <td key={`${String(row.id || row.title)}-${index}`}>
                          {cell}
                        </td>
                      ))}
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            className="btn btn-outline btn-xs"
                            href={`/central/${module}/ver?id=${String(row.id || 0)}`}
                          >
                            Ver
                          </Link>
                          <Link
                            className="btn btn-primary btn-xs"
                            href={`/central/${module}/editar?id=${String(row.id || 0)}`}
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
  return (
    <ModuleFormPage
      action={formAction || (isEdit ? "#" : "/dashboard/central/eventos")}
      backHref="/central/eventos"
      description={
        isEdit
          ? "Atualize agenda, formato e comunicação do evento selecionado."
          : "Defina agenda, formato e comunicação para um novo evento institucional."
      }
      fields={[
        {
          label: "Nome do evento",
          name: "title",
          required: true,
          span: "full",
          value: String(formItem.title || ""),
        },
        {
          label: "Formato",
          name: "event_mode",
          options: { local: "Presencial", online: "Online" },
          type: "select",
          value: String(formItem.event_mode || "local"),
        },
        {
          label: "Local",
          name: "location_name",
          value: String(formItem.location_name || ""),
        },
        {
          label: "Endereço",
          name: "location_address",
          value: String(formItem.location_address || ""),
        },
        {
          label: "URL online",
          name: "online_url",
          span: "full",
          type: "url",
          value: String(formItem.online_url || ""),
        },
        {
          label: "Início",
          name: "starts_at",
          required: true,
          type: "datetime-local",
          value: String(formItem.starts_at || ""),
        },
        {
          label: "Fim",
          name: "ends_at",
          type: "datetime-local",
          value: String(formItem.ends_at || ""),
        },
        {
          label: "Capacidade",
          name: "capacity",
          type: "number",
          value: String(formItem.capacity || ""),
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
        publicationFlowField(formItem),
        publishAtField(formItem),
      ]}
      headerIcon={isEdit ? "pencil" : "plus"}
      headerTitle={isEdit ? "Editar evento" : "Novo evento"}
      submitLabel={isEdit ? "Salvar alterações" : "Salvar evento"}
      title={title || (isEdit ? "Editar evento" : "Cadastrar evento")}
    />
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
      backHref="/central/cursos"
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
      backHref="/central/sorteios"
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
        backHref="/central/eventos"
        description="Resumo operacional do evento e seus dados de publicação."
        editHref={`/central/eventos/editar?id=${String(item.id || 0)}`}
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
        backHref="/central/cursos"
        description="Visualização do curso e seus dados de publicação."
        editHref={`/central/cursos/editar?id=${String(item.id || 0)}`}
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
      backHref="/central/sorteios"
      description="Painel de visualização da campanha promocional."
      editHref={`/central/sorteios/editar?id=${String(item.id || 0)}`}
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

export function NewsListPage({ posts }: { posts: Row[] }) {
  return (
    <section className="mt-4 space-y-5">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              TV Clubemp
            </p>
            <h2 className="text-2xl font-black">Notícias</h2>
            <p className="max-w-2xl text-sm text-base-content/70">
              Gerencie o ciclo editorial com páginas separadas para criação,
              visualização e edição.
            </p>
          </div>
          <Link
            className="btn btn-primary rounded-2xl"
            href="/central/noticias/novo"
          >
            Nova notícia
          </Link>
        </div>
      </article>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <article className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/65 shadow-sm">
            Nenhuma notícia cadastrada ainda.
          </article>
        ) : (
          posts.map((post) => (
            <article
              key={String(post.id || post.slug || post.title || "-")}
              className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`badge ${String(post.published_badge || "badge-outline")}`}
                    >
                      {String(post.published_label || "Rascunho")}
                    </span>
                    <span className="badge badge-outline">
                      {String(post.review_label || "Sem revisão")}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-black">
                    {String(post.title || "-")}
                  </h3>
                  <p className="mt-2 text-sm text-base-content/65">
                    {String(post.summary || "Sem resumo editorial.")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:min-w-[10rem]">
                  <Link
                    className="btn btn-outline btn-sm rounded-2xl"
                    href={`/central/noticias/ver?id=${String(post.id || 0)}`}
                  >
                    Ver
                  </Link>
                  <Link
                    className="btn btn-primary btn-sm rounded-2xl"
                    href={`/central/noticias/editar?id=${String(post.id || 0)}`}
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
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
  return (
    <ModuleFormPage
      action={formAction || (isEdit ? "#" : "/dashboard/central/blog")}
      backHref="/central/noticias"
      description={
        isEdit
          ? "Revise conteúdo, status editorial e a prévia pública antes de salvar."
          : "Estruture uma nova matéria com revisão visual antes de publicar."
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
          label: "Resumo",
          name: "summary",
          span: "full",
          value: String(formItem.summary || ""),
        },
        {
          label: "Imagem de capa",
          name: "cover_image",
          type: "file",
        },
        {
          label: "Fluxo de publicação",
          name: "publication_status",
          options: {
            draft: "Rascunho",
            review: "Em revisão",
            published: "Publicado",
            inactive: "Inativo",
          },
          type: "select",
          value: String(formItem.publication_status || "draft"),
        },
        {
          label: "Agendar para",
          name: "published_at",
          type: "datetime-local",
          value: String(formItem.published_at || ""),
        },
        {
          label: "Conteúdo",
          name: "content",
          required: true,
          rows: 12,
          span: "full",
          type: "textarea",
          value: String(
            formItem.content || formItem.content_body || formItem.body || "",
          ),
        },
      ]}
      headerIcon={isEdit ? "square-pen" : "newspaper"}
      headerTitle={isEdit ? "Editar notícia" : "Nova notícia"}
      submitLabel={isEdit ? "Salvar alterações" : "Salvar notícia"}
      title={title || (isEdit ? "Editar notícia" : "Cadastrar notícia")}
    />
  );
}

export function NewsShowPage({
  contentHtml,
  post,
}: {
  contentHtml?: string;
  post: Row;
}) {
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
            <Link
              className="btn btn-outline rounded-2xl"
              href="/central/noticias"
            >
              Voltar
            </Link>
            <Link
              className="btn btn-primary rounded-2xl"
              href={`/central/noticias/editar?id=${String(post.id || 0)}`}
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
              <div className="mt-4 whitespace-pre-line text-sm leading-7 text-base-content/85">
                {String(
                  post.content ||
                    post.content_body ||
                    post.body ||
                    (contentHtml || "")
                      .replace(/<[^>]+>/g, " ")
                      .replace(/\s+/g, " ")
                      .trim() ||
                    "Sem conteúdo editorial.",
                )}
              </div>
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
