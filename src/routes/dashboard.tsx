import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShoppingBasket, Recycle, Droplets, Leaf, Sparkles, Users, Package } from "lucide-react";
import { useOrders, useProducts, useSurplus, useWaste, useWater } from "../lib/store";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [products] = useProducts();
  const [orders] = useOrders();
  const [surplus] = useSurplus();
  const [water] = useWater();
  const [waste] = useWaste();

  const produtores = new Set(products.map((p) => p.produtor)).size;
  const ativosNo = products.filter((p) => p.estoque > 0).length;
  const excedenteKg = surplus.reduce((a, b) => a + b.quantidadeKg, 0);
  const aguaL = water.reduce((a, b) => a + b.litros, 0);
  const economiaAgua = Math.round(aguaL * 0.3); // 30% economia estimada vs irrigação convencional
  const compostadoKg = waste.filter((w) => w.tipo === "compostagem").reduce((a, b) => a + b.pesoKg, 0);
  const totalVendas = orders.reduce((a, b) => a + b.total, 0);

  const indice = Math.min(
    100,
    Math.round(
      produtores * 4 +
        ativosNo * 2 +
        orders.length * 4 +
        excedenteKg * 1.5 +
        compostadoKg * 2 +
        Math.min(economiaAgua / 5, 15),
    ),
  );

  const cards = [
    { icon: Users, label: "Produtores cadastrados", value: produtores, color: "bg-brand-green text-white" },
    { icon: Package, label: "Produtos ativos", value: ativosNo, color: "bg-brand-blue text-white" },
    { icon: ShoppingBasket, label: "Pedidos / reservas", value: orders.length, color: "bg-accent text-accent-foreground" },
    { icon: Sparkles, label: "Valor movimentado", value: `R$ ${totalVendas.toFixed(2)}`, color: "bg-brand-green-dark text-white" },
    { icon: Recycle, label: "Excedentes aproveitados", value: `${excedenteKg} kg`, color: "bg-accent text-accent-foreground" },
    { icon: Droplets, label: "Economia de água", value: `${economiaAgua} L`, color: "bg-brand-blue-soft text-white" },
    { icon: Leaf, label: "Resíduos compostados", value: `${compostadoKg.toFixed(1)} kg`, color: "bg-brand-green text-white" },
    { icon: BarChart3, label: "Água registrada", value: `${aguaL} L`, color: "bg-brand-blue text-white" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Dashboard SABIÁ</h1>
        <p className="text-muted-foreground mt-1">
          Indicadores sociais, ambientais e econômicos do ciclo agroalimentar.
        </p>
      </header>

      <section className="rounded-3xl border bg-gradient-to-br from-brand-green-dark via-brand-green to-primary text-white p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-accent">
              Índice SABIÁ de Circularidade
            </div>
            <div className="text-6xl font-extrabold mt-2">{indice}<span className="text-2xl text-white/70">/100</span></div>
            <p className="text-sm text-white/80 mt-2 max-w-md">
              Combinação ponderada de produtores, produtos ativos, pedidos, excedentes aproveitados, resíduos
              compostados e economia de água.
            </p>
          </div>
          <div className="w-full sm:w-72 h-4 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full bg-accent transition-all" style={{ width: `${indice}%` }} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground font-medium">{label}</div>
            <div className="text-2xl font-extrabold mt-1">{value}</div>
          </div>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Últimos pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido registrado ainda.</p>
          ) : (
            <ul className="divide-y text-sm">
              {orders.slice(0, 8).map((o) => (
                <li key={o.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{o.comprador} · {o.quantidade}× {o.produto}</div>
                    <div className="text-xs text-muted-foreground truncate">{o.produtor}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-primary">R$ {o.total.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.data).toLocaleDateString("pt-BR")}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-bold text-lg mb-3">Metas de validação</h2>
          <ul className="space-y-3 text-sm">
            <Meta atual={products.length} alvo={30} label="Produtos cadastrados" />
            <Meta atual={orders.length} alvo={20} label="Pedidos / reservas" />
            <Meta atual={excedenteKg} alvo={20} label="kg de excedentes aproveitados" />
            <Meta atual={compostadoKg} alvo={15} label="kg de resíduos compostados" />
            <Meta atual={economiaAgua} alvo={50} label="litros de água economizada" />
          </ul>
        </div>
      </section>
    </div>
  );
}

function Meta({ atual, alvo, label }: { atual: number; alvo: number; label: string }) {
  const pct = Math.min(100, Math.round((atual / alvo) * 100));
  return (
    <li>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{atual} / {alvo}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}
