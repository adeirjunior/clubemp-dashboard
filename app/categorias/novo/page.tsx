import { ModuleFormPage } from "@/components/dashboard/crud-pages";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <ModuleFormPage
      action="/dashboard/central/categorias"
      backHref="/categorias"
      description="Estruture uma nova categoria para uso em empresas, TV Clubemp ou fluxos internos."
      fields={[
        { label: "Nome", name: "name", required: true },
        { label: "Slug previsto" },
        {
          label: "Ícone",
          name: "icon",
          placeholder: "Ex: badge-percent",
        },
        {
          label: "Status",
          name: "status",
          options: { active: "Ativa", inactive: "Inativa" },
          type: "select",
          value: "active",
        },
        {
          help: "Valores sugeridos: 1,8; 2,0; 4,99; 10; 15; 20; 30.",
          label: "Comissão CAC (%)",
          name: "cac_commission_percent",
        },
        {
          label: "Descrição curta",
          name: "description",
          span: "full",
          type: "textarea",
        },
        {
          label: "Imagem",
          name: "image_upload",
          span: "full",
          type: "file",
        },
      ]}
      headerIcon="plus"
      headerTitle="Nova categoria"
      submitLabel="Salvar categoria"
      title="Cadastrar categoria"
    />
  );
}
