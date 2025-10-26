import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Mission {
  id: string;
  module_number: number;
  module_title: string;
  mission_number: number;
  title: string;
  content?: string;
  video_url?: string;
  video_platform?: string;
  content_type: 'text' | 'video';
  duration_minutes: number;
  completed?: boolean;
}

export interface MissionProgress {
  mission_id: string;
  completed: boolean;
  completed_at?: string;
}

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [progress, setProgress] = useState<MissionProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileId = localStorage.getItem('profile_id');

  // Buscar todas as missões
  useEffect(() => {
    fetchMissions();
  }, []);

  // Buscar progresso do usuário
  useEffect(() => {
    if (profileId) {
      fetchProgress();
    }
  }, [profileId]);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('missions_content')
        .select('*')
        .order('mission_number', { ascending: true });

      if (error) throw error;

      setMissions(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar missões:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from('user_mission_progress')
        .select('*')
        .eq('user_id', profileId);

      if (error) throw error;

      setProgress(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar progresso:', err);
    }
  };

  // Marcar missão como completa
  const completeMission = async (missionId: string) => {
    if (!profileId) {
      console.warn('Usuário não autenticado');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_mission_progress')
        .upsert({
          user_id: profileId,
          mission_id: missionId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,mission_id'
        });

      if (error) throw error;

      // Atualizar estado local
      setProgress(prev => {
        const exists = prev.find(p => p.mission_id === missionId);
        if (exists) {
          return prev.map(p => 
            p.mission_id === missionId 
              ? { ...p, completed: true, completed_at: new Date().toISOString() }
              : p
          );
        } else {
          return [...prev, { mission_id: missionId, completed: true, completed_at: new Date().toISOString() }];
        }
      });

      console.log('✅ Missão completada!');
    } catch (err: any) {
      console.error('Erro ao completar missão:', err);
    }
  };

  // Obter missões por módulo
  const getMissionsByModule = (moduleNumber: number): Mission[] => {
    const moduleMissions = missions.filter(m => m.module_number === moduleNumber);
    
    // Adicionar informação de progresso
    return moduleMissions.map(mission => ({
      ...mission,
      completed: progress.some(p => p.mission_id === mission.id && p.completed)
    }));
  };

  // Calcular estatísticas
  const getStats = () => {
    const totalMissions = missions.length;
    const completedCount = progress.filter(p => p.completed).length;
    const percentage = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;

    return {
      total: totalMissions,
      completed: completedCount,
      remaining: totalMissions - completedCount,
      percentage
    };
  };

  // Obter próxima missão não completada
  const getNextMission = (): Mission | null => {
    const incompleteMissions = missions.filter(
      m => !progress.some(p => p.mission_id === m.id && p.completed)
    );

    return incompleteMissions[0] || null;
  };

  return {
    missions,
    progress,
    loading,
    error,
    completeMission,
    getMissionsByModule,
    getStats,
    getNextMission,
  };
};
