import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CreateProfileData {
  userType: 'user' | 'supporter';
  displayName?: string;
  email?: string;
  phone?: string;
  motivation?: string;
  causes?: string[];
  authUserId?: string;  // ID do usuário no Supabase Auth
}

/**
 * Hook para criar perfil de usuária (anônimo ou com nome)
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (profileData: CreateProfileData) => {
    setLoading(true);
    setError(null);

    try {
      // Preparar dados do perfil
      const insertData: any = {
        user_type: profileData.userType,  // Campo real na tabela
        display_name: profileData.displayName || null,
      };

      // Adicionar campos específicos para supporters
      if (profileData.userType === 'supporter') {
        insertData.email = profileData.email;
        insertData.phone = profileData.phone;
        insertData.motivation = profileData.motivation;
        insertData.causes = profileData.causes || [];
        insertData.auth_user_id = profileData.authUserId || null;
      }

      // Debug: Ver dados que serão inseridos
      console.log('📝 Tentando inserir perfil:', insertData);

      // Criar perfil no banco
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([insertData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Erro ao criar perfil:', insertError);
        console.error('📊 Dados tentados:', insertData);
        console.error('🔍 Código do erro:', insertError.code);
        console.error('💬 Mensagem:', insertError.message);
        console.error('📄 Detalhes:', insertError.details);
        setError(insertError.message);
        return null;
      }

      console.log('✅ Perfil criado:', data);
      
      // Salvar profile_id no localStorage
      localStorage.setItem('profile_id', data.id);
      localStorage.setItem('userProfile', profileData.userType);
      if (profileData.displayName) {
        localStorage.setItem('display_name', profileData.displayName);
      }

      return data;
    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message || 'Erro ao criar perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProfile, loading, error };
};
