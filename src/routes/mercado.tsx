import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Search, Plus, ShoppingBasket, ImageIcon, Upload } from "lucide-react";
import { CATEGORIAS, uid, useOrders, useProducts, type Product } from "../lib/store";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/mercado")({
  head: () =>
    pageHead({
      path: "/mercado",
      title: "Mercado Local — SABIÁ Market",
      description:
        "Catálogo de produtos frescos de produtores locais de Floriano-PI: verduras, legumes, frutas, temperos e raízes. Reserve direto do produtor.",
    }),
  component: Mercado,
});

function Mercado() {
  const [products, setProducts] = useProducts();
  const [orders, setOrders] = useOrders();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [showForm, setShowForm] = useState(false);
  const [reserveFor, setReserveFor] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ =
        !q || p.nome.toLowerCase().includes(q.toLowerCase()) || p.produtor.toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "Todas" || p.categoria === cat;
      return matchQ && matchC;
    });
  }, [products, q, cat]);

  function confirmarReserva(p: Product, comprador: string, qty: number) {
    if (qty <= 0 || qty > p.estoque) return;
    setProducts(products.map((x) => (x.id === p.id ? { ...x, estoque: x.estoque - qty } : x)));
    setOrders([
      {
        id: uid(),
        produtoId: p.id,
        produto: p.nome,
        produtor: p.produtor,
        comprador,
        quantidade: qty,
        total: p.preco * qty,
        data: new Date().toISOString(),
      },
      ...orders,
    ]);
    setToast(`Reserva de ${qty} ${p.unidade} de "${p.nome}" confirmada para ${comprador}!`);
    setReserveFor(null);
    setTimeout(() => setToast(null), 3000);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(String(reader.result || ""));
    reader.readAsDataURL(f);
  }

  function addProduto(form: HTMLFormElement) {
    const data = new FormData(form);
    const urlFoto = String(data.get("fotoUrl") || "").trim();
    const novo: Product = {
      id: uid(),
      nome: String(data.get("nome") || ""),
      categoria: String(data.get("categoria") || CATEGORIAS[0]),
      preco: Number(data.get("preco") || 0),
      unidade: String(data.get("unidade") || "unidade"),
      produtor: String(data.get("produtor") || ""),
      estoque: Number(data.get("estoque") || 0),
      foto: fotoPreview || urlFoto || undefined,
    };
    if (!novo.nome || !novo.produtor) return;
    setProducts([novo, ...products]);
    form.reset();
    setFotoPreview("");
    setShowForm(false);
    setToast(`Produto "${novo.nome}" cadastrado!`);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Mercado Local</h1>
        <p className="text-muted-foreground mt-1">
          Produtos frescos diretamente dos produtores da região · <strong>{orders.length}</strong> reservas registradas.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar produto ou produtor"
            placeholder="Buscar produto ou produtor..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria" className="rounded-lg border bg-white px-3 py-2.5 text-sm">
          <option>Todas</option>
          {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow hover:bg-accent/90"
        >
          <Plus className="h-4 w-4" /> Cadastrar produto
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => { e.preventDefault(); addProduto(e.currentTarget); }}
          className="mb-8 rounded-2xl border bg-card p-5 shadow-sm"
        >
          <h2 className="font-bold text-lg mb-4">Novo produto</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input name="nome" aria-label="Nome do produto" placeholder="Nome do produto" className="rounded-md border px-3 py-2 text-sm" required />
            <input name="produtor" aria-label="Produtor" placeholder="Produtor" className="rounded-md border px-3 py-2 text-sm" required />
            <select name="categoria" aria-label="Categoria" className="rounded-md border px-3 py-2 text-sm bg-white">
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input name="preco" aria-label="Preço" type="number" step="0.1" min="0" placeholder="Preço (R$)" className="rounded-md border px-3 py-2 text-sm" required />
            <select name="unidade" aria-label="Unidade de medida" className="rounded-md border px-3 py-2 text-sm bg-white">
              <option value="unidade">por unidade</option>
              <option value="kg">por kg</option>
              <option value="maço">por maço</option>
              <option value="dúzia">por dúzia</option>
              <option value="L">por litro</option>
            </select>
            <input name="estoque" aria-label="Quantidade em estoque" type="number" min="0" placeholder="Quantidade disponível" className="rounded-md border px-3 py-2 text-sm" required />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr] items-center">
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
                {fotoPreview ? (
                  <img src={fotoPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:bg-secondary">
                <Upload className="h-4 w-4" /> Enviar foto
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
            <input
              name="fotoUrl"
              placeholder="Ou cole uma URL de imagem (https://...)"
              className="rounded-md border px-3 py-2 text-sm sm:col-span-2"
              onChange={(e) => { if (!fotoPreview && e.target.value) setFotoPreview(""); }}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button className="rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-primary/90">
              Cadastrar produto
            </button>
            <button type="button" onClick={() => { setShowForm(false); setFotoPreview(""); }} className="rounded-lg border bg-white px-4 py-2.5 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <h2 className="text-xl font-bold mb-4">Produtos disponíveis</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} onReserve={() => setReserveFor(p)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">Nenhum produto encontrado.</p>
        )}
      </div>

      {reserveFor && (
        <ReserveModal product={reserveFor} onClose={() => setReserveFor(null)} onConfirm={confirmarReserva} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 left-6 sm:left-auto rounded-lg bg-brand-green-dark text-white px-4 py-3 text-sm shadow-2xl max-w-md">
          {toast}
        </div>
      )}
    </div>
  );
}

function ProductCard({ p, onReserve }: { p: import("../lib/store").Product; onReserve: () => void }) {
  return (
    <article className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <div className="aspect-[4/3] bg-brand-green-soft relative overflow-hidden">
        {p.foto ? (
          <img src={p.foto} alt={p.nome} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-brand-green">
            <ImageIcon className="h-12 w-12 opacity-40" />
          </div>
        )}
        <span className="absolute top-2 right-2 text-[11px] font-semibold rounded-full bg-white/95 text-brand-green-dark px-2.5 py-1 shadow">
          {p.categoria}
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base leading-tight">{p.nome}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">por {p.produtor}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-xl font-extrabold text-primary">
              R$ {p.preco.toFixed(2)}
              <span className="text-xs font-medium text-muted-foreground"> /{p.unidade}</span>
            </div>
            <div className="text-xs text-muted-foreground">Disponível: {p.estoque} {p.unidade}</div>
          </div>
          <button
            disabled={p.estoque <= 0}
            onClick={onReserve}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed shadow"
          >
            <ShoppingBasket className="h-3.5 w-3.5" /> Reservar
          </button>
        </div>
      </div>
    </article>
  );
}

function ReserveModal({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (p: Product, comprador: string, qty: number) => void;
}) {
  const [comprador, setComprador] = useState("");
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-1">Reservar {product.nome}</h3>
        <p className="text-sm text-muted-foreground mb-4">{product.produtor} · R$ {product.preco.toFixed(2)}/{product.unidade}</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (comprador.trim()) onConfirm(product, comprador.trim(), qty); }}
          className="space-y-3"
        >
          <div>
            <label htmlFor="comprador" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do comprador</label>
            <input
              id="comprador"
              value={comprador}
              onChange={(e) => setComprador(e.target.value)}
              placeholder="Ex: Ana Clara"
              className="mt-1 w-full rounded-md border px-3 py-2.5 text-sm"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="quantidade" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Quantidade ({product.unidade})
            </label>
            <input
              id="quantidade"
              type="number"
              min={1}
              max={product.estoque}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.estoque, Number(e.target.value))))}
              className="mt-1 w-full rounded-md border px-3 py-2.5 text-sm"
            />
          </div>
          <div className="rounded-lg bg-brand-green-soft p-3 text-sm">
            Total: <strong className="text-primary">R$ {(product.preco * qty).toFixed(2)}</strong>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border bg-white py-2.5 text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-lg bg-accent text-accent-foreground py-2.5 text-sm font-semibold shadow hover:bg-accent/90">
              Confirmar reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
