import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Organization {
  id: string;
  name: string;
  phone: string;
  type: string;
  address?: string;
}

/**
 * Hook para buscar organizações (180, 190, ONGs, etc)
 */
export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('type');

        if (error) {
          console.error('Erro ao buscar organizações:', error);
        } else {
          setOrganizations(data || []);
        }
      } catch (err) {
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return { organizations, loading };
};
