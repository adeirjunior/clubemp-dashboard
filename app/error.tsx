"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <section className="max-w-lg rounded-3xl border border-error/30 bg-base-100 p-6 shadow-sm">
        <p className="badge badge-error badge-outline">Erro</p>
        <h1 className="mt-4 text-2xl font-black">
          Não foi possível carregar esta área
        </h1>
        <p className="mt-2 text-sm text-base-content/70">
          {error.message || "Tente novamente em instantes."}
        </p>
        <button className="btn btn-primary mt-6" onClick={reset} type="button">
          Tentar novamente
        </button>
      </section>
    </main>
  );
}
