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
  TrendingUp
} from 'lucide-react';

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
  mission: 'from-purple-500 to-pink-500',
  network: 'from-green-500 to-emerald-500',
  chat: 'from-blue-500 to-cyan-500',
  time: 'from-orange-500 to-red-500',
  special: 'from-yellow-500 to-amber-500',
};

const categoryLabels = {
  mission: 'Missões',
  network: 'Rede de Apoio',
  chat: 'Comunicação',
  time: 'Tempo no App',
  special: 'Especiais',
};

export default function AchievementsTab({ userId }: AchievementsTabProps) {
  const {
    achievements,
    stats,
    loading,
    error,
  } = useAchievements(userId);

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Filtrar conquistas
  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.is_unlocked;
    if (filter === 'locked') return !achievement.is_unlocked;
    return true;
  });

  // Agrupar por categoria
  const groupedAchievements = filteredAchievements.reduce((acc, achievement) => {
    const cat = achievement.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Faça login para ver suas conquistas</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Erro ao carregar conquistas: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header com Estatísticas */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Suas Conquistas</h2>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.unlocked_count}</div>
            <div className="text-sm opacity-90">Desbloqueadas</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.total_achievements}</div>
            <div className="text-sm opacity-90">Total</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.total_points}</div>
            <div className="text-sm opacity-90">Pontos</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{stats.completion_percentage}%</div>
            <div className="text-sm opacity-90">Completo</div>
          </div>
        </div>

        {/* Barra de Progresso Geral */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm">{stats.unlocked_count}/{stats.total_achievements}</span>
          </div>
          <Progress value={stats.completion_percentage} className="bg-white/30" />
        </div>
      </div>

      {/* Filtros */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Todas ({achievements.length})
          </TabsTrigger>
          <TabsTrigger value="unlocked">
            Desbloqueadas ({stats.unlocked_count})
          </TabsTrigger>
          <TabsTrigger value="locked">
            Bloqueadas ({stats.total_achievements - stats.unlocked_count})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de Conquistas por Categoria */}
      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          const gradientClass = categoryColors[category as keyof typeof categoryColors];
          const categoryLabel = categoryLabels[category as keyof typeof categoryLabels];

          return (
            <div key={category}>
              {/* Header da Categoria */}
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">{categoryLabel}</h3>
                <Badge variant="secondary">
                  {categoryAchievements.filter(a => a.is_unlocked).length}/{categoryAchievements.length}
                </Badge>
              </div>

              {/* Grid de Conquistas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryAchievements.map((achievement) => (
                  <AchievementCard
                    key={achievement.achievement_code}
                    achievement={achievement}
                    gradientClass={gradientClass}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vazio */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            {filter === 'unlocked' 
              ? 'Você ainda não desbloqueou nenhuma conquista. Continue explorando o app!'
              : 'Nenhuma conquista encontrada.'}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente: Card Individual de Conquista
interface AchievementCardProps {
  achievement: Achievement;
  gradientClass: string;
}

function AchievementCard({ achievement, gradientClass }: AchievementCardProps) {
  const isUnlocked = achievement.is_unlocked;
  const progress = achievement.progress_percentage;

  return (
    <Card className={`p-4 transition-all hover:shadow-lg ${!isUnlocked && 'opacity-60'}`}>
      <div className="flex gap-4">
        {/* Ícone */}
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0
          ${isUnlocked 
            ? `bg-gradient-to-br ${gradientClass}` 
            : 'bg-muted'
          }
        `}>
          {isUnlocked ? achievement.icon : '🔒'}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Título e Badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold truncate">
              {achievement.achievement_title}
            </h4>
            {isUnlocked && (
              <Badge variant="default" className="bg-green-500 flex-shrink-0">
                +{achievement.points}
              </Badge>
            )}
          </div>

          {/* Descrição */}
          <p className="text-sm text-muted-foreground mb-2">
            {achievement.achievement_description}
          </p>

          {/* Progresso */}
          {!isUnlocked && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {achievement.current_progress}/{achievement.required_count}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Data de Desbloqueio */}
          {isUnlocked && achievement.unlocked_at && (
            <p className="text-xs text-muted-foreground">
              Desbloqueada em {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
