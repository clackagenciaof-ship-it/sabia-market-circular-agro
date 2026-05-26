import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, ShoppingBasket } from "lucide-react";
import { CATEGORIAS, uid, useOrders, useProducts, type Product } from "../lib/store";

export const Route = createFileRoute("/mercado")({
  component: Mercado,
});

function Mercado() {
  const [products, setProducts] = useProducts();
  const [orders, setOrders] = useOrders();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ =
        !q ||
        p.nome.toLowerCase().includes(q.toLowerCase()) ||
        p.produtor.toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "Todas" || p.categoria === cat;
      return matchQ && matchC;
    });
  }, [products, q, cat]);

  function reservar(p: Product) {
    if (p.estoque <= 0) return;
    setProducts(products.map((x) => (x.id === p.id ? { ...x, estoque: x.estoque - 1 } : x)));
    setOrders([
      {
        id: uid(),
        produtoId: p.id,
        produto: p.nome,
        produtor: p.produtor,
        quantidade: 1,
        total: p.preco,
        data: new Date().toISOString(),
      },
      ...orders,
    ]);
    setToast(`Reserva de "${p.nome}" registrada!`);
    setTimeout(() => setToast(null), 2500);
  }

  function addProduto(form: HTMLFormElement) {
    const data = new FormData(form);
    const novo: Product = {
      id: uid(),
      nome: String(data.get("nome") || ""),
      categoria: String(data.get("categoria") || CATEGORIAS[0]),
      preco: Number(data.get("preco") || 0),
      produtor: String(data.get("produtor") || ""),
      estoque: Number(data.get("estoque") || 0),
    };
    if (!novo.nome || !novo.produtor) return;
    setProducts([novo, ...products]);
    form.reset();
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Mercado Local</h1>
        <p className="text-muted-foreground">
          Produtos frescos diretamente dos produtores da região. {orders.length} reservas até agora.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produto ou produtor..."
            className="w-full pl-9 pr-3 py-2 rounded-md border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-md border bg-card px-3 py-2 text-sm"
        >
          <option>Todas</option>
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Novo produto
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProduto(e.currentTarget);
          }}
          className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 rounded-lg border bg-card p-4"
        >
          <input name="nome" placeholder="Nome do produto" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="produtor" placeholder="Produtor" className="rounded-md border px-3 py-2 text-sm" required />
          <select name="categoria" className="rounded-md border px-3 py-2 text-sm bg-background">
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input name="preco" type="number" step="0.1" min="0" placeholder="Preço (R$)" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="estoque" type="number" min="0" placeholder="Estoque" className="rounded-md border px-3 py-2 text-sm" required />
          <button className="sm:col-span-2 lg:col-span-5 rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90">
            Cadastrar produto
          </button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <article key={p.id} className="rounded-xl border bg-card p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{p.nome}</h3>
                <p className="text-xs text-muted-foreground">{p.produtor}</p>
              </div>
              <span className="text-xs rounded-full bg-secondary px-2 py-0.5">{p.categoria}</span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">R$ {p.preco.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Estoque: {p.estoque}</div>
              </div>
              <button
                disabled={p.estoque <= 0}
                onClick={() => reservar(p)}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBasket className="h-3.5 w-3.5" /> Reservar
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">Nenhum produto encontrado.</p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
