import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ShoppingBasket, Recycle, Droplets, BarChart3, Leaf } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const features = [
    {
      to: "/mercado",
      icon: ShoppingBasket,
      title: "Mercado Local",
      desc: "Catálogo de produtos frescos com filtros por categoria e produtor.",
    },
    {
      to: "/ultima-colheita",
      icon: Recycle,
      title: "Última Colheita",
      desc: "Vitrine de excedentes com desconto, preço social ou doação.",
    },
    {
      to: "/agua",
      icon: Droplets,
      title: "Água Inteligente",
      desc: "Registro de irrigação e umidade para uso racional da água.",
    },
    {
      to: "/biomerenda",
      icon: Leaf,
      title: "BioMerenda",
      desc: "Registro de resíduos vegetais e compostagem escolar.",
    },
    {
      to: "/dashboard",
      icon: BarChart3,
      title: "Dashboard SABIÁ",
      desc: "Indicadores de impacto social, ambiental e econômico.",
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sprout className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">MVP Agroalimentar Circular</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl">
            SABIÁ Market — Sistema Agroalimentar Biointeligente de Água, Alimentos, Adubo e Mercado Local
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo. Uma plataforma que conecta
            produtores locais, compradores, escolas e a horta comunitária.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/mercado"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingBasket className="h-4 w-4" /> Explorar o mercado
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent/40 transition-colors"
            >
              <BarChart3 className="h-4 w-4" /> Ver indicadores
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-2">Quatro frentes, um só ciclo</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          O SABIÁ integra mercado local, redução de perdas, uso racional da água e reaproveitamento dos resíduos
          da merenda escolar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 border-y">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[
            ["5", "produtores cadastrados"],
            ["30", "produtos no catálogo"],
            ["20 kg", "de excedentes aproveitados"],
            ["15 kg", "de resíduos compostados"],
          ].map(([k, v]) => (
            <div key={v}>
              <div className="text-3xl font-bold text-primary">{k}</div>
              <div className="text-sm text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
