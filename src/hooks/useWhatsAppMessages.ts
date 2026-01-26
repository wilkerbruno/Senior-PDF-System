import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  instance_name: string;
  remote_jid: string;
  message_id: string;
  message_type: string;
  content: string | null;
  from_me: boolean;
  status: string;
  timestamp: string;
  lead_id: string | null;
  created_at: string;
  lead?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface MessageFilters {
  search: string;
  linkedOnly: boolean;
  unlinkedOnly: boolean;
}

export function useWhatsAppMessages() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MessageFilters>({
    search: '',
    linkedOnly: false,
    unlinkedOnly: false,
  });

  const fetchMessages = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('whatsapp_messages')
        .select(`
          *,
          lead:leads(id, name, email, phone)
        `)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;
      setMessages((data as WhatsAppMessage[]) || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Erro ao carregar mensagens');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Setup realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const channel = supabase
      .channel('whatsapp-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('New WhatsApp message received:', payload);
          
          // Fetch the complete message with lead data
          const { data: newMessage } = await supabase
            .from('whatsapp_messages')
            .select(`
              *,
              lead:leads(id, name, email, phone)
            `)
            .eq('id', payload.new.id)
            .single();

          if (newMessage) {
            setMessages((prev) => [newMessage as WhatsAppMessage, ...prev]);
            
            // Show notification for incoming messages
            if (!payload.new.from_me) {
              const senderName = (newMessage as WhatsAppMessage).lead?.name || 
                payload.new.remote_jid.replace('@s.whatsapp.net', '');
              
              toast.info(`Nova mensagem de ${senderName}`, {
                description: payload.new.content?.substring(0, 50) || 'Mídia recebida',
                duration: 5000,
              });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const { data: updatedMessage } = await supabase
            .from('whatsapp_messages')
            .select(`
              *,
              lead:leads(id, name, email, phone)
            `)
            .eq('id', payload.new.id)
            .single();

          if (updatedMessage) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (updatedMessage as WhatsAppMessage) : msg
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMessages]);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesContent = msg.content?.toLowerCase().includes(searchLower);
      const matchesPhone = msg.remote_jid.includes(filters.search);
      const matchesLead = msg.lead?.name.toLowerCase().includes(searchLower);
      if (!matchesContent && !matchesPhone && !matchesLead) return false;
    }

    if (filters.linkedOnly && !msg.lead_id) return false;
    if (filters.unlinkedOnly && msg.lead_id) return false;

    return true;
  });

  // Link message to lead manually
  const linkToLead = async (messageId: string, leadId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_messages')
        .update({ lead_id: leadId })
        .eq('id', messageId);

      if (error) throw error;

      toast.success('Mensagem vinculada ao lead');
      await fetchMessages();
    } catch (error) {
      console.error('Error linking message:', error);
      toast.error('Erro ao vincular mensagem');
    }
  };

  // Unlink message from lead
  const unlinkFromLead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_messages')
        .update({ lead_id: null })
        .eq('id', messageId);

      if (error) throw error;

      toast.success('Vínculo removido');
      await fetchMessages();
    } catch (error) {
      console.error('Error unlinking message:', error);
      toast.error('Erro ao remover vínculo');
    }
  };

  const updateFilters = (newFilters: Partial<MessageFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    messages: filteredMessages,
    allMessages: messages,
    isLoading,
    filters,
    updateFilters,
    linkToLead,
    unlinkFromLead,
    refresh: fetchMessages,
  };
}
