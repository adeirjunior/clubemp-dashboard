import { renderLegacyPage } from "@/lib/render-legacy-page";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  return renderLegacyPage("/central/categorias/editar", await searchParams);
}
