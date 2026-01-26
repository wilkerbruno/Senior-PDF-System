import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Neighborhood {
  id: string;
  name: string;
  zone: string;
  city: string;
}

export function useNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeighborhoods() {
      const { data, error } = await supabase
        .from('rj_neighborhoods')
        .select('*')
        .order('zone')
        .order('name');

      if (error) {
        console.error('Error fetching neighborhoods:', error);
      } else {
        setNeighborhoods(data || []);
      }
      setLoading(false);
    }

    fetchNeighborhoods();
  }, []);

  const zones = useMemo(() => {
    return [...new Set(neighborhoods.map(n => n.zone))];
  }, [neighborhoods]);

  const getNeighborhoodsByZone = (zone: string) => {
    return neighborhoods.filter(n => n.zone === zone);
  };

  return {
    neighborhoods,
    zones,
    loading,
    getNeighborhoodsByZone,
  };
}
