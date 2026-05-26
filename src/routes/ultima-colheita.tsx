import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Recycle, Heart, Tag, Gift, ImageIcon, Upload } from "lucide-react";
import { uid, useSurplus, type Surplus } from "../lib/store";

export const Route = createFileRoute("/ultima-colheita")({
  component: UltimaColheita,
});

const tipoMeta: Record<Surplus["tipo"], { label: string; cls: string; icon: any }> = {
  desconto: { label: "Desconto", cls: "bg-accent text-accent-foreground", icon: Tag },
  social: { label: "Preço social", cls: "bg-brand-blue text-white", icon: Heart },
  doacao: { label: "Doação", cls: "bg-primary text-primary-foreground", icon: Gift },
};

function UltimaColheita() {
  const [surplus, setSurplus] = useSurplus();
  const [toast, setToast] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>("");
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
    setToast(`${s.quantidadeKg} kg de "${s.produto}" reservados!`);
    setTimeout(() => setToast(null), 2500);
  }

  const totalKg = surplus.reduce((a, b) => a + b.quantidadeKg, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider mb-1">
          <Recycle className="h-4 w-4" /> Vitrine de excedentes
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Última Colheita</h1>
        <p className="text-muted-foreground mt-1">
          Alimentos próximos do fim do ciclo a preços reduzidos, sociais ou em doação. Total disponível:{" "}
          <strong className="text-accent">{totalKg} kg</strong>.
        </p>
      </header>

      <form
        onSubmit={(e) => { e.preventDefault(); add(e.currentTarget); }}
        className="mb-8 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <h3 className="font-bold text-lg mb-4">Publicar excedente</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input name="produto" placeholder="Produto" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="produtor" placeholder="Produtor" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="quantidadeKg" type="number" step="0.5" min="0" placeholder="Qtd (kg)" className="rounded-md border px-3 py-2 text-sm" required />
          <input name="desconto" type="number" min="0" max="100" placeholder="% desconto" className="rounded-md border px-3 py-2 text-sm" />
          <select name="tipo" className="rounded-md border px-3 py-2 text-sm bg-white">
            <option value="desconto">Desconto</option>
            <option value="social">Preço social</option>
            <option value="doacao">Doação</option>
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
          <input name="fotoUrl" placeholder="Ou cole URL de imagem" className="rounded-md border px-3 py-2 text-sm" />
        </div>
        <button className="mt-4 rounded-lg bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold shadow hover:bg-accent/90">
          Publicar na vitrine
        </button>
      </form>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {surplus.map((s) => {
          const meta = tipoMeta[s.tipo];
          const Icon = meta.icon;
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
                <span className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-1 shadow ${meta.cls}`}>
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold">{s.produto}</h3>
                <p className="text-xs text-muted-foreground">{s.produtor}</p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-extrabold text-accent">{s.quantidadeKg} kg</div>
                    {s.desconto > 0 && <div className="text-xs text-muted-foreground">{s.desconto}% off</div>}
                  </div>
                  <button onClick={() => reservar(s)} className="rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow">
                    Reservar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {surplus.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">
            Sem excedentes no momento. Cadastre acima.
          </p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-brand-green-dark text-white px-4 py-3 text-sm shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
