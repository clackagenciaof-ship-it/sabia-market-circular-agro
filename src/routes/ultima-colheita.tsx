import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Recycle, Heart, Tag, Gift, ImageIcon, Upload, MapPin, AlertTriangle } from "lucide-react";
import { uid, useSurplus, type Surplus } from "../lib/store";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/ultima-colheita")({
  head: () =>
    pageHead({
      path: "/ultima-colheita",
      title: "Última Colheita — SABIÁ Market",
      description:
        "Excedentes, descontos, doações e itens urgentes da colheita. Reduza perdas e amplie o acesso a alimentos frescos.",
    }),
  component: UltimaColheita,
});

const tipoMeta: Record<Surplus["tipo"], { label: string; cls: string; icon: any }> = {
  desconto: { label: "Desconto", cls: "bg-accent text-accent-foreground", icon: Tag },
  social: { label: "Preço social", cls: "bg-brand-blue text-white", icon: Heart },
  doacao: { label: "Doação", cls: "bg-primary text-primary-foreground", icon: Gift },
  urgente: { label: "Urgente", cls: "bg-destructive text-white", icon: AlertTriangle },
};

function UltimaColheita() {
  const [surplus, setSurplus] = useSurplus();
  
  const [toast, setToast] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("Todos");
  const fileRef = useRef<HTMLInputElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(String(reader.result || ""));
    reader.readAsDataURL(f);
  }

  function add(form: HTMLFormElement) {
    const d = new FormData(form);
    const urlFoto = String(d.get("fotoUrl") || "").trim();
    const novo: Surplus = {
      id: uid(),
      produto: String(d.get("produto") || ""),
      produtor: String(d.get("produtor") || ""),
      cidade: String(d.get("cidade") || "Floriano"),
      estado: String(d.get("estado") || "PI"),
      quantidadeKg: Number(d.get("quantidadeKg") || 0),
      desconto: Number(d.get("desconto") || 0),
      tipo: (d.get("tipo") as Surplus["tipo"]) || "desconto",
      foto: fotoPreview || urlFoto || undefined,
    };
    if (!novo.produto) return;
    setSurplus([novo, ...surplus]);
    form.reset();
    setFotoPreview("");
  }

  function reservar(s: Surplus) {
    setSurplus(surplus.filter((x) => x.id !== s.id));
    const verbo = s.tipo === "doacao" ? "solicitada" : "reservada";
    setToast(`${s.quantidadeKg} kg de "${s.produto}" ${verbo}!`);
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = surplus.filter((s) => filtroTipo === "Todos" || s.tipo === filtroTipo);
  const totalKg = surplus.reduce((a, b) => a + b.quantidadeKg, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Recycle className="h-4 w-4" /> Vitrine de excedentes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Última Colheita</h1>
        <p className="text-muted-foreground mt-1">
          Alimentos próximos do fim do ciclo — excedentes, descontos, doações e urgências. Total:{" "}
          <strong className="text-accent">{totalKg} kg</strong>.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {["Todos", "desconto", "social", "doacao", "urgente"].map((t) => (
          <button
            key={t}
            onClick={() => setFiltroTipo(t)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold border transition ${
              filtroTipo === t ? "bg-brand-green-dark text-white border-brand-green-dark" : "bg-white text-foreground/70 hover:bg-secondary"
            }`}
          >
            {t === "Todos" ? "Todos" : tipoMeta[t as Surplus["tipo"]].label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); add(e.currentTarget); }}
        className="mb-8 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <h2 className="font-bold text-lg mb-4">Publicar excedente</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input name="produto" aria-label="Nome do produto" placeholder="Produto" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="produtor" aria-label="Produtor ou instituição" placeholder="Produtor / instituição" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="cidade" aria-label="Cidade" placeholder="Cidade" defaultValue="Floriano" className="rounded-md border px-3 py-2 text-sm" />
          <input name="estado" aria-label="Estado UF" placeholder="UF" defaultValue="PI" maxLength={2} className="rounded-md border px-3 py-2 text-sm uppercase" />
          <input name="quantidadeKg" aria-label="Quantidade kg" type="number" step="0.5" min="0" placeholder="Qtd (kg)" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="desconto" aria-label="Percentual de desconto" type="number" min="0" max="100" placeholder="% desconto" className="rounded-md border px-3 py-2 text-sm" />
          <select name="tipo" aria-label="Tipo de oferta" className="rounded-md border px-3 py-2 text-sm bg-white">
            <option value="desconto">Desconto</option>
            <option value="social">Preço social</option>
            <option value="doacao">Doação</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] items-center">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-lg border bg-muted overflow-hidden flex items-center justify-center">
              {fotoPreview ? <img src={fotoPreview} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm">
              <Upload className="h-4 w-4" /> Enviar foto
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          </div>
          <input name="fotoUrl" aria-label="URL da imagem" placeholder="Ou cole URL de imagem" className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <button className="mt-4 rounded-lg bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold shadow hover:bg-accent/90">
          Publicar na vitrine
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Excedentes disponíveis ({filtered.length})</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => {
          const meta = tipoMeta[s.tipo];
          const Icon = meta.icon;
          const isDoacao = s.tipo === "doacao";
          return (
            <article key={s.id} className="rounded-2xl border-2 border-accent/40 bg-card overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-brand-green-soft relative overflow-hidden">
                {s.foto ? (
                  <img src={s.foto} alt={s.produto} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-brand-green">
                    <ImageIcon className="h-12 w-12 opacity-40" />
                  </div>
                )}
                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-1 shadow ${meta.cls}`}>
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{s.produto}</h3>
                <p className="text-xs text-muted-foreground">{s.produtor}</p>
                <p className="text-xs text-foreground/70 inline-flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-brand-blue" />{s.cidade} - {s.estado}
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-accent">{s.quantidadeKg} kg</div>
                    {isDoacao ? (
                      <div className="text-xs font-bold text-brand-green">Doação 100%</div>
                    ) : s.desconto > 0 ? (
                      <div className="text-xs text-muted-foreground">{s.desconto}% off</div>
                    ) : null}
                  </div>
                  <button onClick={() => reservar(s)} className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow">
                    {isDoacao ? "Solicitar" : "Reservar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">
            Sem excedentes nesta categoria.
          </p>
        )}
      </div>

      <section className="mt-14">
        <header className="mb-4">
          <div className="inline-flex items-center gap-2 text-brand-green-dark text-xs font-semibold uppercase tracking-wider mb-1">
            <Tag className="h-4 w-4" /> Plataforma completa
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Todos os itens e produtos ({products.length})</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Catálogo completo do SABIÁ Market — produtores, escolas, associações e cooperativas.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="rounded-2xl border bg-card overflow-hidden shadow-sm">
              <div className="aspect-[4/3] bg-brand-green-soft relative overflow-hidden">
                {p.foto ? (
                  <img src={p.foto} alt={p.nome} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-brand-green">
                    <ImageIcon className="h-12 w-12 opacity-40" />
                  </div>
                )}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-1 shadow bg-white text-foreground/80">
                  {p.categoria}
                </span>
                {p.ultimaColheita && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2.5 py-1 shadow bg-accent text-accent-foreground">
                    <Recycle className="h-3 w-3" /> Última colheita
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{p.nome}</h3>
                <p className="text-xs text-muted-foreground">{p.produtor} · {p.tipoAnunciante}</p>
                <p className="text-xs text-foreground/70 inline-flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-brand-blue" />{p.cidade} - {p.estado}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{p.localComercializacao}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-extrabold text-brand-green-dark">
                      R$ {p.preco.toFixed(2)}
                      <span className="text-xs font-normal text-muted-foreground"> / {p.unidade}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Estoque: {p.estoque}</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-12">
              Nenhum produto cadastrado ainda.
            </p>
          )}
        </div>
      </section>


      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-brand-green-dark text-white px-4 py-3 text-sm shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
