import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout, ShoppingBasket, Recycle, Droplets, BarChart3, Leaf,
  ArrowRight, Users, GraduationCap, ShoppingBag, ShieldCheck,
} from "lucide-react";
import { LogoSABIA } from "../components/LogoSABIA";
import { pageHead } from "../lib/seo";
import { useRole, ROLE_LABEL, type Role } from "../lib/store";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "SABIÁ Market — agricultura, água e mercado em um só ciclo",
      description:
        "Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo. Conectamos produtores locais, compradores, escolas e a horta comunitária.",
    }),
  component: Home,
});

const PERFIS: { role: Role; icon: any; desc: string; tint: string }[] = [
  { role: "produtor", icon: Sprout, desc: "Cadastre produtos, gerencie estoque e acompanhe pedidos.", tint: "bg-brand-green text-white" },
  { role: "escola", icon: GraduationCap, desc: "Receba excedentes, registre compostagem e BioMerenda.", tint: "bg-brand-blue text-white" },
  { role: "comprador", icon: ShoppingBag, desc: "Pesquise produtos locais, reserve e acompanhe pedidos.", tint: "bg-accent text-accent-foreground" },
  { role: "admin", icon: ShieldCheck, desc: "Visualize impacto, produtores, escolas e o índice geral.", tint: "bg-brand-green-dark text-white" },
];

function Home() {
  const [, setRole] = useRole();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9EE] via-background to-brand-green-soft/40" />
        <div aria-hidden className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-20 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border px-3 py-1.5 text-xs font-semibold text-brand-green-dark shadow-sm">
              <Sprout className="h-3.5 w-3.5 text-brand-green" />
              MVP Agroalimentar Circular · Floriano-PI
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-blue leading-[1.05]">
              SABIÁ Market
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-brand-green">
              Agricultura, água e mercado em um só ciclo.
            </p>

            <p className="mt-5 text-base sm:text-lg text-foreground/75 max-w-xl leading-relaxed">
              <strong className="text-foreground">Produzir melhor, vender a tempo, gastar menos e devolver vida ao solo.</strong>{" "}
              Conectamos produtores locais, compradores, escolas e a horta comunitária em uma plataforma simples e dinâmica.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/mercado" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 hover:-translate-y-0.5 transition-all">
                <ShoppingBasket className="h-4 w-4" /> Explorar o mercado <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                <BarChart3 className="h-4 w-4" /> Ver indicadores
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground/70">
              <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-brand-green" /> Sustentável</span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-2"><Droplets className="h-4 w-4 text-brand-blue-soft" /> Responsável</span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-brand-blue" /> Conectado</span>
            </div>
          </div>

          {/* Logo card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-green/20 via-accent/10 to-brand-blue/20 blur-2xl" />
            <div className="relative rounded-[1.75rem] bg-white p-8 shadow-2xl border flex flex-col items-center text-center">
              <LogoSABIA size={120} showWordmark={false} />
              <h2 className="mt-4 text-2xl font-extrabold text-brand-blue">SABIÁ <span className="text-brand-green">Market</span></h2>
              <p className="mt-2 text-sm text-foreground/70 max-w-xs">
                Marketplace agroalimentar circular que fortalece o campo, a escola e o futuro.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 w-full">
                <Mini v="+120" l="Produtores" c="text-brand-green" />
                <Mini v="+2.5k" l="Pedidos" c="text-brand-orange" />
                <Mini v="+18t" l="Circulados" c="text-brand-blue" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROFILE PICKER */}
      <section className="mx-auto max-w-6xl px-4 -mt-2 sm:-mt-8 relative z-10">
        <div className="rounded-3xl border bg-white p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">Demonstração</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-brand-blue">Entrar como</h2>
            <p className="text-sm text-foreground/70 mt-1">Escolha um perfil para navegar com as funcionalidades adequadas.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERFIS.map(({ role, icon: Icon, desc, tint }) => (
              <Link
                key={role}
                to="/mercado"
                onClick={() => setRole(role)}
                className="group rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tint} mb-3 shadow`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-brand-blue">{ROLE_LABEL[role]}</h3>
                <p className="mt-1 text-xs text-foreground/70 leading-relaxed">{desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-green group-hover:gap-2 transition-all">
                  Entrar <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Frentes */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">Como funciona</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-blue">Quatro frentes, um só ciclo</h2>
          <p className="mt-3 text-foreground/70">
            O SABIÁ integra mercado local, redução de perdas, uso racional da água e reaproveitamento dos resíduos da merenda escolar.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/mercado", icon: ShoppingBasket, title: "Mercado Local", desc: "Encontre e compre de produtores da sua região com filtros por categoria, cidade e estado.", tint: "bg-brand-green-soft text-brand-green" },
            { to: "/ultima-colheita", icon: Recycle, title: "Última Colheita", desc: "Excedentes, descontos, doações e urgências da colheita.", tint: "bg-orange-50 text-brand-orange" },
            { to: "/agua", icon: Droplets, title: "Água Inteligente", desc: "Registro de irrigação e umidade dos canteiros.", tint: "bg-cyan-50 text-brand-blue-soft" },
            { to: "/biomerenda", icon: Leaf, title: "BioMerenda", desc: "Resíduos viram compostagem e nutrem a horta escolar.", tint: "bg-brand-green-soft text-brand-green" },
            { to: "/dashboard", icon: BarChart3, title: "Dashboard", desc: "Painel personalizado por perfil com indicadores em tempo real.", tint: "bg-blue-50 text-brand-blue" },
          ].map(({ to, icon: Icon, title, desc, tint }) => (
            <Link key={to} to={to} className="group rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tint} mb-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-brand-blue">{title}</h3>
              <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-green group-hover:gap-2 transition-all">
                Acessar <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Mini({ v, l, c }: { v: string; l: string; c: string }) {
  return (
    <div className="rounded-xl bg-brand-green-soft/40 p-2 text-center">
      <div className={`text-lg font-extrabold ${c}`}>{v}</div>
      <div className="text-[10px] text-foreground/60 leading-tight">{l}</div>
    </div>
  );
}
