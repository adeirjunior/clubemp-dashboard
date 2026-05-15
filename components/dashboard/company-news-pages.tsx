import Link from "next/link";
import { BackendForm } from "@/components/backend-form";
import { EditorJsField } from "@/components/editor-js-field";
import { ImagePicker } from "@/components/image-picker";
import { LucideIcon } from "@/components/lucide-icon";
import { asRecordArray, type DashboardData } from "@/lib/dashboard-data";

type RecordItem = Record<string, unknown>;

export function CompanyNewsListPage({
  canPublishDirectly,
  data,
}: {
  canPublishDirectly: boolean;
  data: DashboardData;
}) {
  const news = asRecordArray(data.news);

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
                  Minhas Notícias
                </h1>
                <span
                  className={`badge ${canPublishDirectly ? "badge-success" : "badge-warning"} badge-outline text-[10px] font-black uppercase tracking-wider`}
                >
                  {canPublishDirectly
                    ? "Escritor liberado"
                    : "Revisão obrigatória"}
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                {canPublishDirectly
                  ? "Sua empresa possui permissão para publicar notícias diretamente."
                  : "As notícias enviadas serão revisadas pela administração antes da publicação."}
              </p>
            </div>
          </div>
          <Link
            className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20"
            href="/noticias/novo"
          >
            <LucideIcon name="plus" className="h-4 w-4" />
            Nova notícia
          </Link>
        </div>
      </article>

      {/* Listagem */}
      <article className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 text-xs font-black uppercase tracking-widest text-base-content/70">
                <th className="py-5 px-6 first:pl-8">Título</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-6">Data</th>
                <th className="py-5 px-6 pr-8 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {news.length === 0 ? (
                <tr>
                  <td
                    className="py-16 text-center text-base-content/50 italic"
                    colSpan={4}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <LucideIcon
                        name="search"
                        className="h-8 w-8 opacity-20"
                      />
                      Nenhuma notícia enviada.
                    </div>
                  </td>
                </tr>
              ) : (
                news.map((item) => {
                  const id = String(item.id || "");

                  return (
                    <tr
                      key={id || String(item.title)}
                      className="group hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-4 px-6 first:pl-8">
                        <strong className="block group-hover:text-primary transition-colors">
                          {String(item.title || "-")}
                        </strong>
                        <p className="line-clamp-1 text-xs text-base-content/50">
                          {String(item.summary || "Sem resumo.")}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge badge-outline badge-sm font-bold opacity-80">
                          {String(item.statusLabel || item.status || "-")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-base-content/60">
                        {String(item.createdAt || item.created_at || "-")}
                      </td>
                      <td className="py-4 px-6 pr-8 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            className="btn btn-outline btn-xs rounded-lg group-hover:bg-base-100"
                            href={`/noticias/ver?id=${id}`}
                          >
                            Ver
                          </Link>
                          <Link
                            className="btn btn-primary btn-xs rounded-lg shadow-sm"
                            href={`/noticias/editar?id=${id}`}
                          >
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export function CompanyNewsCreatePage({
  canPublishDirectly,
}: {
  canPublishDirectly: boolean;
}) {
  return (
    <CompanyNewsFormPage
      backendPath="/portal/meu-espaco/noticias"
      canPublishDirectly={canPublishDirectly}
      item={{}}
      title="Nova notícia"
    />
  );
}

export function CompanyNewsEditPage({
  canPublishDirectly,
  item,
}: {
  canPublishDirectly: boolean;
  item: RecordItem;
}) {
  const id = String(item.id || "");

  return (
    <CompanyNewsFormPage
      backendPath={`/portal/meu-espaco/noticias/${id}/atualizar`}
      canPublishDirectly={canPublishDirectly}
      item={item}
      title="Editar notícia"
    />
  );
}

export function CompanyNewsShowPage({ item }: { item: RecordItem }) {
  const id = String(item.id || "");
  const isActive = String(item.isActive ?? item.is_active ?? "") === "1";
  const contentHtml = String(item.contentHtml || item.content_html || "");
  const contentText = contentToPlainText(item) || stripHtml(contentHtml);

  return (
    <section className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
        <Link className="link mb-4 inline-flex text-sm" href="/noticias">
          Voltar para notícias
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Notícia
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {String(item.title || "-")}
            </h1>
            <p className="mt-3 text-base-content/70">
              {String(item.summary || "Sem resumo.")}
            </p>
          </div>
          <span className="badge badge-outline">
            {String(item.statusLabel || item.status || "-")}
          </span>
        </div>
        {contentHtml ? (
          <div
            className="prose prose-sm mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <div className="prose prose-sm mt-6 max-w-none">
            {contentText
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        )}
      </article>

      <aside className="space-y-4">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-lg font-black">Ações</h2>
          <div className="mt-4 grid gap-3">
            <Link
              className="btn btn-primary"
              href={`/noticias/editar?id=${id}`}
            >
              <LucideIcon name="pencil" />
              Editar notícia
            </Link>
            <BackendForm
              backendPath={`/portal/meu-espaco/noticias/${id}/status`}
              className="grid"
            >
              <button className="btn btn-outline" type="submit">
                {isActive ? "Desativar notícia" : "Ativar notícia"}
              </button>
            </BackendForm>
          </div>
        </article>
      </aside>
    </section>
  );
}

function CompanyNewsFormPage({
  backendPath,
  canPublishDirectly,
  item,
  title,
}: {
  backendPath: string;
  canPublishDirectly: boolean;
  item: RecordItem;
  title: string;
}) {
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
              <h1 className="text-3xl font-black tracking-tight">{title}</h1>
              <p className="mt-2 text-sm text-base-content/60">
                {canPublishDirectly
                  ? "Sua empresa possui selo de escritor. A notícia será publicada imediatamente após salvar."
                  : "Após o envio, sua notícia passará por uma revisão editorial antes de ficar pública."}
              </p>

              <div className="mt-8 space-y-6">
                <TextInput
                  defaultValue={String(item.title || "")}
                  label="Título da notícia"
                  name="title"
                  placeholder="Ex: Novo benefício exclusivo para associados"
                  required
                />

                <div className="space-y-2">
                  <span className="label-text block font-semibold">
                    Conteúdo da matéria
                  </span>
                  <div className="rounded-2xl border border-base-300 bg-base-50/30 p-2 focus-within:border-primary/50 transition-colors">
                    <EditorJsField
                      help="Estruture sua notícia com títulos, imagens e listas."
                      initialValue={item.content || contentToPlainText(item)}
                      name="content"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Coluna Lateral: Metadados e Ações */}
          <aside className="space-y-6">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-primary">
                Publicação
              </h2>

              <div className="space-y-6">
                <ImagePicker
                  defaultValue={String(
                    item.coverImage || item.cover_image || "",
                  )}
                  help="Capa da notícia (1200x630px recomendados). Máximo 2MB."
                  label="Imagem de capa"
                  name="cover_image"
                />

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-semibold">
                    Resumo curto
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-[120px]"
                    defaultValue={String(item.summary || "")}
                    name="summary"
                    placeholder="Uma breve descrição que aparece na listagem das notícias..."
                  />
                </label>

                <div className="pt-2">
                  <button
                    className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20"
                    type="submit"
                  >
                    <LucideIcon
                      name={canPublishDirectly ? "send" : "check-circle"}
                    />
                    {canPublishDirectly
                      ? "Salvar e publicar"
                      : "Enviar p/ revisão"}
                  </button>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-primary">
                <LucideIcon name="info" className="h-5 w-5" />
                <h2 className="text-sm font-black uppercase tracking-tight">
                  Dicas de redação
                </h2>
              </div>
              <ul className="mt-4 space-y-3 text-xs text-base-content/70 font-medium">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Use títulos chamativos que reflitam o conteúdo real.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    O resumo ajuda os usuários a decidirem ler a matéria
                    completa.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Imagens de alta qualidade aumentam o engajamento.</span>
                </li>
              </ul>
            </article>

            {!canPublishDirectly && (
              <div className="alert alert-warning rounded-2xl text-xs font-bold py-4">
                <LucideIcon name="clock" className="h-4 w-4" />
                <span>Esta notícia aguardará aprovação administrativa.</span>
              </div>
            )}
          </aside>
        </div>
      </BackendForm>
    </section>
  );
}

function TextInput({
  defaultValue = "",
  label,
  name,
  placeholder,
  required,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="form-control">
      <span className="label-text mb-1 font-semibold">{label}</span>
      <input
        className="input input-bordered"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

export function findCompanyNewsItem(data: DashboardData, id: string) {
  return asRecordArray(data.news).find((item) => String(item.id || "") === id);
}

function contentToPlainText(item: RecordItem) {
  const content = item.content;

  if (typeof content === "string") {
    return extractTextFromPossibleEditorJson(content);
  }

  if (content && typeof content === "object" && "blocks" in content) {
    return extractTextFromEditorBlocks(content as { blocks?: unknown });
  }

  return "";
}

function extractTextFromPossibleEditorJson(value: string) {
  if (value.trim() === "[object Object]") {
    return "";
  }

  try {
    const parsed = JSON.parse(value) as { blocks?: unknown };
    return extractTextFromEditorBlocks(parsed);
  } catch {
    return value;
  }
}

function extractTextFromEditorBlocks(value: { blocks?: unknown }) {
  if (!Array.isArray(value.blocks)) {
    return "";
  }

  return value.blocks
    .map((block) => {
      if (!block || typeof block !== "object" || !("data" in block)) {
        return "";
      }

      const data = (block as { data?: { text?: unknown } }).data;
      return typeof data?.text === "string" ? stripHtml(data.text) : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "");
}
