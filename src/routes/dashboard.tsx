import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShoppingBasket, Recycle, Droplets, Leaf, Sparkles } from "lucide-react";
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

  const ativosNo = products.filter((p) => p.estoque > 0).length;
  const excedenteKg = surplus.reduce((a, b) => a + b.quantidadeKg, 0);
  const aguaL = water.reduce((a, b) => a + b.litros, 0);
  const compostadoKg = waste.filter((w) => w.tipo === "compostagem").reduce((a, b) => a + b.pesoKg, 0);
  const totalVendas = orders.reduce((a, b) => a + b.total, 0);

  // Índice SABIÁ de Circularidade (heurística simples 0-100)
  const indice = Math.min(
    100,
    Math.round(
      ativosNo * 2 +
        orders.length * 3 +
        excedenteKg * 2 +
        compostadoKg * 3 +
        Math.min(aguaL / 10, 20),
    ),
  );

  const cards = [
    { icon: ShoppingBasket, label: "Produtos ativos", value: ativosNo, color: "text-primary" },
    { icon: BarChart3, label: "Pedidos / reservas", value: orders.length, color: "text-chart-2" },
    { icon: Recycle, label: "Excedentes aproveitados", value: `${excedenteKg} kg`, color: "text-chart-4" },
    { icon: Droplets, label: "Água registrada", value: `${aguaL} L`, color: "text-chart-3" },
    { icon: Leaf, label: "Resíduos compostados", value: `${compostadoKg.toFixed(1)} kg`, color: "text-primary" },
    { icon: Sparkles, label: "Receita estimada", value: `R$ ${totalVendas.toFixed(2)}`, color: "text-chart-5" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard SABIÁ</h1>
        <p className="text-muted-foreground">
          Indicadores sociais, ambientais e econômicos do ciclo agroalimentar.
        </p>
      </header>

      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-medium text-primary uppercase tracking-wider">
              Índice SABIÁ de Circularidade
            </div>
            <div className="text-5xl font-bold mt-2">{indice}<span className="text-2xl text-muted-foreground">/100</span></div>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Combinação ponderada de produtos ativos, pedidos, excedentes aproveitados, resíduos compostados e
              uso d'água monitorado.
            </p>
          </div>
          <div className="w-full sm:w-64 h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${indice}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl border bg-card p-5">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold mt-1">{value}</div>
          </div>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Últimos pedidos</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum pedido registrado ainda.</p>
          ) : (
            <ul className="divide-y text-sm">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{o.produto}</div>
                    <div className="text-xs text-muted-foreground">{o.produtor}</div>
                  </div>
                  <div className="text-right">
                    <div>R$ {o.total.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold mb-3">Metas de validação</h2>
          <ul className="space-y-3 text-sm">
            <Meta atual={products.length} alvo={30} label="Produtos cadastrados" />
            <Meta atual={orders.length} alvo={20} label="Pedidos / reservas" />
            <Meta atual={excedenteKg} alvo={20} label="kg de excedentes aproveitados" />
            <Meta atual={compostadoKg} alvo={15} label="kg de resíduos compostados" />
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
        <span>{label}</span>
        <span className="text-muted-foreground">
          {atual} / {alvo}
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </li>
  );
}
