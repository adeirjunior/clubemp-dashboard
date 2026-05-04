import { renderLegacyPage } from "@/lib/render-legacy-page";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { token } = await params;
  return renderLegacyPage(`/convite/empreendedor/${token}`, await searchParams);
}
