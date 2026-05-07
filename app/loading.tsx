export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">
      <section className="rounded-3xl border border-base-300 bg-base-100 p-6 text-center shadow-sm">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-4 text-sm font-semibold text-base-content/70">
          Carregando painel Clubemp...
        </p>
      </section>
    </div>
  );
}
