import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sprout,
  ShoppingBasket,
  Recycle,
  Droplets,
  BarChart3,
  Leaf,
  ArrowRight,
  Users,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { LogoSABIA } from "../components/LogoSABIA";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      path: "/",
      title: "SABIÁ Market — Marketplace agroalimentar circular",
      description:
        "Conecta produtores locais, compradores e impacto sustentável. Mercado local, última colheita, água inteligente e BioMerenda em um só ciclo.",
    }),
  component: Home,
});

function Home() {
  const features = [
    {
      to: "/mercado",
      icon: ShoppingBasket,
      title: "Mercado Local",
      desc: "Encontre e compre de produtores da sua região com filtros por categoria e produtor.",
      tint: "bg-brand-green-soft text-brand-green",
    },
    {
      to: "/ultima-colheita",
      icon: Recycle,
      title: "Última Colheita",
      desc: "Produtos frescos e sazonais direto do produtor, com desconto, preço social ou doação.",
      tint: "bg-orange-50 text-brand-orange",
    },
    {
      to: "/dashboard",
      icon: BarChart3,
      title: "Dashboard",
      desc: "Acompanhe pedidos, impacto e métricas de circularidade em tempo real.",
      tint: "bg-blue-50 text-brand-blue",
    },
    {
      to: "/agua",
      icon: Droplets,
      title: "Água Inteligente",
      desc: "Registro de irrigação e umidade dos canteiros para uso racional da água.",
      tint: "bg-cyan-50 text-brand-blue-soft",
    },
    {
      to: "/biomerenda",
      icon: Leaf,
      title: "BioMerenda",
      desc: "Resíduos da merenda escolar viram compostagem e nutrem o solo da horta.",
      tint: "bg-brand-green-soft text-brand-green",
    },
  ];

  const impacto = [
    { v: "+120", l: "Produtores conectados", icon: Users, color: "text-brand-green" },
    { v: "+2.500", l: "Pedidos realizados", icon: ShoppingBasket, color: "text-brand-orange" },
    { v: "+18t", l: "Alimentos circulados", icon: Leaf, color: "text-brand-green" },
    { v: "+9.000L", l: "Água economizada", icon: Droplets, color: "text-brand-blue-soft" },
  ];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9EE] via-background to-brand-green-soft/40" />
        <div
          aria-hidden
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border px-3 py-1.5 text-xs font-semibold text-brand-green-dark shadow-sm">
              <Sprout className="h-3.5 w-3.5 text-brand-green" />
              MVP Agroalimentar Circular · Floriano-PI
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-blue leading-[1.05]">
              SABIÁ Market
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-brand-green">
              Marketplace agroalimentar circular
            </p>

            <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-xl leading-relaxed">
              Conecta <strong className="text-foreground">produtores locais</strong>,{" "}
              <strong className="text-foreground">compradores</strong> e{" "}
              <strong className="text-foreground">impacto sustentável</strong>. Produzir melhor, vender a tempo,
              gastar menos e devolver vida ao solo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/mercado"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 hover:-translate-y-0.5 transition-all"
              >
                <ShoppingBasket className="h-4 w-4" /> Explorar o mercado
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
              >
                <BarChart3 className="h-4 w-4" /> Ver indicadores
              </Link>
            </div>

            {/* trust badges */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground/70">
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-4 w-4 text-brand-green" /> Sustentável
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-2">
                <Droplets className="h-4 w-4 text-brand-blue-soft" /> Responsável
              </span>
              <span className="h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-blue" /> Conectado
              </span>
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-green/20 via-accent/10 to-brand-blue/20 blur-2xl" />
            <div className="relative rounded-[1.75rem] bg-white p-7 sm:p-9 shadow-2xl border">
              <div className="flex items-center justify-between mb-5">
                <LogoSABIA size={48} showWordmark={false} />
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-green bg-brand-green-soft px-2 py-1 rounded-full">
                  Bem-vindo(a)
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-dark text-white p-5 shadow-md">
                <p className="text-xs uppercase tracking-wider font-semibold text-white/80">
                  Olá, agricultura viva 👋
                </p>
                <h2 className="mt-1 text-xl font-bold leading-snug">
                  Conecte-se, compre local e gere impacto positivo.
                </h2>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { icon: ShoppingBasket, label: "Mercado", to: "/mercado", color: "bg-brand-green" },
                  { icon: Recycle, label: "Colheita", to: "/ultima-colheita", color: "bg-brand-orange" },
                  { icon: BarChart3, label: "Painel", to: "/dashboard", color: "bg-brand-blue" },
                ].map(({ icon: Icon, label, to, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex flex-col items-center gap-2 rounded-xl border bg-white p-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${color} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-semibold text-foreground/80">{label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-xl border bg-brand-green-soft/40 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green-dark">
                  Impacto que transforma
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-extrabold text-brand-green">+120</div>
                    <div className="text-[10px] text-foreground/60 leading-tight">Produtores</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-brand-orange">+2.5k</div>
                    <div className="text-[10px] text-foreground/60 leading-tight">Pedidos</div>
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-brand-blue">+18t</div>
                    <div className="text-[10px] text-foreground/60 leading-tight">Circulados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Quick access cards (3 highlights like image) ===== */}
      <section className="mx-auto max-w-6xl px-4 -mt-2 sm:-mt-6 relative z-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.slice(0, 3).map(({ to, icon: Icon, title, desc, tint }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border bg-white p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${tint} mb-3`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-brand-blue">{title}</h3>
                <Leaf className="h-4 w-4 text-brand-green opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Frentes (all 5) ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">Como funciona</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-blue">
            Quatro frentes, um só ciclo
          </h2>
          <p className="mt-3 text-foreground/70">
            O SABIÁ integra mercado local, redução de perdas, uso racional da água e reaproveitamento
            dos resíduos da merenda escolar — fechando o ciclo entre produzir, vender e devolver vida ao solo.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, desc, tint }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
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

      {/* ===== Por que SABIÁ ===== */}
      <section className="bg-gradient-to-br from-brand-green-soft/40 via-background to-orange-50/40 border-y">
        <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-green">Por que SABIÁ</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-blue">
              Tecnologia que fortalece o campo e o futuro
            </h2>
            <p className="mt-3 text-foreground/70 leading-relaxed">
              Mais do que um marketplace, o SABIÁ Market é uma plataforma agroalimentar circular que une produção,
              consumo consciente e regeneração do solo.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Reduz desperdícios com a Última Colheita",
                "Economiza água com registro inteligente de irrigação",
                "Transforma resíduos da merenda em adubo na horta escolar",
                "Mostra o impacto real com o Índice SABIÁ de Circularidade",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {impacto.map(({ v, l, icon: Icon, color }) => (
              <div
                key={l}
                className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon className={`h-7 w-7 ${color}`} />
                <div className="mt-3 text-3xl font-extrabold text-brand-blue">{v}</div>
                <div className="text-xs text-foreground/60 mt-1 leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-brand-green-dark text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <Heart className="h-8 w-8 text-accent mx-auto" />
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold">
            Pronto para fazer parte do ciclo?
          </h2>
          <p className="mt-3 text-white/80 max-w-2xl mx-auto">
            Explore o mercado, descubra excedentes da última colheita e acompanhe o impacto da sua comunidade
            em tempo real.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/mercado"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg hover:bg-accent/90 transition"
            >
              Começar pelo mercado <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/ultima-colheita"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              Ver Última Colheita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
