import { useEffect, useState } from 'react';
import { useAchievements, Achievement } from '@/hooks/useAchievements';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Lock, 
  Sparkles,
  Users,
  MessageCircle,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface AchievementsTabProps {
  userId: string | null;
}

const categoryIcons = {
  mission: Sparkles,
  network: Users,
  chat: MessageCircle,
  time: Clock,
  special: Star,
};

const categoryColors = {
  mission: 'from-purple-500 via-pink-500 to-purple-600',
  network: 'from-green-500 via-emerald-500 to-green-600',
  chat: 'from-blue-500 via-cyan-500 to-blue-600',
  time: 'from-orange-500 via-red-500 to-orange-600',
  special: 'from-yellow-500 via-amber-500 to-yellow-600',
};

const categoryLabels = {
  mission: 'Missões',
  network: 'Rede de Apoio',
  chat: 'Comunicação',
  time: 'Tempo no App',
  special: 'Especiais',
};

export default function AchievementsTabPremium({ userId }: AchievementsTabProps) {
  const {
    achievements,
    stats,
    loading,
    error,
  } = useAchievements(userId);

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [previousUnlocked, setPreviousUnlocked] = useState<number>(0);

  // Detectar nova conquista desbloqueada
  useEffect(() => {
    if (stats.unlocked_count > previousUnlocked && previousUnlocked > 0) {
      // Nova conquista desbloqueada!
      celebrateAchievement();
    }
    setPreviousUnlocked(stats.unlocked_count);
  }, [stats.unlocked_count]);

  // Efeito de celebração com confete
  const celebrateAchievement = () => {
    // Confete do centro da tela
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#ec4899', '#10b981', '#3b82f6', '#f59e0b'],
    });

    // Segundo burst após delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9333ea', '#ec4899', '#10b981'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#f59e0b', '#10b981'],
      });
    }, 250);
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.is_unlocked;
    if (filter === 'locked') return !achievement.is_unlocked;
    return true;
  });

  const groupedAchievements = filteredAchievements.reduce((acc, achievement) => {
    const cat = achievement.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Faça login para ver suas conquistas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <div className="relative">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-500 animate-bounce" />
            <Sparkles className="w-6 h-6 absolute top-0 right-0 text-yellow-500 animate-ping" />
          </div>
          <p className="text-muted-foreground font-medium">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 animate-fade-in">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive">Erro ao carregar conquistas</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Header Premium com Gradiente Animado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-xl p-8 text-white shadow-2xl animate-gradient">
        {/* Sparkles de fundo */}
        <div className="absolute inset-0 opacity-20">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 animate-pulse" />
          <Sparkles className="absolute top-8 right-12 w-4 h-4 animate-ping" />
          <Sparkles className="absolute bottom-6 left-20 w-5 h-5 animate-pulse delay-75" />
          <Sparkles className="absolute bottom-4 right-6 w-4 h-4 animate-ping delay-150" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold">Suas Conquistas</h2>
          </div>

          {/* Grid de Estatísticas Premium */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Trophy className="w-6 h-6" />}
              value={stats.unlocked_count}
              label="Desbloqueadas"
              delay="0"
            />
            <StatCard
              icon={<Star className="w-6 h-6" />}
              value={stats.total_achievements}
              label="Total"
              delay="100"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              value={stats.total_points}
              label="Pontos"
              delay="200"
            />
            <StatCard
              icon={<Sparkles className="w-6 h-6" />}
              value={`${stats.completion_percentage}%`}
              label="Completo"
              delay="300"
            />
          </div>

          {/* Barra de Progresso Animada */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso Geral</span>
              <span className="text-sm font-bold">{stats.unlocked_count}/{stats.total_achievements}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${stats.completion_percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Modernos */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all"
          >
            Todas ({achievements.length})
          </TabsTrigger>
          <TabsTrigger 
            value="unlocked"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white transition-all"
          >
            Desbloqueadas ({stats.unlocked_count})
          </TabsTrigger>
          <TabsTrigger 
            value="locked"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white transition-all"
          >
            Bloqueadas ({stats.total_achievements - stats.unlocked_count})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de Conquistas por Categoria */}
      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements], idx) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          const gradientClass = categoryColors[category as keyof typeof categoryColors];
          const categoryLabel = categoryLabels[category as keyof typeof categoryLabels];

          return (
            <div 
              key={category} 
              className="animate-slide-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Header da Categoria */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${gradientClass}`}>
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">{categoryLabel}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {categoryAchievements.filter(a => a.is_unlocked).length}/{categoryAchievements.length}
                </Badge>
              </div>

              {/* Grid de Conquistas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement, i) => (
                  <AchievementCardPremium
                    key={achievement.achievement_code}
                    achievement={achievement}
                    gradientClass={gradientClass}
                    delay={i * 50}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vazio */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-16 animate-fade-in">
          <div className="relative inline-block">
            <Trophy className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-30" />
            <Lock className="w-8 h-8 absolute -bottom-1 -right-1 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-muted-foreground mb-2">
            {filter === 'unlocked' 
              ? 'Nenhuma conquista desbloqueada ainda'
              : 'Nenhuma conquista encontrada'}
          </p>
          <p className="text-sm text-muted-foreground">
            Continue explorando o app para desbloquear badges!
          </p>
        </div>
      )}
    </div>
  );
}

// Card de Estatística com Animação
interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  delay: string;
}

function StatCard({ icon, value, label, delay }: StatCardProps) {
  return (
    <div 
      className="bg-white/20 backdrop-blur-md rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-white/80">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-white/80">{label}</div>
    </div>
  );
}

// Card de Conquista Premium
interface AchievementCardPremiumProps {
  achievement: Achievement;
  gradientClass: string;
  delay: number;
}

function AchievementCardPremium({ achievement, gradientClass, delay }: AchievementCardPremiumProps) {
  const isUnlocked = achievement.is_unlocked;
  const progress = achievement.progress_percentage;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`
        p-5 transition-all duration-300 cursor-pointer
        ${isUnlocked 
          ? 'hover:shadow-2xl hover:scale-105 bg-gradient-to-br from-white to-gray-50' 
          : 'hover:shadow-lg opacity-70 hover:opacity-90'
        }
        animate-slide-up
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        {/* Ícone Animado */}
        <div className={`
          relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0
          transition-all duration-500
          ${isUnlocked 
            ? `bg-gradient-to-br ${gradientClass} shadow-lg ${isHovered ? 'scale-110 rotate-6' : ''}` 
            : 'bg-muted'
          }
        `}>
          {isUnlocked ? (
            <>
              <span className="relative z-10">{achievement.icon}</span>
              {isHovered && (
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-ping" />
              )}
            </>
          ) : (
            <Lock className="w-8 h-8 text-muted-foreground" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Título e Pontos */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold text-lg truncate">{achievement.achievement_title}</h4>
            {isUnlocked && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 flex-shrink-0 animate-bounce">
                +{achievement.points}
              </Badge>
            )}
          </div>

          {/* Descrição */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {achievement.achievement_description}
          </p>

          {/* Progresso */}
          {!isUnlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">
                  {achievement.current_progress}/{achievement.required_count}
                </span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Data de Desbloqueio */}
          {isUnlocked && achievement.unlocked_at && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Desbloqueada em {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
