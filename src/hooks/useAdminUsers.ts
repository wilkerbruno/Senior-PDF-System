import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/hooks/useAuth';

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: AppRole[];
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (!isAdmin()) return;

    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const usersWithRoles: AdminUser[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        roles: (rolesData || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role as AppRole),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        if (error.code === '23505') {
          toast({ title: 'Usuário já possui esta role' });
          return;
        }
        throw error;
      }

      toast({ title: 'Role adicionada!' });
      await fetchUsers();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar role',
      });
    }
  }, [toast, fetchUsers]);

  const removeRole = useCallback(async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({ title: 'Role removida!' });
      await fetchUsers();
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao remover role',
      });
    }
  }, [toast, fetchUsers]);

  return {
    users,
    isLoading,
    addRole,
    removeRole,
    refetch: fetchUsers,
  };
}
