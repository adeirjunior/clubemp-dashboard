import { ForgotPasswordPage } from "@/components/native-auth-pages";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  return <ForgotPasswordPage searchParams={searchParams} />;
}
