export default function NotFound() {
  return (
    <main className="clubemp-auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-base-300 bg-base-100/95 p-8 shadow-2xl backdrop-blur">
        <p className="badge badge-outline">404</p>
        <h1 className="mt-4 text-3xl font-black">Página não encontrada</h1>
        <p className="mt-3 text-sm text-base-content/70">
          A rota solicitada não existe no dashboard migrado.
        </p>
        <a className="btn btn-primary mt-6" href="/login">
          Voltar ao login
        </a>
      </section>
    </main>
  );
}
