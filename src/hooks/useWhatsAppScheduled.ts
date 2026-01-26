import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ScheduledMessage {
  id: string;
  user_id: string;
  lead_id: string | null;
  phone: string;
  message: string;
  template_id: string | null;
  scheduled_at: string;
  status: string;
  sent_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  lead?: {
    name: string;
    email: string;
  };
}

export function useWhatsAppScheduled() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScheduledMessages = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('whatsapp_scheduled')
        .select(`
          *,
          lead:leads(name, email)
        `)
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setScheduledMessages((data || []) as ScheduledMessage[]);
    } catch (error) {
      console.error('Error fetching scheduled messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScheduledMessages();
  }, [fetchScheduledMessages]);

  const scheduleMessage = async (message: {
    phone: string;
    message: string;
    scheduled_at: string;
    lead_id?: string;
    template_id?: string;
  }) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_scheduled')
        .insert({
          ...message,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Mensagem agendada!',
        description: `Mensagem será enviada em ${new Date(message.scheduled_at).toLocaleString('pt-BR')}.`,
      });

      await fetchScheduledMessages();
      return data as ScheduledMessage;
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast({
        title: 'Erro ao agendar mensagem',
        description: 'Não foi possível agendar a mensagem.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const cancelScheduledMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_scheduled')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Agendamento cancelado!',
        description: 'A mensagem não será mais enviada.',
      });

      await fetchScheduledMessages();
    } catch (error) {
      console.error('Error cancelling scheduled message:', error);
      toast({
        title: 'Erro ao cancelar',
        description: 'Não foi possível cancelar o agendamento.',
        variant: 'destructive',
      });
    }
  };

  const deleteScheduledMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_scheduled')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Agendamento excluído!',
        description: 'O agendamento foi removido.',
      });

      await fetchScheduledMessages();
    } catch (error) {
      console.error('Error deleting scheduled message:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o agendamento.',
        variant: 'destructive',
      });
    }
  };

  const pendingMessages = scheduledMessages.filter(m => m.status === 'pending');
  const sentMessages = scheduledMessages.filter(m => m.status === 'sent');
  const failedMessages = scheduledMessages.filter(m => m.status === 'failed');

  return {
    scheduledMessages,
    pendingMessages,
    sentMessages,
    failedMessages,
    isLoading,
    scheduleMessage,
    cancelScheduledMessage,
    deleteScheduledMessage,
    refresh: fetchScheduledMessages,
  };
}
