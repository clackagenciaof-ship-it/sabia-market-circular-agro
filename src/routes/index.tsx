import { createFileRoute, Link } from "@tanstack/react-router";
import { Sprout, ShoppingBasket, Recycle, Droplets, BarChart3, Leaf } from "lucide-react";
import { LogoSABIA } from "../components/LogoSABIA";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const features = [
    { to: "/mercado", icon: ShoppingBasket, title: "Mercado Local", desc: "Catálogo de produtos frescos com filtros por categoria e produtor.", color: "text-brand-green" },
    { to: "/ultima-colheita", icon: Recycle, title: "Última Colheita", desc: "Vitrine de excedentes com desconto, preço social ou doação.", color: "text-brand-orange" },
    { to: "/agua", icon: Droplets, title: "Água Inteligente", desc: "Registro de irrigação e umidade para uso racional da água.", color: "text-brand-blue-soft" },
    { to: "/biomerenda", icon: Leaf, title: "BioMerenda", desc: "Registro de resíduos vegetais e compostagem escolar.", color: "text-brand-green" },
    { to: "/dashboard", icon: BarChart3, title: "Dashboard SABIÁ", desc: "Indicadores de impacto social, ambiental e econômico.", color: "text-brand-blue" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green-soft via-background to-accent/10" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-green mb-4 text-xs font-semibold uppercase tracking-wider">
              <Sprout className="h-4 w-4" /> MVP Agroalimentar Circular
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-green-dark leading-[1.05]">
              SABIÁ Market — agricultura, água e mercado <span className="text-primary">em um só ciclo</span>.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-xl">
              Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo. Conectamos produtores locais,
              compradores, escolas e a horta comunitária em uma plataforma simples e bonita.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/mercado" className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-md hover:bg-accent/90 transition">
                <ShoppingBasket className="h-4 w-4" /> Explorar o mercado
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition">
                <BarChart3 className="h-4 w-4" /> Ver indicadores
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <LogoSABIA size={180} showWordmark={false} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold mb-2">Quatro frentes, um só ciclo</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          O SABIÁ integra mercado local, redução de perdas, uso racional da água e reaproveitamento dos resíduos
          da merenda escolar.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, desc, color }) => (
            <Link key={to} to={to} className="group rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-soft ${color} mb-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-brand-green-dark">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-brand-green-dark text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {[
            ["5", "produtores cadastrados"],
            ["5+", "produtos no catálogo"],
            ["20 kg", "de excedentes aproveitados"],
            ["15 kg", "de resíduos compostados"],
          ].map(([k, v]) => (
            <div key={v}>
              <div className="text-4xl font-extrabold text-accent">{k}</div>
              <div className="text-sm text-white/70 mt-1">{v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
