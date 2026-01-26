import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WhatsAppTemplate {
  id: string;
  user_id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  is_active: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export function useWhatsAppTemplates() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as WhatsAppTemplate[]);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = async (template: Omit<WhatsAppTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .insert({
          ...template,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Template criado!',
        description: `Template "${template.name}" foi criado com sucesso.`,
      });

      await fetchTemplates();
      return data as WhatsAppTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: 'Erro ao criar template',
        description: 'Não foi possível criar o template.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<WhatsAppTemplate>) => {
    try {
      const { error } = await supabase
        .from('whatsapp_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Template atualizado!',
        description: 'Template foi atualizado com sucesso.',
      });

      await fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: 'Erro ao atualizar template',
        description: 'Não foi possível atualizar o template.',
        variant: 'destructive',
      });
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Template excluído!',
        description: 'Template foi excluído com sucesso.',
      });

      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: 'Erro ao excluir template',
        description: 'Não foi possível excluir o template.',
        variant: 'destructive',
      });
    }
  };

  const incrementUsage = async (id: string) => {
    try {
      const template = templates.find(t => t.id === id);
      if (template) {
        await supabase
          .from('whatsapp_templates')
          .update({ usage_count: template.usage_count + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    incrementUsage,
    refresh: fetchTemplates,
  };
}
