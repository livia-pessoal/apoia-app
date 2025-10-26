import { Heart, TrendingUp, Award } from "lucide-react";
import { StatsCard } from "../StatsCard";

export const StatsSection = () => {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
          Impacto da Comunidade
        </h2>
        <p className="text-lg text-muted-foreground">Sua rede está crescendo! 🌟</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          icon={Heart}
          value="+ de 25"
          label="mulheres em situação de violência apoiadas"
        />
        <StatsCard
          icon={TrendingUp}
          value="+ de 50"
          label="posts com alto engajamento na rede APOIA"
        />
        <StatsCard
          icon={Award}
          value="+ de 30"
          label="Missões APOIA completas"
        />
      </div>
    </section>
  );
};
