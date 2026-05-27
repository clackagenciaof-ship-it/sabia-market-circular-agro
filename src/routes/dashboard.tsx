import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ShoppingBasket, Recycle, Droplets, Leaf, Sparkles, Users, Package, GraduationCap, Sprout, ShieldCheck, ShoppingBag } from "lucide-react";
import { useOrders, useProducts, useSurplus, useWaste, useWater, useRole, ROLE_LABEL } from "../lib/store";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead({
      path: "/dashboard",
      title: "Dashboard SABIÁ — Indicadores de Circularidade",
      description:
        "Painéis personalizados para produtores, escolas, compradores e administradores. Acompanhe pedidos, impacto e o Índice SABIÁ de Circularidade.",
    }),
  component: Dashboard,
});

type Card = { icon: any; label: string; value: string | number; color: string };

function Dashboard() {
  const [role] = useRole();
  const [products] = useProducts();
  const [orders] = useOrders();
  const [surplus] = useSurplus();
  const [water] = useWater();
  const [waste] = useWaste();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">Painel personalizado</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">Dashboard SABIÁ</h1>
          <p className="text-muted-foreground mt-1">
            Visão como <strong className="text-foreground">{ROLE_LABEL[role]}</strong>. Troque o perfil no topo para ver outros painéis.
          </p>
        </div>
      </header>

      {role === "admin" && <AdminPanel products={products} orders={orders} surplus={surplus} water={water} waste={waste} />}
      {role === "produtor" && <ProdutorPanel products={products} orders={orders} surplus={surplus} water={water} />}
      {role === "escola" && <EscolaPanel orders={orders} surplus={surplus} waste={waste} />}
      {role === "comprador" && <CompradorPanel orders={orders} />}
    </div>
  );
}

function StatGrid({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
  );
}

function AdminPanel({ products, orders, surplus, water, waste }: any) {
  const produtores = new Set(products.filter((p: any) => p.tipoAnunciante === "Produtor").map((p: any) => p.produtor)).size;
  const escolas = new Set(products.filter((p: any) => p.tipoAnunciante === "Escola").map((p: any) => p.produtor)).size;
  const compradores = new Set(orders.map((o: any) => o.comprador)).size;
  const ativos = products.filter((p: any) => p.estoque > 0).length;
  const excedenteKg = surplus.reduce((a: number, b: any) => a + b.quantidadeKg, 0);
  const aguaL = water.reduce((a: number, b: any) => a + b.litros, 0);
  const economiaAgua = Math.round(aguaL * 0.3);
  const compostadoKg = waste.filter((w: any) => w.tipo === "compostagem").reduce((a: number, b: any) => a + b.pesoKg, 0);
  const totalVendas = orders.reduce((a: number, b: any) => a + b.total, 0);

  const indice = Math.min(100, Math.round(produtores * 6 + ativos * 2 + orders.length * 4 + excedenteKg * 1.5 + compostadoKg * 2 + Math.min(economiaAgua / 5, 15)));

  const cards: Card[] = [
    { icon: Sprout, label: "Produtores", value: produtores, color: "bg-brand-green text-white" },
    { icon: GraduationCap, label: "Escolas", value: escolas, color: "bg-brand-blue text-white" },
    { icon: ShoppingBag, label: "Compradores", value: compradores, color: "bg-accent text-accent-foreground" },
    { icon: Package, label: "Produtos ativos", value: ativos, color: "bg-brand-green-dark text-white" },
    { icon: ShoppingBasket, label: "Pedidos / reservas", value: orders.length, color: "bg-brand-blue text-white" },
    { icon: Sparkles, label: "Valor movimentado", value: `R$ ${totalVendas.toFixed(2)}`, color: "bg-brand-green text-white" },
    { icon: Recycle, label: "Excedentes aproveitados", value: `${excedenteKg} kg`, color: "bg-accent text-accent-foreground" },
    { icon: Droplets, label: "Economia de água", value: `${economiaAgua} L`, color: "bg-brand-blue-soft text-white" },
    { icon: Leaf, label: "Resíduos compostados", value: `${compostadoKg.toFixed(1)} kg`, color: "bg-brand-green text-white" },
  ];

  return (
    <>
      <IndiceCard indice={indice} />
      <StatGrid cards={cards} />
      <RecentOrdersCard orders={orders} title="Últimos pedidos da plataforma" />
    </>
  );
}

function ProdutorPanel({ products, orders, surplus, water }: any) {
  const meus = products; // demo: mostra todos
  const meusUC = meus.filter((p: any) => p.ultimaColheita).length;
  const pedidosRecebidos = orders.length;
  const valor = orders.reduce((a: number, b: any) => a + b.total, 0);
  const aguaL = water.reduce((a: number, b: any) => a + b.litros, 0);

  const cards: Card[] = [
    { icon: Package, label: "Produtos cadastrados", value: meus.length, color: "bg-brand-green text-white" },
    { icon: Sparkles, label: "Produtos ativos", value: meus.filter((p: any) => p.estoque > 0).length, color: "bg-brand-blue text-white" },
    { icon: ShoppingBasket, label: "Pedidos recebidos", value: pedidosRecebidos, color: "bg-accent text-accent-foreground" },
    { icon: Recycle, label: "Em Última Colheita", value: meusUC, color: "bg-brand-orange text-white" },
    { icon: Sparkles, label: "Valor movimentado", value: `R$ ${valor.toFixed(2)}`, color: "bg-brand-green-dark text-white" },
    { icon: Droplets, label: "Água registrada", value: `${aguaL} L`, color: "bg-brand-blue-soft text-white" },
  ];

  return (
    <>
      <StatGrid cards={cards} />
      <RecentOrdersCard orders={orders} title="Pedidos dos seus produtos" />
    </>
  );
}

function EscolaPanel({ orders, surplus, waste }: any) {
  const recebidos = orders.filter((o: any) => o.comprador.toLowerCase().includes("joiza") || o.comprador.toLowerCase().includes("escola")).length || orders.length;
  const compostado = waste.filter((w: any) => w.tipo === "compostagem").reduce((a: number, b: any) => a + b.pesoKg, 0);
  const reaprov = waste.filter((w: any) => w.tipo === "reaproveitamento").reduce((a: number, b: any) => a + b.pesoKg, 0);
  const totalRes = waste.reduce((a: number, b: any) => a + b.pesoKg, 0);

  const cards: Card[] = [
    { icon: ShoppingBasket, label: "Itens recebidos", value: recebidos, color: "bg-brand-green text-white" },
    { icon: Recycle, label: "Reaproveitado (Última Colheita)", value: `${reaprov.toFixed(1)} kg`, color: "bg-brand-orange text-white" },
    { icon: Leaf, label: "Resíduos compostados", value: `${compostado.toFixed(1)} kg`, color: "bg-brand-green-dark text-white" },
    { icon: Sparkles, label: "Volume total desviado do lixo", value: `${totalRes.toFixed(1)} kg`, color: "bg-brand-blue text-white" },
  ];

  return (
    <>
      <StatGrid cards={cards} />
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="font-bold text-lg mb-3">Impacto da BioMerenda</h2>
        <p className="text-sm text-muted-foreground">
          Cada kg compostado retorna nutrientes para a horta escolar, fechando o ciclo de produção, consumo e regeneração do solo.
        </p>
      </div>
    </>
  );
}

function CompradorPanel({ orders }: any) {
  const totalGasto = orders.reduce((a: number, b: any) => a + b.total, 0);
  const totalItens = orders.reduce((a: number, b: any) => a + b.quantidade, 0);

  const cards: Card[] = [
    { icon: ShoppingBasket, label: "Pedidos realizados", value: orders.length, color: "bg-brand-green text-white" },
    { icon: Package, label: "Itens adquiridos", value: totalItens, color: "bg-brand-blue text-white" },
    { icon: Sparkles, label: "Valor total", value: `R$ ${totalGasto.toFixed(2)}`, color: "bg-accent text-accent-foreground" },
  ];

  return (
    <>
      <StatGrid cards={cards} />
      <RecentOrdersCard orders={orders} title="Histórico de compras" />
    </>
  );
}

function IndiceCard({ indice }: { indice: number }) {
  return (
    <section className="rounded-3xl border bg-gradient-to-br from-brand-green-dark via-brand-green to-primary text-white p-6 sm:p-8 mb-8 shadow-xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-accent">Índice SABIÁ de Circularidade</div>
          <div className="text-6xl font-extrabold mt-2">{indice}<span className="text-2xl text-white/70">/100</span></div>
          <p className="text-sm text-white/80 mt-2 max-w-md">
            Combinação ponderada de produtores, produtos ativos, pedidos, excedentes aproveitados, resíduos compostados e economia de água.
          </p>
        </div>
        <div className="w-full sm:w-72 h-4 rounded-full bg-white/15 overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${indice}%` }} />
        </div>
      </div>
    </section>
  );
}

function RecentOrdersCard({ orders, title }: { orders: any[]; title: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
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
  );
}
