import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Achievement {
  achievement_code: string;
  achievement_title: string;
  achievement_description: string;
  category: 'mission' | 'network' | 'chat' | 'time' | 'special';
  icon: string;
  color: string;
  points: number;
  required_count: number;
  current_progress: number;
  is_unlocked: boolean;
  unlocked_at: string | null;
  progress_percentage: number;
  target_profile?: 'all' | 'user' | 'supporter';
}

export interface AchievementStats {
  total_achievements: number;
  unlocked_count: number;
  total_points: number;
  completion_percentage: number;
}

/**
 * Hook para gerenciar conquistas do usuário
 */
export const useAchievements = (userId: string | null) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    total_achievements: 0,
    unlocked_count: 0,
    total_points: 0,
    completion_percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar conquistas do usuário
  const loadAchievements = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Chamar função RPC que retorna conquistas com progresso
      const { data, error: rpcError } = await supabase
        .rpc('get_user_achievements', { p_user_id: userId });

      if (rpcError) {
        console.error('Erro ao carregar conquistas:', rpcError);
        setError(rpcError.message);
        return;
      }

      if (data) {
        setAchievements(data);
        calculateStats(data);
      }
    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message || 'Erro ao carregar conquistas');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const calculateStats = (achievementsData: Achievement[]) => {
    const total = achievementsData.length;
    const unlocked = achievementsData.filter(a => a.is_unlocked).length;
    const points = achievementsData
      .filter(a => a.is_unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    setStats({
      total_achievements: total,
      unlocked_count: unlocked,
      total_points: points,
      completion_percentage: percentage,
    });
  };

  // Desbloquear conquista manualmente (para testes)
  const unlockAchievement = async (achievementCode: string) => {
    if (!userId) return false;

    try {
      const { data, error: unlockError } = await supabase
        .rpc('unlock_achievement', {
          p_user_id: userId,
          p_achievement_code: achievementCode,
        });

      if (unlockError) {
        console.error('Erro ao desbloquear:', unlockError);
        return false;
      }

      if (data) {
        // Recarregar conquistas
        await loadAchievements();
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro:', err);
      return false;
    }
  };

  // Atualizar progresso de conquista
  const updateProgress = async (achievementCode: string, increment: number = 1) => {
    if (!userId) return;

    try {
      await supabase.rpc('update_achievement_progress', {
        p_user_id: userId,
        p_achievement_code: achievementCode,
        p_increment: increment,
      });

      // Recarregar conquistas para atualizar UI
      await loadAchievements();
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err);
    }
  };

  // Filtrar conquistas por categoria
  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.category === category);
  };

  // Filtrar conquistas desbloqueadas
  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.is_unlocked);
  };

  // Filtrar conquistas bloqueadas
  const getLockedAchievements = () => {
    return achievements.filter(a => !a.is_unlocked);
  };

  // Conquistas em progresso (começou mas não completou)
  const getInProgressAchievements = () => {
    return achievements.filter(a => !a.is_unlocked && a.current_progress > 0);
  };

  // Subscription em tempo real para notificações de conquistas
  useEffect(() => {
    if (!userId) return;

    // Carregar inicial
    loadAchievements();

    // Subscription para novas conquistas desbloqueadas
    const subscription = supabase
      .channel('user_achievements_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🏆 Conquista atualizada:', payload);
          
          // Se foi desbloqueada, mostrar toast
          if (payload.eventType === 'UPDATE' && payload.new.is_unlocked) {
            // Recarregar para pegar dados completos
            loadAchievements();
          } else if (payload.eventType === 'INSERT') {
            loadAchievements();
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    achievements,
    stats,
    loading,
    error,
    loadAchievements,
    unlockAchievement,
    updateProgress,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getLockedAchievements,
    getInProgressAchievements,
  };
};
