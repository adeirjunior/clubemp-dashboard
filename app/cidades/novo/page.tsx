import { ModuleFormPage } from "@/components/dashboard/crud-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ModuleFormPage
      action="/dashboard/central/cidades"
      backHref="/cidades"
      description="Inclua um novo município para uso nos filtros, empresas e áreas de atuação."
      fields={[
        {
          label: "Nome da cidade",
          name: "nome",
          placeholder: "Ex: Ariquemes",
          required: true,
        },
        {
          label: "UF",
          name: "estado",
          placeholder: "RO",
          required: true,
        },
        {
          help: "Gerado a partir do nome para uso visual.",
          label: "Slug previsto",
        },
        { label: "Imagem", name: "imagem_upload", type: "file" },
      ]}
      headerIcon="plus"
      headerTitle="Nova cidade"
      submitLabel="Salvar cidade"
      title="Cadastrar cidade"
    />
  );
}
