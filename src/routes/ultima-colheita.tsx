import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Recycle, Heart, Tag, Gift } from "lucide-react";
import { uid, useSurplus, type Surplus } from "../lib/store";

export const Route = createFileRoute("/ultima-colheita")({
  component: UltimaColheita,
});

const tipoMeta: Record<Surplus["tipo"], { label: string; color: string; icon: any }> = {
  desconto: { label: "Desconto", color: "bg-accent/30 text-foreground", icon: Tag },
  social: { label: "Preço social", color: "bg-chart-3/20 text-foreground", icon: Heart },
  doacao: { label: "Doação", color: "bg-primary/15 text-primary", icon: Gift },
};

function UltimaColheita() {
  const [surplus, setSurplus] = useSurplus();
  const [toast, setToast] = useState<string | null>(null);

  function add(form: HTMLFormElement) {
    const d = new FormData(form);
    const novo: Surplus = {
      id: uid(),
      produto: String(d.get("produto") || ""),
      produtor: String(d.get("produtor") || ""),
      quantidadeKg: Number(d.get("quantidadeKg") || 0),
      desconto: Number(d.get("desconto") || 0),
      tipo: (d.get("tipo") as Surplus["tipo"]) || "desconto",
    };
    if (!novo.produto) return;
    setSurplus([novo, ...surplus]);
    form.reset();
  }

  function reservar(s: Surplus) {
    setSurplus(surplus.filter((x) => x.id !== s.id));
    setToast(`${s.quantidadeKg} kg de "${s.produto}" reservados!`);
    setTimeout(() => setToast(null), 2500);
  }

  const totalKg = surplus.reduce((a, b) => a + b.quantidadeKg, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-1">
            <Recycle className="h-4 w-4" /> Vitrine de excedentes
          </div>
          <h1 className="text-3xl font-bold">Última Colheita</h1>
          <p className="text-muted-foreground">
            Alimentos próximos do fim do ciclo a preços reduzidos, sociais ou em doação. Total disponível:{" "}
            <strong>{totalKg} kg</strong>.
          </p>
        </div>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(e.currentTarget);
        }}
        className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 rounded-lg border bg-card p-4"
      >
        <input name="produto" placeholder="Produto" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="produtor" placeholder="Produtor" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="quantidadeKg" type="number" step="0.5" min="0" placeholder="Qtd (kg)" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="desconto" type="number" min="0" max="100" placeholder="% desconto" className="rounded-md border px-3 py-2 text-sm" />
        <select name="tipo" className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="desconto">Desconto</option>
          <option value="social">Preço social</option>
          <option value="doacao">Doação</option>
        </select>
        <button className="sm:col-span-2 lg:col-span-5 rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90">
          Publicar na vitrine
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {surplus.map((s) => {
          const meta = tipoMeta[s.tipo];
          const Icon = meta.icon;
          return (
            <article key={s.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{s.produto}</h3>
                <span className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${meta.color}`}>
                  <Icon className="h-3 w-3" /> {meta.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{s.produtor}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-primary">{s.quantidadeKg} kg</div>
                  {s.desconto > 0 && <div className="text-xs text-muted-foreground">{s.desconto}% off</div>}
                </div>
                <button
                  onClick={() => reservar(s)}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Reservar
                </button>
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
        <div className="fixed bottom-6 right-6 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
