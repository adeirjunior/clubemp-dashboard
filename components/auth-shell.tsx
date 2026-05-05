import env from "@/app/env";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="clubemp-auth-shell min-h-screen bg-base-200">
      <header className="border-b border-base-300 bg-base-100/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <a
            className="text-sm font-black tracking-wide text-base-content"
            href={env.MARKETING_APP_URL}
          >
            CLUBEMP
          </a>
          <a
            className="link link-hover text-xs text-base-content/70"
            href={env.MARKETING_APP_URL}
          >
            Voltar ao site
          </a>
        </div>
      </header>
      {children}
      <footer className="border-t border-base-300 bg-base-100">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-base-content/65 sm:px-8">
          Clubemp - acesso seguro para contas internas, empresas e clientes.
        </div>
      </footer>
    </div>
  );
}
