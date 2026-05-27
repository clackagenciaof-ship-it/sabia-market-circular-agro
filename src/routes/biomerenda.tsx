import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { uid, useWaste, type WasteLog } from "../lib/store";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/biomerenda")({
  head: () =>
    pageHead({
      path: "/biomerenda",
      title: "BioMerenda — SABIÁ Market",
      description:
        "Registro de resíduos vegetais da merenda escolar destinados à compostagem e alimentação animal — devolvendo vida ao solo.",
    }),
  component: BioMerenda,
});

function BioMerenda() {
  const [logs, setLogs] = useWaste();

  function add(form: HTMLFormElement) {
    const d = new FormData(form);
    const novo: WasteLog = {
      id: uid(),
      origem: String(d.get("origem") || ""),
      pesoKg: Number(d.get("pesoKg") || 0),
      tipo: (d.get("tipo") as WasteLog["tipo"]) || "compostagem",
      data: new Date().toISOString(),
    };
    if (!novo.origem) return;
    setLogs([novo, ...logs]);
    form.reset();
  }

  const totalKg = logs.reduce((a, b) => a + b.pesoKg, 0);
  const compostado = logs.filter((l) => l.tipo === "compostagem").reduce((a, b) => a + b.pesoKg, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-1">
          <Leaf className="h-4 w-4" /> Resíduos vegetais da merenda
        </div>
        <h1 className="text-3xl font-bold">BioMerenda</h1>
        <p className="text-muted-foreground">
          Registre resíduos orgânicos desviados do lixo comum e enviados para compostagem.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Stat label="Registros" value={String(logs.length)} />
        <Stat label="Total desviado" value={`${totalKg.toFixed(1)} kg`} />
        <Stat label="Compostado" value={`${compostado.toFixed(1)} kg`} />
      </div>

      <h2 className="text-xl font-bold mb-3">Registrar resíduo</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(e.currentTarget);
        }}
        className="mb-8 grid gap-3 sm:grid-cols-4 rounded-lg border bg-card p-4"
      >
        <input name="origem" aria-label="Origem do resíduo" placeholder="Origem (cozinha, sala...)" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="pesoKg" aria-label="Peso em quilogramas" type="number" step="0.1" min="0" placeholder="Peso (kg)" className="rounded-md border px-3 py-2 text-sm" required />
        <select name="tipo" aria-label="Destino do resíduo" className="rounded-md border px-3 py-2 text-sm bg-background">
          <option value="compostagem">Compostagem</option>
          <option value="alimentacao_animal">Alimentação animal</option>
          <option value="reaproveitamento">Reaproveitamento (Última Colheita)</option>
        </select>
        <button className="rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90">
          Registrar
        </button>
      </form>

      <h2 className="text-xl font-bold mb-3">Histórico de resíduos</h2>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="px-4 py-2">Origem</th>
              <th className="px-4 py-2">Peso</th>
              <th className="px-4 py-2">Destino</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2">{l.origem}</td>
                <td className="px-4 py-2">{l.pesoKg} kg</td>
                <td className="px-4 py-2 capitalize">{l.tipo.replace("_", " ")}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {new Date(l.data).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum registro ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-primary mt-1">{value}</div>
    </div>
  );
}
