import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ChatbotConfig {
  id: string;
  user_id: string;
  is_enabled: boolean;
  welcome_message: string | null;
  fallback_message: string;
  business_hours_start: string;
  business_hours_end: string;
  out_of_hours_message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotRule {
  id: string;
  user_id: string;
  chatbot_id: string;
  trigger_keywords: string[];
  response: string;
  match_type: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useWhatsAppChatbot() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [rules, setRules] = useState<ChatbotRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch chatbot config
      const { data: configData, error: configError } = await supabase
        .from('whatsapp_chatbot')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (configError) throw configError;
      setConfig(configData as ChatbotConfig | null);

      // Fetch rules if config exists
      if (configData) {
        const { data: rulesData, error: rulesError } = await supabase
          .from('whatsapp_chatbot_rules')
          .select('*')
          .eq('chatbot_id', configData.id)
          .order('priority', { ascending: false });

        if (rulesError) throw rulesError;
        setRules((rulesData || []) as ChatbotRule[]);
      }
    } catch (error) {
      console.error('Error fetching chatbot config:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const createOrUpdateConfig = async (configData: Partial<ChatbotConfig>) => {
    if (!user) return null;

    try {
      if (config) {
        // Update existing
        const { data, error } = await supabase
          .from('whatsapp_chatbot')
          .update(configData)
          .eq('id', config.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Chatbot atualizado!',
          description: 'Configurações do chatbot foram salvas.',
        });

        await fetchConfig();
        return data as ChatbotConfig;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('whatsapp_chatbot')
          .insert({
            ...configData,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: 'Chatbot criado!',
          description: 'Configurações do chatbot foram salvas.',
        });

        await fetchConfig();
        return data as ChatbotConfig;
      }
    } catch (error) {
      console.error('Error saving chatbot config:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const toggleChatbot = async (enabled: boolean) => {
    if (!config) {
      // Create config if doesn't exist
      await createOrUpdateConfig({ is_enabled: enabled });
    } else {
      await createOrUpdateConfig({ is_enabled: enabled });
    }
  };

  const addRule = async (rule: Omit<ChatbotRule, 'id' | 'user_id' | 'chatbot_id' | 'created_at' | 'updated_at'>) => {
    if (!user || !config) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_chatbot_rules')
        .insert({
          ...rule,
          user_id: user.id,
          chatbot_id: config.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Regra adicionada!',
        description: 'Nova regra de resposta automática criada.',
      });

      await fetchConfig();
      return data as ChatbotRule;
    } catch (error) {
      console.error('Error adding rule:', error);
      toast({
        title: 'Erro ao adicionar regra',
        description: 'Não foi possível criar a regra.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateRule = async (id: string, updates: Partial<ChatbotRule>) => {
    try {
      const { error } = await supabase
        .from('whatsapp_chatbot_rules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Regra atualizada!',
        description: 'A regra foi atualizada com sucesso.',
      });

      await fetchConfig();
    } catch (error) {
      console.error('Error updating rule:', error);
      toast({
        title: 'Erro ao atualizar regra',
        description: 'Não foi possível atualizar a regra.',
        variant: 'destructive',
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_chatbot_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Regra excluída!',
        description: 'A regra foi removida.',
      });

      await fetchConfig();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: 'Erro ao excluir regra',
        description: 'Não foi possível excluir a regra.',
        variant: 'destructive',
      });
    }
  };

  return {
    config,
    rules,
    isLoading,
    createOrUpdateConfig,
    toggleChatbot,
    addRule,
    updateRule,
    deleteRule,
    refresh: fetchConfig,
  };
}
