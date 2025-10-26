import { useState } from 'react';
import { useAchievements, Achievement } from '@/hooks/useAchievements';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Lock, 
  Sparkles,
  Users,
  MessageCircle,
  Clock,
  Star,
  CheckCircle,
  Target
} from 'lucide-react';

interface AchievementsTabProps {
  userId: string | null;
}

// Função para determinar dificuldade baseado em required_count
const getDifficulty = (requiredCount: number): 'easy' | 'medium' | 'hard' => {
  if (requiredCount <= 5) return 'easy';
  if (requiredCount <= 20) return 'medium';
  return 'hard';
};

const difficultyConfig = {
  easy: {
    label: 'Fácil',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: '🟢',
  },
  medium: {
    label: 'Médio',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    icon: '🟡',
  },
  hard: {
    label: 'Difícil',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: '🔴',
  },
};

const categoryIcons = {
  mission: Sparkles,
  network: Users,
  chat: MessageCircle,
  time: Clock,
  special: Star,
};

export default function AchievementsTabMelhorado({ userId }: AchievementsTabProps) {
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
          <Trophy className="w-12 h-12 mx-auto mb-3 text-purple-500 opacity-50 animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-500">
          <p className="text-sm">Erro ao carregar conquistas</p>
          <p className="text-xs text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Estatísticas */}
      <div className="text-center space-y-4">
        <Trophy className="w-16 h-16 mx-auto text-purple-500" />
        <div>
          <h2 className="text-2xl font-bold">Conquistas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Seu progresso no APOIA
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{stats.unlocked_count}</p>
            <p className="text-xs text-muted-foreground">Desbloqueadas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{stats.total_achievements}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.total_points}</p>
            <p className="text-xs text-muted-foreground">Pontos</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{Math.round(stats.completion_percentage)}%</p>
            <p className="text-xs text-muted-foreground">Completo</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 justify-center">
        <Badge 
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          Todas ({achievements.length})
        </Badge>
        <Badge 
          variant={filter === 'unlocked' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('unlocked')}
        >
          Desbloqueadas ({stats.unlocked_count})
        </Badge>
        <Badge 
          variant={filter === 'locked' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('locked')}
        >
          Bloqueadas ({achievements.length - stats.unlocked_count})
        </Badge>
      </div>

      {/* Lista de Conquistas - 2 colunas em desktop */}
      <div className="grid md:grid-cols-2 gap-3">
        {filteredAchievements.map(achievement => (
          <AchievementCard 
            key={achievement.achievement_code} 
            achievement={achievement} 
            showDifficulty={!achievement.is_unlocked}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma conquista encontrada</p>
        </div>
      )}
    </div>
  );
}

// Componente de Card Individual
interface AchievementCardProps {
  achievement: Achievement;
  showDifficulty?: boolean;
}

function AchievementCard({ achievement, showDifficulty = false }: AchievementCardProps) {
  const isUnlocked = achievement.is_unlocked;
  const progress = achievement.progress_percentage;
  const Icon = categoryIcons[achievement.category];
  const difficulty = getDifficulty(achievement.required_count);
  const diffConfig = difficultyConfig[difficulty];

  return (
    <Card className={`
      p-4 transition-all duration-200
      ${isUnlocked 
        ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200' 
        : 'bg-white hover:border-primary/30 hover:shadow-sm'}
    `}>
      <div className="flex items-start gap-4">
        {/* Ícone */}
        <div className={`
          flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
          ${isUnlocked ? 'bg-purple-100' : 'bg-muted'}
        `}>
          {isUnlocked ? (
            <CheckCircle className="w-6 h-6 text-purple-600" />
          ) : (
            <Lock className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className={`font-semibold ${isUnlocked ? 'text-purple-900' : 'text-foreground'}`}>
                {achievement.icon} {achievement.achievement_title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {achievement.achievement_description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {showDifficulty && !isUnlocked && (
                <Badge variant="outline" className={`text-xs ${diffConfig.color}`}>
                  {diffConfig.icon} {diffConfig.label}
                </Badge>
              )}
              <Badge variant={isUnlocked ? "default" : "secondary"}>
                {achievement.points} pts
              </Badge>
            </div>
          </div>

          {/* Progresso */}
          {!isUnlocked && (
            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {achievement.current_progress}/{achievement.required_count}
                </span>
                <span className="font-medium text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Data de desbloqueio */}
          {isUnlocked && achievement.unlocked_at && (
            <p className="text-xs text-purple-600 mt-2">
              ✓ Desbloqueada {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
