import { BackendForm } from "@/components/backend-form";
import { ImagePicker } from "@/components/image-picker";
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
    "/perfil",
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
    <main className="mx-auto w-full max-w-7xl py-4 space-y-6">
      <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <LucideIcon name="building-2" className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">
                  Perfil da Empresa
                </h1>
                <span
                  className={`badge ${String(tenant.visibility_status || "active") === "active" ? "badge-success" : "badge-warning"} badge-outline text-[10px] font-black uppercase tracking-wider`}
                >
                  {String(tenant.status_label || "Ativa")}
                </span>
              </div>
              <p className="max-w-2xl text-sm font-medium text-base-content/60">
                Gerencie as informações institucionais, identidade visual e
                presença da sua empresa no ecossistema.
              </p>
            </div>
          </div>
        </div>
      </article>

      <BackendForm
        backendPath="/portal/meu-espaco/perfil"
        className="grid gap-6 xl:grid-cols-[1fr_400px]"
      >
        <div className="space-y-6">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-primary">
              <LucideIcon name="info" className="h-5 w-5" />
              Dados Institucionais
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <input
                name="visibility_status"
                type="hidden"
                value={String(tenant.visibility_status || "active")}
              />

              <TextInput
                defaultValue={String(tenant.document_number || "")}
                label="Documento (CNPJ/CPF)"
                name="document_number"
                required
              />

              <label className="form-control w-full">
                <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider opacity-60">
                  Tipo de Documento
                </span>
                <select
                  className="select select-bordered w-full font-bold"
                  defaultValue={String(tenant.document_type || "cnpj")}
                  name="document_type"
                >
                  <option value="cnpj">CNPJ</option>
                  <option value="cpf">CPF</option>
                </select>
              </label>

              <div className="md:col-span-2 grid gap-6 md:grid-cols-2">
                {[
                  ["legal_name", "Razão Social"],
                  ["trade_name", "Nome Fantasia"],
                ].map(([name, label]) => (
                  <TextInput
                    key={name}
                    defaultValue={String(tenant[name] || "")}
                    label={label}
                    name={name}
                    required={name === "trade_name"}
                  />
                ))}
              </div>

              {[
                [
                  "entrepreneur_name",
                  isVendorTenant
                    ? "Nome do Sócio Empreendedor"
                    : "Nome do Responsável",
                ],
                ["entrepreneur_email", "E-mail do Sócio", "email"],
                ["entrepreneur_phone", "WhatsApp do Sócio"],
                ["contact_email", "E-mail Comercial", "email"],
                ["contact_phone", "Telefone Comercial"],
                ["city", "Cidade Sede"],
                ["state", "Estado (UF)"],
              ].map(([name, label, type]) => (
                <TextInput
                  key={name}
                  defaultValue={String(tenant[name] || "")}
                  label={label}
                  name={name}
                  type={type || "text"}
                />
              ))}
            </div>

            <div className="mt-10 space-y-6">
              {[
                ["description", "Descrição Institucional (Sobre a empresa)"],
                ["services_text", "Resumo de Serviços"],
                ["products_text", "Resumo de Produtos"],
              ].map(([name, label]) => (
                <label key={name} className="form-control w-full">
                  <span className="label-text mb-1 font-semibold text-xs uppercase tracking-wider opacity-60">
                    {label}
                  </span>
                  <textarea
                    className="textarea textarea-bordered min-h-32 w-full font-medium"
                    defaultValue={String(tenant[name] || "")}
                    name={name}
                    placeholder="Escreva aqui..."
                  />
                </label>
              ))}
            </div>
          </article>

          {isVendorTenant ? (
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-primary">
                <LucideIcon name="target" className="h-5 w-5" />
                Atuação & Benefícios
              </h2>

              <div className="space-y-8">
                <MultiCheckboxField
                  label="Cidades de atuação comercial"
                  name="city_ids[]"
                  options={asRecordArray(data.all_cities)}
                  selected={asStringSet(data.acting_cities)}
                  valueKey="id"
                  labelFor={(city) =>
                    `${String(city.nome || city.name || "-")} - ${String(city.estado || city.state || "")}`.trim()
                  }
                />

                <MultiCheckboxField
                  label="Categorias de mercado"
                  name="category_ids[]"
                  options={asRecordArray(data.all_categories)}
                  selected={asStringSet(data.acting_categories)}
                  valueKey="id"
                  labelFor={(category) => String(category.name || "-")}
                />

                <section className="space-y-6 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/20 p-3 text-primary shadow-lg">
                      <LucideIcon name="gift" className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-primary uppercase tracking-tight">
                        Cota de 2 Brindes Mensais
                      </h3>
                      <p className="text-sm text-base-content/60 font-medium leading-relaxed">
                        Estes brindes serão sorteados entre os associados do
                        ecossistema. São obrigatórios para manter o perfil
                        ativo.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextInput
                      defaultValue={monthlyGifts[0] || ""}
                      label="Descrição do Brinde 1"
                      name="monthly_gifts[]"
                      placeholder="Ex: Vale-compra de R$ 50"
                      required
                    />
                    <TextInput
                      defaultValue={monthlyGifts[1] || ""}
                      label="Descrição do Brinde 2"
                      name="monthly_gifts[]"
                      placeholder="Ex: Kit promocional exclusivo"
                      required
                    />
                  </div>
                </section>
              </div>
            </article>
          ) : null}
        </div>

        <aside className="space-y-6">
          <article className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-base-content/70 mb-6">
              Identidade Visual
            </h2>

            <div className="space-y-8">
              <ImagePicker
                defaultValue={String(tenant.logo_path || "")}
                help="Logo da empresa (Quadrada recomendada)"
                label="Logotipo"
                name="logo"
              />

              <ImagePicker
                defaultValue={String(tenant.banner_path || "")}
                help="Banner que aparece no seu perfil público"
                label="Banner da Vitrine"
                name="banner"
              />
            </div>
          </article>

          <article className="sticky top-24 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
            <h3 className="text-sm font-black uppercase tracking-widest text-base-content/70 mb-4 text-center">
              Ações de Perfil
            </h3>
            <button
              className="btn btn-primary btn-lg w-full rounded-2xl shadow-xl shadow-primary/20"
              type="submit"
            >
              <LucideIcon name="save" />
              Salvar Alterações
            </button>
            <p className="mt-4 text-[10px] text-center text-base-content/40 font-bold uppercase tracking-widest leading-relaxed">
              As alterações refletem instantaneamente na vitrine pública.
            </p>
          </article>
        </aside>
      </BackendForm>
    </main>
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
