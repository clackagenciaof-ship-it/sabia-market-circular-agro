import logoUrl from "@/assets/logo-sabia.png";

type Props = {
  className?: string;
  showWordmark?: boolean;
  size?: number;
};

export function LogoSABIA({ className = "", showWordmark = true, size = 44 }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoUrl}
        alt="SABIÁ Market"
        style={{ height: size, width: "auto" }}
        className="object-contain shrink-0"
      />
      {showWordmark && (
        <span className="hidden md:inline-flex flex-col leading-tight">
          <span className="text-base font-extrabold text-brand-blue tracking-tight">
            SABIÁ <span className="text-brand-green">Market</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Sistema Agroalimentar Biointeligente
          </span>
        </span>
      )}
    </div>
  );
}
