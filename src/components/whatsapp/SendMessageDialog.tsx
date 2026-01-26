import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface SendMessageDialogProps {
  defaultPhone?: string;
  leadName?: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function SendMessageDialog({ defaultPhone = '', leadName, trigger, onSuccess }: SendMessageDialogProps) {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState(defaultPhone);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!phone.trim() || !message.trim() || !user) return;

    setIsSending(true);
    try {
      const { data: config, error: configError } = await supabase
        .from('evolution_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (configError || !config) {
        throw new Error('Configuração Evolution API não encontrada. Configure em Configurações > WhatsApp.');
      }

      // Call edge function to send message
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: phone.replace(/\D/g, ''),
          message: message.trim(),
        },
      });

      if (error) throw error;

      toast({
        title: 'Mensagem enviada!',
        description: `Mensagem enviada para ${leadName || phone}`,
      });

      setMessage('');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao enviar',
        description: error instanceof Error ? error.message : 'Não foi possível enviar a mensagem',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Send className="h-4 w-4" />
            Enviar Mensagem
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Mensagem WhatsApp</DialogTitle>
          <DialogDescription>
            {leadName ? `Enviar mensagem para ${leadName}` : 'Envie uma mensagem via WhatsApp'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Número de Telefone</Label>
            <Input
              id="phone"
              placeholder="5521999999999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-secondary/30"
            />
            <p className="text-xs text-muted-foreground">
              Formato: código do país + DDD + número (ex: 5521999999999)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-secondary/30 min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/4096 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!phone.trim() || !message.trim() || isSending}
            className="gap-2"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
