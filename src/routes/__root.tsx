import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import appCss from "../styles.css?url";
import { LogoSABIA } from "../components/LogoSABIA";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Esta página não carregou</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a href="/" className="rounded-md border bg-background px-4 py-2 text-sm">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SABIÁ Market - Sistema Agroalimentar Biointeligente" },
      { name: "description", content: "Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo. Plataforma agroalimentar circular." },
      { property: "og:title", content: "SABIÁ Market" },
      { property: "og:description", content: "Mercado local, última colheita, água inteligente e BioMerenda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

const navItems = [
  { to: "/", label: "Início" },
  { to: "/mercado", label: "Mercado Local" },
  { to: "/ultima-colheita", label: "Última Colheita" },
  { to: "/agua", label: "Água Inteligente" },
  { to: "/biomerenda", label: "BioMerenda" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [open, setOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4">
            <Link to="/" onClick={() => setOpen(false)} className="shrink-0 flex items-center">
              <LogoSABIA className="h-10 sm:h-12 lg:h-14" size={undefined as unknown as number} />
            </Link>
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="rounded-md px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-brand-green-soft transition-colors [&.active]:bg-primary [&.active]:text-primary-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white text-foreground"
              aria-label="Abrir menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {open && (
            <nav className="lg:hidden border-t bg-white px-4 py-3 flex flex-col gap-1 text-sm font-medium">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  className="rounded-md px-3 py-2.5 text-foreground/80 hover:bg-brand-green-soft [&.active]:bg-primary [&.active]:text-primary-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </header>
        <main className="flex-1"><Outlet /></main>
        <footer className="border-t mt-12 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© SABIÁ Market — Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo.</p>
            <p>U. E. Osvaldo da Costa e Silva · Floriano-PI · 10ª GRE</p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}
