import { createFileRoute } from "@tanstack/react-router";
import { Droplets } from "lucide-react";
import { uid, useWater, type WaterLog } from "../lib/store";

export const Route = createFileRoute("/agua")({
  component: Agua,
});

function Agua() {
  const [logs, setLogs] = useWater();

  function add(form: HTMLFormElement) {
    const d = new FormData(form);
    const novo: WaterLog = {
      id: uid(),
      canteiro: String(d.get("canteiro") || ""),
      litros: Number(d.get("litros") || 0),
      umidade: Number(d.get("umidade") || 0),
      data: new Date().toISOString(),
    };
    if (!novo.canteiro) return;
    setLogs([novo, ...logs]);
    form.reset();
  }

  const totalLitros = logs.reduce((a, b) => a + b.litros, 0);
  const mediaUmidade = logs.length ? Math.round(logs.reduce((a, b) => a + b.umidade, 0) / logs.length) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-1">
          <Droplets className="h-4 w-4" /> Uso racional da água
        </div>
        <h1 className="text-3xl font-bold">Água Inteligente</h1>
        <p className="text-muted-foreground">
          Registre a irrigação e a umidade do solo para evitar desperdícios.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Stat label="Registros" value={String(logs.length)} />
        <Stat label="Litros irrigados" value={`${totalLitros} L`} />
        <Stat label="Umidade média" value={`${mediaUmidade}%`} />
      </div>

      <h2 className="text-xl font-bold mb-3">Registrar irrigação</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(e.currentTarget);
        }}
        className="mb-8 grid gap-3 sm:grid-cols-4 rounded-lg border bg-card p-4"
      >
        <input name="canteiro" aria-label="Canteiro ou setor" placeholder="Canteiro / setor" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="litros" aria-label="Litros irrigados" type="number" step="0.1" min="0" placeholder="Litros" className="rounded-md border px-3 py-2 text-sm" required />
        <input name="umidade" aria-label="Umidade do solo em porcentagem" type="number" min="0" max="100" placeholder="Umidade %" className="rounded-md border px-3 py-2 text-sm" required />
        <button className="rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90">
          Registrar
        </button>
      </form>

      <h2 className="text-xl font-bold mb-3">Histórico de irrigação</h2>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr>
              <th className="px-4 py-2">Canteiro</th>
              <th className="px-4 py-2">Litros</th>
              <th className="px-4 py-2">Umidade</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2">{l.canteiro}</td>
                <td className="px-4 py-2">{l.litros} L</td>
                <td className="px-4 py-2">{l.umidade}%</td>
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
