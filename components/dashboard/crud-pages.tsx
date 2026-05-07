import Link from "next/link";
import { BackendForm } from "@/components/backend-form";

export type TableRowAction = {
  href: string;
  label: string;
  tone?: "primary" | "outline";
};

export function SimpleCrudTable({
  columns,
  countLabel,
  createHref,
  createLabel,
  description,
  emptyMessage,
  rowActions,
  rows,
  title,
}: {
  activeMenu: string;
  columns: string[];
  countLabel: string;
  createHref?: string;
  createLabel?: string;
  description: string;
  emptyMessage: string;
  headerBadge?: string;
  headerIcon: string;
  headerTitle: string;
  rowActions?: TableRowAction[][];
  rows: Array<Array<React.ReactNode>>;
  title: string;
}) {
  const hasActions = Boolean(rowActions?.some((actions) => actions.length > 0));
  const tableColumns = hasActions ? [...columns, "Ações"] : columns;

  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-base-content/70">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-outline">{countLabel}</span>
              {createHref ? (
                <Link className="btn btn-primary btn-sm" href={createHref}>
                  {createLabel || "Novo"}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      className="py-8 text-center text-sm text-base-content/65"
                      colSpan={tableColumns.length}
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  rows.map((row, rowIndex) => {
                    const rowKeyParts = row
                      .slice(0, 2)
                      .map((value) => String(value || "").trim())
                      .filter(Boolean);
                    const rowKey =
                      rowKeyParts.length > 0
                        ? `${title}-${rowKeyParts.join("|")}-${rowIndex}`
                        : `${title}-${rowIndex}`;

                    return (
                      <tr key={rowKey}>
                        {columns.map((column, cellIndex) => (
                          <td key={`${title}-${column}`}>
                            {row[cellIndex] || "-"}
                          </td>
                        ))}
                        {hasActions ? (
                          <td>
                            <div className="flex flex-wrap gap-2">
                              {(rowActions?.[rowIndex] || []).map((action) => (
                                <Link
                                  className={`btn btn-xs ${action.tone === "primary" ? "btn-primary" : "btn-outline"}`}
                                  href={action.href}
                                  key={`${action.label}-${action.href}`}
                                >
                                  {action.label}
                                </Link>
                              ))}
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </article>
    </section>
  );
}

export type ModuleFormField = {
  help?: string;
  label: string;
  name?: string;
  options?: Record<string, string>;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  span?: "full";
  type?:
    | "checkbox"
    | "datetime-local"
    | "file"
    | "number"
    | "select"
    | "text"
    | "textarea"
    | "url";
  value?: string;
};

export function ModuleFormPage({
  action,
  backHref,
  description,
  fields,
  hiddenFields,
  submitLabel,
  title,
}: {
  action: string;
  backHref: string;
  description: string;
  fields: ModuleFormField[];
  headerIcon: string;
  headerTitle: string;
  hiddenFields?: Record<string, string>;
  submitLabel: string;
  title: string;
}) {
  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-base-content/70">{description}</p>
            </div>
            <Link className="btn btn-sm btn-outline" href={backHref}>
              Voltar
            </Link>
          </div>
        </div>
      </article>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <BackendForm
            backendPath={action}
            className="grid gap-4 md:grid-cols-2"
          >
            {hiddenFields
              ? Object.entries(hiddenFields).map(([key, value]) => (
                  <input key={key} name={key} type="hidden" value={value} />
                ))
              : null}
            {fields.map((field) => {
              const type = field.type || "text";
              const className =
                field.span === "full"
                  ? "form-control md:col-span-2"
                  : "form-control";

              return (
                // biome-ignore lint/a11y/noLabelWithoutControl: controls are rendered conditionally by field type inside this wrapper.
                <label
                  key={`${field.name || field.label}-${field.label}`}
                  className={className}
                >
                  <span className="label-text mb-1 font-semibold">
                    {field.label}
                  </span>
                  {type === "textarea" ? (
                    <textarea
                      className="textarea textarea-bordered min-h-24 w-full"
                      defaultValue={field.value || ""}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={field.rows || 5}
                    />
                  ) : null}
                  {type === "select" ? (
                    <select
                      className="select select-bordered w-full"
                      defaultValue={field.value || ""}
                      name={field.name}
                      required={field.required}
                    >
                      {field.options
                        ? Object.entries(field.options).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ),
                          )
                        : null}
                    </select>
                  ) : null}
                  {type === "checkbox" ? (
                    <>
                      <input name={field.name} type="hidden" value="0" />
                      <label className="label cursor-pointer justify-start gap-3 rounded-xl border border-base-300 px-4 py-3">
                        <input
                          className="checkbox checkbox-primary"
                          defaultChecked={field.value === "1"}
                          name={field.name}
                          type="checkbox"
                          value="1"
                        />
                        <span className="label-text">
                          {field.placeholder || field.label}
                        </span>
                      </label>
                    </>
                  ) : null}
                  {type === "file" ? (
                    <input
                      className="file-input file-input-bordered w-full"
                      name={field.name}
                      type="file"
                    />
                  ) : null}
                  {!["textarea", "select", "checkbox", "file"].includes(
                    type,
                  ) ? (
                    <input
                      className="input input-bordered w-full"
                      defaultValue={field.value || ""}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      type={type}
                    />
                  ) : null}
                  {field.help ? (
                    <span className="label-text-alt mt-1 text-base-content/65">
                      {field.help}
                    </span>
                  ) : null}
                </label>
              );
            })}
            <button className="btn btn-primary md:col-span-2" type="submit">
              {submitLabel}
            </button>
          </BackendForm>
        </div>
      </article>
    </section>
  );
}

export function ModuleShowPage({
  backHref,
  description,
  editHref,
  items,
  meta,
  title,
}: {
  backHref: string;
  description: string;
  editHref?: string;
  headerIcon: string;
  headerTitle: string;
  items: Array<{ label: string; span?: "full"; value: string }>;
  meta: Array<{ label: string; value: string }>;
  title: string;
}) {
  return (
    <section className="mt-4 space-y-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-sm text-base-content/70">{description}</p>
            </div>
            <div className="flex gap-2">
              <Link className="btn btn-sm btn-outline" href={backHref}>
                Voltar
              </Link>
              {editHref ? (
                <Link className="btn btn-sm btn-primary" href={editHref}>
                  Editar
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {meta.map((item) => (
          <article
            key={`${item.label}-${item.value}`}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <p className="text-xs uppercase text-base-content/55">
                {item.label}
              </p>
              <p className="text-lg font-bold">{item.value}</p>
            </div>
          </article>
        ))}
      </section>

      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className={item.span === "full" ? "md:col-span-2" : ""}
              >
                <p className="text-xs uppercase tracking-wide text-base-content/55">
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-base-content/80">
                  {item.value || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
