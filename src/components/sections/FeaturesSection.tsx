import { Shield, Users, Sparkles } from "lucide-react";
import { FeatureCard } from "../FeatureCard";
import { toast } from "sonner";

interface FeaturesSectionProps {
  onFortalecimentoClick?: () => void;
  onProtecaoClick?: () => void;
  onRedeApioClick?: () => void;
}

export const FeaturesSection = ({ onFortalecimentoClick, onProtecaoClick, onRedeApioClick }: FeaturesSectionProps) => {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Shield}
          title="Proteção Imediata"
          description="Acesso rápido a funcionalidades de emergência e botão de pânico"
          buttonText="Recursos de Emergência"
          buttonVariant="emergency"
          onButtonClick={onProtecaoClick || (() => toast.info("Funcionalidade em desenvolvimento"))}
        />
        
        <FeatureCard
          icon={Users}
          title="Rede de Apoio"
          description="Conecte-se com apoiadoras, ONGs e serviços especializados"
          buttonText="Ver Minha Rede"
          buttonVariant="default"
          onButtonClick={onRedeApioClick || (() => toast.info("Funcionalidade em desenvolvimento"))}
        />
        
        <FeatureCard
          icon={Sparkles}
          title="Fortalecimento"
          description="Participe de missões gamificadas e narrativas educativas"
          buttonText="Começar Missão"
          buttonVariant="hero"
          onButtonClick={onFortalecimentoClick || (() => toast.success("Missão iniciada!"))}
        />
      </div>
    </section>
  );
};
