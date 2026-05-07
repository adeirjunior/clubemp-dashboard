import { BackendForm } from "@/components/backend-form";
import { LucideIcon } from "@/components/lucide-icon";
import {
  asRecord,
  asRecordArray,
  loadDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type OptionRow = Record<string, unknown>;

export default async function Page({ searchParams }: PageProps) {
  const data = await loadDashboardData(
    "/portal/meu-espaco/perfil",
    await searchParams,
    "/meu-espaco/perfil",
  );
  const tenant = asRecord(data.tenant);
  const user = asRecord(data.user);
  const monthlyGifts = asStringList(
    tenant.monthly_gifts ?? tenant.monthly_gifts_json,
    2,
  );
  const isVendorTenant =
    String(tenant.card_type || "") === "empreendedor" ||
    String(user.account_type || "") === "company_vendor";

  return (
    <section className="mt-4">
      <article className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="card-title text-base">
              <LucideIcon className="h-4 w-4" name="building-2" />
              Perfil da empresa
            </h2>
            <span
              className={`badge ${String(tenant.visibility_status || "active") === "active" ? "badge-success" : "badge-warning"}`}
            >
              {String(tenant.status_label || "Ativa")}
            </span>
          </div>

          {tenant.banner_path ? (
            <div
              aria-label="Banner da empresa"
              className="h-36 w-full rounded-xl bg-cover bg-center"
              role="img"
              style={{
                backgroundImage: `url(${String(tenant.banner_path)})`,
              }}
            />
          ) : null}

          <BackendForm
            backendPath="/portal/meu-espaco/perfil"
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              name="visibility_status"
              type="hidden"
              value={String(tenant.visibility_status || "active")}
            />

            <TextInput
              defaultValue={String(tenant.document_number || "")}
              label="Documento"
              name="document_number"
            />
            <label className="form-control">
              <span className="label-text mb-1 font-semibold">
                Tipo de documento
              </span>
              <select
                className="select select-bordered w-full"
                defaultValue={String(tenant.document_type || "cnpj")}
                name="document_type"
              >
                <option value="cnpj">CNPJ</option>
                <option value="cpf">CPF</option>
              </select>
            </label>

            {[
              ["legal_name", "Nome jurídico / razão social"],
              ["trade_name", "Nome fantasia"],
              [
                "entrepreneur_name",
                isVendorTenant ? "Sócio empreendedor" : "Sócio conveniado",
              ],
              [
                "entrepreneur_email",
                isVendorTenant
                  ? "E-mail do sócio empreendedor"
                  : "E-mail do sócio conveniado",
                "email",
              ],
              [
                "entrepreneur_phone",
                isVendorTenant
                  ? "Telefone do sócio empreendedor"
                  : "Telefone do sócio conveniado",
              ],
              ["contact_email", "E-mail institucional", "email"],
              ["contact_phone", "Telefone institucional"],
              ["city", "Cidade sede"],
              ["state", "Estado sede"],
            ].map(([name, label, type]) => (
              <TextInput
                key={name}
                defaultValue={String(tenant[name] || "")}
                label={label}
                name={name}
                required={name === "trade_name"}
                type={type || "text"}
              />
            ))}

            {isVendorTenant ? (
              <>
                <MultiCheckboxField
                  label="Municípios de atuação"
                  name="city_ids[]"
                  options={asRecordArray(data.all_cities)}
                  selected={asStringSet(data.acting_cities)}
                  valueKey="id"
                  labelFor={(city) =>
                    `${String(city.nome || city.name || "-")} - ${String(city.estado || city.state || "")}`.trim()
                  }
                />

                <MultiCheckboxField
                  label="Categorias de atuação"
                  name="category_ids[]"
                  options={asRecordArray(data.all_categories)}
                  selected={asStringSet(data.acting_categories)}
                  valueKey="id"
                  labelFor={(category) => String(category.name || "-")}
                />

                <section className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:col-span-2">
                  <div className="flex items-start gap-3">
                    <span className="rounded-xl bg-primary/10 p-2 text-primary">
                      <LucideIcon className="h-4 w-4" name="gift" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-primary">
                        2 Brindes Mensais
                      </h3>
                      <p className="text-xs text-base-content/65">
                        Informe os 2 brindes mensais oferecidos pela sua empresa
                        empreendedora. Estes campos são obrigatórios para salvar
                        o perfil empreendedor.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput
                      defaultValue={monthlyGifts[0] || ""}
                      label="Brinde 1"
                      name="monthly_gifts[]"
                      placeholder="Ex: Vale-compra de R$ 50"
                      required
                    />
                    <TextInput
                      defaultValue={monthlyGifts[1] || ""}
                      label="Brinde 2"
                      name="monthly_gifts[]"
                      placeholder="Ex: Kit promocional mensal"
                      required
                    />
                  </div>
                </section>
              </>
            ) : null}

            {[
              ["description", "Descrição institucional"],
              ["services_text", "Serviços"],
              ["products_text", "Produtos institucionais"],
            ].map(([name, label]) => (
              <label key={name} className="form-control md:col-span-2">
                <span className="label-text mb-1 font-semibold">{label}</span>
                <textarea
                  className="textarea textarea-bordered min-h-24 w-full"
                  defaultValue={String(tenant[name] || "")}
                  name={name}
                />
              </label>
            ))}

            <FileInput label="Logo" name="logo" />
            <FileInput label="Banner da página" name="banner" />

            <button className="btn btn-primary md:col-span-2" type="submit">
              Salvar perfil da empresa
            </button>
          </BackendForm>
        </div>
      </article>
    </section>
  );
}

function MultiCheckboxField({
  label,
  labelFor,
  name,
  options,
  selected,
  valueKey,
}: {
  label: string;
  labelFor: (option: OptionRow) => string;
  name: string;
  options: OptionRow[];
  selected: Set<string>;
  valueKey: string;
}) {
  return (
    <fieldset className="form-control md:col-span-2">
      <legend className="label-text mb-2 font-semibold text-primary">
        {label}
      </legend>
      <div className="max-h-64 overflow-y-auto rounded-2xl border border-base-300 bg-base-200/40 p-3">
        {options.length === 0 ? (
          <p className="text-sm text-base-content/60">
            Nenhuma opção disponível.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {options.map((option) => {
              const value = String(option[valueKey] || "");
              return (
                <label
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm transition hover:border-primary"
                  key={value}
                >
                  <input
                    className="checkbox checkbox-primary checkbox-sm"
                    defaultChecked={selected.has(value)}
                    name={name}
                    type="checkbox"
                    value={value}
                  />
                  <span>{labelFor(option)}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </fieldset>
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
        maxLength={name === "monthly_gifts[]" ? 120 : undefined}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function FileInput({ label, name }: { label: string; name: string }) {
  return (
    <label className="form-control">
      <span className="label-text mb-1 font-semibold">{label}</span>
      <input
        className="file-input file-input-bordered w-full"
        name={name}
        type="file"
      />
    </label>
  );
}

function asStringList(value: unknown, length: number) {
  const source = typeof value === "string" ? parseStringListJson(value) : value;
  const values = Array.isArray(source)
    ? source.map((item) =>
        typeof item === "string" ? item : String(item || ""),
      )
    : [];

  return Array.from({ length }, (_, index) => values[index] || "");
}

function parseStringListJson(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function asStringSet(value: unknown) {
  if (!Array.isArray(value)) {
    return new Set<string>();
  }

  return new Set(
    value
      .map((item) => String(item || "").trim())
      .filter((item) => item !== ""),
  );
}
