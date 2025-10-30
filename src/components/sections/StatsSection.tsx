import { Heart, TrendingUp, Award } from "lucide-react";
import { StatsCard } from "../StatsCard";

export const StatsSection = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 bg-purple-100/50 dark:bg-purple-900/20 px-4 py-1.5 rounded-full mb-2">
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">📊 Em Tempo Real</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          Impacto da Comunidade
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Juntas somos mais fortes. Veja o crescimento da nossa rede! 💜
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
