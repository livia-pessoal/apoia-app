import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook para verificar se a conexão com Supabase está funcionando
 */
export const useSupabaseConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Verifica se as credenciais foram carregadas
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.error('❌ Credenciais do Supabase não encontradas');
          setError('Credenciais não configuradas');
          setIsConnected(false);
          return;
        }

        // Tenta fazer uma query real para verificar a conexão
        const { error: queryError } = await supabase.from('_test').select('count').limit(1);
        
        // Qualquer resposta do servidor (mesmo erro de tabela não encontrada) 
        // significa que a conexão funcionou
        if (queryError) {
          // Se é erro de tabela não encontrada, está tudo bem!
          if (queryError.message.includes('does not exist') || 
              queryError.message.includes('not find') ||
              queryError.code === 'PGRST116' ||
              queryError.code === '42P01') {
            console.log('✅ Conectado ao Supabase com sucesso! (servidor respondeu)');
            setIsConnected(true);
            setError(null);
          } else {
            // Erro real de conexão
            console.error('❌ Erro real:', queryError);
            setError(queryError.message);
            setIsConnected(false);
          }
        } else {
          // Sem erro = conectado perfeitamente
          console.log('✅ Conectado ao Supabase com sucesso!');
          setIsConnected(true);
          setError(null);
        }
      } catch (err: any) {
        console.error('❌ Erro na conexão:', err);
        setError(err.message || 'Erro ao conectar');
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return { isConnected, error };
};
