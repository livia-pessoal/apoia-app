import logoApoia from "@/assets/logo-apoia.png";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "xs", className = "" }: LogoProps) {
  const sizeClasses = {
    xs: "h-5",    // 20px - muito pequeno
    sm: "h-8",    // 32px - pequeno
    md: "h-12",   // 48px - médio
    lg: "h-16",   // 64px - grande
  };

  return (
    <img
      src={logoApoia}
      alt="APOIA"
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
}
