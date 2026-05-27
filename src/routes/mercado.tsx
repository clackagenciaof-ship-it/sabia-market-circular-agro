import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Search, Plus, ShoppingBasket, ImageIcon, Upload, MapPin, Store, Sparkles } from "lucide-react";
import {
  CATEGORIAS, TIPOS_ANUNCIANTE, uid, useOrders, useProducts, useRole,
  type Product, type TipoAnunciante, type DisponibilidadeEspecial,
} from "../lib/store";
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

const ESPECIAL_LABEL: Record<DisponibilidadeEspecial, { label: string; cls: string }> = {
  normal: { label: "Disponível", cls: "bg-secondary text-foreground" },
  excedente: { label: "Excedente", cls: "bg-accent text-accent-foreground" },
  desconto: { label: "Desconto", cls: "bg-brand-orange text-white" },
  doacao: { label: "Doação", cls: "bg-brand-green text-white" },
  urgente: { label: "Urgente", cls: "bg-destructive text-white" },
};

function Mercado() {
  const [role] = useRole();
  const [products, setProducts] = useProducts();
  const [orders, setOrders] = useOrders();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Todas");
  const [cidade, setCidade] = useState<string>("Todas");
  const [estado, setEstado] = useState<string>("Todos");
  const [tipoAnun, setTipoAnun] = useState<string>("Todos");
  const [especial, setEspecial] = useState<string>("Todas");
  const [onlyUC, setOnlyUC] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reserveFor, setReserveFor] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const cidades = useMemo(() => Array.from(new Set(products.map((p) => p.cidade))).sort(), [products]);
  const estados = useMemo(() => Array.from(new Set(products.map((p) => p.estado))).sort(), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const ql = q.toLowerCase();
      const matchQ = !q || p.nome.toLowerCase().includes(ql) || p.produtor.toLowerCase().includes(ql);
      const matchC = cat === "Todas" || p.categoria === cat;
      const matchCi = cidade === "Todas" || p.cidade === cidade;
      const matchEst = estado === "Todos" || p.estado === estado;
      const matchTa = tipoAnun === "Todos" || p.tipoAnunciante === tipoAnun;
      const matchEsp = especial === "Todas" || (p.disponibilidadeEspecial ?? "normal") === especial;
      const matchUC = !onlyUC || p.ultimaColheita;
      return matchQ && matchC && matchCi && matchEst && matchTa && matchEsp && matchUC;
    });
  }, [products, q, cat, cidade, estado, tipoAnun, especial, onlyUC]);

  const canManage = role === "produtor" || role === "escola" || role === "admin";

  function confirmarReserva(p: Product, comprador: string, qty: number) {
    if (qty <= 0 || qty > p.estoque) return;
    setProducts(products.map((x) => (x.id === p.id ? { ...x, estoque: x.estoque - qty } : x)));
    setOrders([
      {
        id: uid(), produtoId: p.id, produto: p.nome, produtor: p.produtor,
        comprador, quantidade: qty, total: p.preco * qty, data: new Date().toISOString(),
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
      tipoAnunciante: (String(data.get("tipoAnunciante")) as TipoAnunciante) || "Produtor",
      estoque: Number(data.get("estoque") || 0),
      cidade: String(data.get("cidade") || ""),
      estado: String(data.get("estado") || "PI"),
      localComercializacao: String(data.get("localComercializacao") || ""),
      pontoEntrega: String(data.get("pontoEntrega") || "") || undefined,
      ultimaColheita: data.get("ultimaColheita") === "on",
      disponibilidadeEspecial: (data.get("especial") as DisponibilidadeEspecial) || "normal",
      descricao: String(data.get("descricao") || "") || undefined,
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

      <div className="flex flex-col gap-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Buscar produto, produtor, escola ou instituição"
              placeholder="Buscar produto, produtor, escola ou instituição..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {canManage && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow hover:bg-accent/90"
            >
              <Plus className="h-4 w-4" /> Cadastrar produto
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria" className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>Todas</option>
            {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={cidade} onChange={(e) => setCidade(e.target.value)} aria-label="Filtrar por cidade" className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>Todas</option>
            {cidades.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Filtrar por estado" className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>Todos</option>
            {estados.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={tipoAnun} onChange={(e) => setTipoAnun(e.target.value)} aria-label="Tipo de anunciante" className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>Todos</option>
            {TIPOS_ANUNCIANTE.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={especial} onChange={(e) => setEspecial(e.target.value)} aria-label="Disponibilidade especial" className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option>Todas</option>
            <option value="normal">Normal</option>
            <option value="excedente">Excedente</option>
            <option value="desconto">Desconto</option>
            <option value="doacao">Doação</option>
            <option value="urgente">Urgente</option>
          </select>
          <label className="inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm cursor-pointer">
            <input type="checkbox" checked={onlyUC} onChange={(e) => setOnlyUC(e.target.checked)} />
            <span className="font-medium">Última Colheita</span>
          </label>
        </div>
      </div>

      {showForm && canManage && (
        <form
          onSubmit={(e) => { e.preventDefault(); addProduto(e.currentTarget); }}
          className="mb-8 mt-4 rounded-2xl border bg-card p-5 shadow-sm"
        >
          <h2 className="font-bold text-lg mb-4">Novo produto</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input name="nome" aria-label="Nome do produto" placeholder="Nome do produto" className="rounded-md border px-3 py-2 text-sm" required />
            <input name="produtor" aria-label="Nome do produtor ou instituição" placeholder="Nome do produtor / instituição" className="rounded-md border px-3 py-2 text-sm" required />
            <select name="tipoAnunciante" aria-label="Tipo de anunciante" className="rounded-md border px-3 py-2 text-sm bg-white" defaultValue="Produtor">
              {TIPOS_ANUNCIANTE.map((t) => <option key={t}>{t}</option>)}
            </select>
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
            <input name="cidade" aria-label="Cidade" placeholder="Cidade" defaultValue="Floriano" className="rounded-md border px-3 py-2 text-sm" required />
            <input name="estado" aria-label="Estado (UF)" placeholder="Estado (UF)" defaultValue="PI" maxLength={2} className="rounded-md border px-3 py-2 text-sm uppercase" required />
            <input name="localComercializacao" aria-label="Local de comercialização" placeholder="Local de comercialização (ex: Feira local)" className="rounded-md border px-3 py-2 text-sm sm:col-span-2" required />
            <input name="pontoEntrega" aria-label="Ponto de entrega" placeholder="Ponto de entrega (opcional)" className="rounded-md border px-3 py-2 text-sm" />
            <select name="especial" aria-label="Disponibilidade especial" className="rounded-md border px-3 py-2 text-sm bg-white">
              <option value="normal">Disponibilidade normal</option>
              <option value="excedente">Excedente</option>
              <option value="desconto">Desconto</option>
              <option value="doacao">Doação</option>
              <option value="urgente">Urgente</option>
            </select>
            <label className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm cursor-pointer">
              <input name="ultimaColheita" type="checkbox" />
              <span>Disponível para Última Colheita</span>
            </label>
            <textarea name="descricao" aria-label="Descrição" placeholder="Descrição (opcional)" className="rounded-md border px-3 py-2 text-sm sm:col-span-2 lg:col-span-3 min-h-16" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] items-center">
            <div className="flex items-center gap-3">
              <div className="h-20 w-20 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
                {fotoPreview ? <img src={fotoPreview} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:bg-secondary">
                <Upload className="h-4 w-4" /> Enviar foto
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </div>
            <input name="fotoUrl" aria-label="URL da foto" placeholder="Ou cole uma URL de imagem (https://...)" className="rounded-md border px-3 py-2 text-sm" />
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

      <h2 className="text-xl font-bold mb-4 mt-6">Produtos disponíveis ({filtered.length})</h2>
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

function ProductCard({ p, onReserve }: { p: Product; onReserve: () => void }) {
  const esp = p.disponibilidadeEspecial ?? "normal";
  const espMeta = ESPECIAL_LABEL[esp];
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
        {esp !== "normal" && (
          <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-1 shadow ${espMeta.cls}`}>
            <Sparkles className="h-3 w-3" /> {espMeta.label}
          </span>
        )}
        {p.ultimaColheita && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold rounded-full bg-brand-orange text-white px-2 py-0.5 shadow">
            Última Colheita
          </span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-base leading-tight">{p.nome}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          por <strong className="text-foreground/80">{p.produtor}</strong> · {p.tipoAnunciante}
        </p>
        <div className="mt-2 space-y-1 text-xs text-foreground/70">
          <p className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-brand-blue" />{p.cidade} - {p.estado}</p>
          <p className="inline-flex items-start gap-1"><Store className="h-3 w-3 text-brand-green mt-0.5" /><span>{p.localComercializacao}</span></p>
          {p.pontoEntrega && <p className="text-[11px] text-muted-foreground pl-4">Ponto: {p.pontoEntrega}</p>}
        </div>
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
  product, onClose, onConfirm,
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
        <p className="text-sm text-muted-foreground mb-1">{product.produtor} · R$ {product.preco.toFixed(2)}/{product.unidade}</p>
        <p className="text-xs text-muted-foreground mb-4 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{product.cidade} - {product.estado}</p>
        <form
          onSubmit={(e) => { e.preventDefault(); if (comprador.trim()) onConfirm(product, comprador.trim(), qty); }}
          className="space-y-3"
        >
          <div>
            <label htmlFor="comprador" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome do comprador</label>
            <input id="comprador" value={comprador} onChange={(e) => setComprador(e.target.value)} placeholder="Ex: Ana Clara" className="mt-1 w-full rounded-md border px-3 py-2.5 text-sm" required autoFocus />
          </div>
          <div>
            <label htmlFor="quantidade" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantidade ({product.unidade})</label>
            <input id="quantidade" type="number" min={1} max={product.estoque} value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(product.estoque, Number(e.target.value))))}
              className="mt-1 w-full rounded-md border px-3 py-2.5 text-sm" />
          </div>
          <div className="rounded-lg bg-brand-green-soft p-3 text-sm">
            Total: <strong className="text-primary">R$ {(product.preco * qty).toFixed(2)}</strong>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border bg-white py-2.5 text-sm font-medium">Cancelar</button>
            <button type="submit" className="flex-1 rounded-lg bg-accent text-accent-foreground py-2.5 text-sm font-semibold shadow hover:bg-accent/90">Confirmar reserva</button>
          </div>
        </form>
      </div>
    </div>
  );
}
