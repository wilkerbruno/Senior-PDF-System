import { useState } from 'react';
import { Send, Users, UserCog, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: string[];
}

interface SendNotificationDialogProps {
  users: AdminUser[];
}

type RecipientType = 'all' | 'admins' | 'moderators' | 'users' | 'specific';

const RECIPIENT_OPTIONS = [
  { value: 'all', label: 'Todos os Usuários', icon: Users },
  { value: 'admins', label: 'Apenas Administradores', icon: UserCog },
  { value: 'moderators', label: 'Apenas Moderadores', icon: UserCog },
  { value: 'users', label: 'Apenas Usuários', icon: User },
  { value: 'specific', label: 'Usuário Específico', icon: User },
];

const NOTIFICATION_TYPES = [
  { value: 'info', label: 'Informação' },
  { value: 'campaign', label: 'Campanha' },
  { value: 'lead', label: 'Lead' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export function SendNotificationDialog({ users }: SendNotificationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientType, setRecipientType] = useState<RecipientType>('all');
  const [specificUserId, setSpecificUserId] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  const getRecipients = (): string[] => {
    switch (recipientType) {
      case 'all':
        return users.map((u) => u.id);
      case 'admins':
        return users.filter((u) => u.roles.includes('admin')).map((u) => u.id);
      case 'moderators':
        return users.filter((u) => u.roles.includes('moderator')).map((u) => u.id);
      case 'users':
        return users.filter((u) => u.roles.includes('user') && !u.roles.includes('admin')).map((u) => u.id);
      case 'specific':
        return specificUserId ? [specificUserId] : [];
      default:
        return [];
    }
  };

  const handleSend = async () => {
    if (!title.trim()) {
      toast({ variant: 'destructive', title: 'Título é obrigatório' });
      return;
    }

    const recipients = getRecipients();
    if (recipients.length === 0) {
      toast({ variant: 'destructive', title: 'Selecione ao menos um destinatário' });
      return;
    }

    setIsLoading(true);
    try {
      const notifications = recipients.map((userId) => ({
        user_id: userId,
        type: notificationType,
        title: title.trim(),
        message: message.trim() || null,
        action_url: actionUrl.trim() || null,
      }));

      const { error } = await supabase.from('notifications').insert(notifications);

      if (error) throw error;

      toast({
        title: 'Notificações enviadas!',
        description: `${recipients.length} usuário(s) notificado(s)`,
      });

      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({ variant: 'destructive', title: 'Erro ao enviar notificações' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRecipientType('all');
    setSpecificUserId('');
    setNotificationType('info');
    setTitle('');
    setMessage('');
    setActionUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Enviar Notificação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Notificação</DialogTitle>
          <DialogDescription>
            Envie notificações para usuários, equipes ou grupos específicos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Destinatários</Label>
            <Select value={recipientType} onValueChange={(v) => setRecipientType(v as RecipientType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECIPIENT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {recipientType === 'specific' && (
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Select value={specificUserId} onValueChange={setSpecificUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name || user.email || user.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipo de Notificação</Label>
            <Select value={notificationType} onValueChange={setNotificationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Título *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nova atualização disponível"
            />
          </div>

          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descrição detalhada da notificação..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>URL de Ação (opcional)</Label>
            <Input
              value={actionUrl}
              onChange={(e) => setActionUrl(e.target.value)}
              placeholder="/dashboard"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
