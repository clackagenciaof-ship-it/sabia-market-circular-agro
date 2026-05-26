import logoUrl from "@/assets/logo-sabia.png";

type Props = {
  className?: string;
  /** Reservado para compatibilidade — a logo oficial já contém o wordmark. */
  showWordmark?: boolean;
  /** Altura em pixels. */
  size?: number;
};

export function LogoSABIA({ className = "", size = 44 }: Props) {
  return (
    <img
      src={logoUrl}
      alt="SABIÁ Market — Sistema Agroalimentar Biointeligente"
      style={{ height: size, width: "auto", maxWidth: "100%" }}
      className={`object-contain shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
