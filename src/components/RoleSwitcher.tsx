import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sprout, GraduationCap, ShoppingBag, ShieldCheck, Check } from "lucide-react";
import { useRole, ROLE_LABEL, type Role } from "@/lib/store";

const ROLE_ICON: Record<Role, any> = {
  produtor: Sprout,
  escola: GraduationCap,
  comprador: ShoppingBag,
  admin: ShieldCheck,
};

const ROLE_COLOR: Record<Role, string> = {
  produtor: "bg-brand-green text-white",
  escola: "bg-brand-blue text-white",
  comprador: "bg-accent text-accent-foreground",
  admin: "bg-brand-green-dark text-white",
};

export function RoleSwitcher({ compact = false }: { compact?: boolean }) {
  const [role, setRole] = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ROLE_ICON[role];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm border border-white/20 ${ROLE_COLOR[role]}`}
        aria-label={`Perfil atual: ${ROLE_LABEL[role]}. Trocar perfil.`}
      >
        <Icon className="h-3.5 w-3.5" />
        {!compact && <span className="hidden sm:inline">{ROLE_LABEL[role]}</span>}
        <span className="sm:hidden capitalize">{role}</span>
        <ChevronDown className="h-3 w-3 opacity-80" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl border bg-white shadow-2xl z-50 overflow-hidden">
          <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b bg-muted/40">
            Entrar como
          </div>
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => {
            const I = ROLE_ICON[r];
            const active = r === role;
            return (
              <button
                key={r}
                onClick={() => { setRole(r); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-brand-green-soft text-left ${active ? "bg-brand-green-soft/60" : ""}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${ROLE_COLOR[r]}`}>
                  <I className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 font-medium">{ROLE_LABEL[r]}</span>
                {active && <Check className="h-4 w-4 text-brand-green" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
