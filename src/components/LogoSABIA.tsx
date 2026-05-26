import logoUrl from "@/assets/logo-sabia.png";

type Props = {
  className?: string;
  showWordmark?: boolean;
  size?: number;
};

/**
 * Logo oficial do SABIÁ Market (já inclui o wordmark "SABIÁ Market").
 * Use `className` com utilitários de altura responsivos (ex.: "h-10 sm:h-12")
 * ou passe `size` em px para altura fixa.
 */
export function LogoSABIA({ className = "", size }: Props) {
  return (
    <img
      src={logoUrl}
      alt="SABIÁ Market — Sistema Agroalimentar Biointeligente"
      style={size ? { height: size, width: "auto" } : undefined}
      className={`object-contain shrink-0 select-none w-auto max-w-full ${className}`}
      draggable={false}
    />
  );
}
