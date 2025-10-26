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
  Award
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
  mission: 'bg-purple-50 border-purple-200',
  network: 'bg-green-50 border-green-200',
  chat: 'bg-blue-50 border-blue-200',
  time: 'bg-orange-50 border-orange-200',
  special: 'bg-yellow-50 border-yellow-200',
};

const categoryAccents = {
  mission: 'text-purple-600',
  network: 'text-green-600',
  chat: 'text-blue-600',
  time: 'text-orange-600',
  special: 'text-yellow-600',
};

const categoryLabels = {
  mission: 'Missões',
  network: 'Rede de Apoio',
  chat: 'Comunicação',
  time: 'Tempo no App',
  special: 'Especiais',
};

export default function AchievementsTabDiscreto({ userId }: AchievementsTabProps) {
  const {
    achievements,
    stats,
    loading,
    error,
  } = useAchievements(userId);

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Faça login para ver suas conquistas</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-purple-500 opacity-50" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-destructive" />
          <p className="text-sm text-destructive">Erro ao carregar conquistas</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-4">
      {/* Header Discreto - Roxo Suave */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-800">Suas Conquistas</h2>
        </div>

        {/* Grid de Estatísticas - Discreto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{stats.unlocked_count}</div>
            <div className="text-xs text-gray-600">Desbloqueadas</div>
          </div>

          <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
            <div className="text-2xl font-bold text-gray-700">{stats.total_achievements}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>

          <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{stats.total_points}</div>
            <div className="text-xs text-gray-600">Pontos</div>
          </div>

          <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
            <div className="text-2xl font-bold text-gray-700">{stats.completion_percentage}%</div>
            <div className="text-xs text-gray-600">Completo</div>
          </div>
        </div>

        {/* Barra de Progresso Suave */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Progresso Geral</span>
            <span className="text-xs text-gray-500">{stats.unlocked_count}/{stats.total_achievements}</span>
          </div>
          <Progress value={stats.completion_percentage} className="h-2" />
        </div>
      </div>

      {/* Filtros Discretos */}
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
      <div className="space-y-5 mb-8">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
          const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
          const colorClass = categoryColors[category as keyof typeof categoryColors];
          const accentClass = categoryAccents[category as keyof typeof categoryAccents];
          const categoryLabel = categoryLabels[category as keyof typeof categoryLabels];

          return (
            <div key={category}>
              {/* Header da Categoria - Discreto */}
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className={`w-5 h-5 ${accentClass}`} />
                <h3 className="text-base font-semibold text-gray-700">{categoryLabel}</h3>
                <Badge variant="outline" className="ml-auto">
                  {categoryAchievements.filter(a => a.is_unlocked).length}/{categoryAchievements.length}
                </Badge>
              </div>

              {/* Grid de Conquistas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryAchievements.map((achievement) => (
                  <AchievementCardDiscreto
                    key={achievement.achievement_code}
                    achievement={achievement}
                    colorClass={colorClass}
                    accentClass={accentClass}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estado Vazio - Discreto */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12 mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-muted-foreground">
            {filter === 'unlocked' 
              ? 'Nenhuma conquista desbloqueada ainda'
              : 'Nenhuma conquista encontrada'}
          </p>
        </div>
      )}
    </div>
  );
}

// Card de Conquista Discreto
interface AchievementCardDiscretoProps {
  achievement: Achievement;
  colorClass: string;
  accentClass: string;
}

function AchievementCardDiscreto({ achievement, colorClass, accentClass }: AchievementCardDiscretoProps) {
  const isUnlocked = achievement.is_unlocked;
  const progress = achievement.progress_percentage;

  return (
    <Card className={`
      p-4 transition-all duration-200
      ${isUnlocked 
        ? 'bg-white hover:shadow-md border-2' 
        : 'bg-gray-50 hover:bg-gray-100 border'
      }
    `}>
      <div className="flex gap-3">
        {/* Ícone Discreto */}
        <div className={`
          w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all
          ${isUnlocked 
            ? `${colorClass} border-2` 
            : 'bg-gray-200 border border-gray-300'
          }
        `}>
          {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* Título e Pontos */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate text-gray-800">
              {achievement.achievement_title}
            </h4>
            {isUnlocked && (
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                +{achievement.points}
              </Badge>
            )}
          </div>

          {/* Descrição */}
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {achievement.achievement_description}
          </p>

          {/* Progresso */}
          {!isUnlocked && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{achievement.current_progress}/{achievement.required_count}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Data de Desbloqueio */}
          {isUnlocked && achievement.unlocked_at && (
            <p className="text-xs text-gray-500">
              {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
