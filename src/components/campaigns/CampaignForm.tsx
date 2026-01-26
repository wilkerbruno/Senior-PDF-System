import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, CalendarIcon, Clock, Send, Save, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CHANNEL_LIST, getChannelConfig } from '@/constants/channels';
import { Channel } from '@/types/crm';
import { DbCampaign } from '@/hooks/useSupabaseCampaigns';

const campaignSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  channel: z.enum(['email', 'sms', 'whatsapp', 'push', 'rcs']),
  status: z.enum(['draft', 'scheduled', 'active']),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  onSubmit: (campaign: Omit<DbCampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: unknown }>;
}

const MESSAGE_TEMPLATES: Record<Channel, { name: string; content: string }[]> = {
  whatsapp: [
    { name: 'Boas-vindas', content: 'Olá {{nome}}! 👋 Bem-vindo(a) à nossa comunidade! Estamos felizes em ter você conosco.' },
    { name: 'Promoção', content: '🔥 {{nome}}, temos uma oferta especial para você! Use o cupom PROMO20 e ganhe 20% de desconto.' },
    { name: 'Lembrete', content: 'Oi {{nome}}! Passando para lembrar sobre sua consulta/pedido. Qualquer dúvida, estou aqui!' },
  ],
  email: [
    { name: 'Newsletter', content: 'Confira as novidades desta semana! Preparamos conteúdos exclusivos para você.' },
    { name: 'Carrinho Abandonado', content: 'Você deixou alguns itens no carrinho. Complete sua compra e ganhe frete grátis!' },
    { name: 'Feedback', content: 'Sua opinião é muito importante para nós! Conte como foi sua experiência.' },
  ],
  sms: [
    { name: 'Flash Sale', content: 'PROMO RELAMPAGO! 50% OFF por 24h. Use: FLASH50. Acesse: bit.ly/promo' },
    { name: 'Confirmação', content: 'Seu pedido #{{numero}} foi confirmado! Entrega prevista: {{data}}.' },
    { name: 'Lembrete', content: 'Lembrete: Sua consulta é amanhã às {{hora}}. Confirme: bit.ly/confirm' },
  ],
  push: [
    { name: 'Novidade', content: '🎁 Acabou de chegar! Confira as novidades com preços especiais.' },
    { name: 'Desconto', content: '⚡ Desconto exclusivo só hoje! Não perca essa oportunidade.' },
    { name: 'Atualização', content: '📱 Atualizamos seu app! Veja as novas funcionalidades.' },
  ],
  rcs: [
    { name: 'Catálogo', content: '📦 Conheça nosso catálogo interativo! Navegue e compre direto pelo chat.' },
    { name: 'Suporte', content: 'Precisando de ajuda? Nosso suporte está disponível 24/7. Clique para iniciar.' },
    { name: 'Agendamento', content: '📅 Agende seu atendimento de forma prática. Escolha o melhor horário para você.' },
  ],
};

export function CampaignForm({ onSubmit }: CampaignFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [messageContent, setMessageContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      channel: 'whatsapp',
      status: 'draft',
    },
  });

  const selectedChannel = watch('channel');
  const templates = MESSAGE_TEMPLATES[selectedChannel] || [];
  const channelConfig = getChannelConfig(selectedChannel);

  const handleTemplateSelect = (content: string) => {
    setMessageContent(content);
  };

  const onFormSubmit = async (data: CampaignFormData) => {
    setIsSubmitting(true);
    
    let scheduledAt: string | null = null;
    if (data.status === 'scheduled' && selectedDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduleDate = new Date(selectedDate);
      scheduleDate.setHours(hours, minutes, 0, 0);
      scheduledAt = scheduleDate.toISOString();
    }

    const campaign: Omit<DbCampaign, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      name: data.name,
      channel: data.channel,
      status: data.status,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      scheduled_at: scheduledAt,
    };

    const result = await onSubmit(campaign);
    setIsSubmitting(false);

    if (!result.error) {
      reset();
      setMessageContent('');
      setSelectedDate(undefined);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Nome da campanha */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha</Label>
            <Input
              id="name"
              placeholder="Ex: Black Friday 2024"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Seleção de canal */}
          <div className="space-y-3">
            <Label>Canal de Comunicação</Label>
            <div className="grid grid-cols-5 gap-2">
              {CHANNEL_LIST.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannel === channel.id;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setValue('channel', channel.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn('p-2 rounded-full', channel.bgColor)}>
                      <Icon className={cn('h-4 w-4', channel.color)} />
                    </div>
                    <span className="text-xs font-medium">{channel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates e Mensagem */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Conteúdo da Mensagem</Label>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Templates
              </Badge>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.content)}
                  className="whitespace-nowrap"
                >
                  {template.name}
                </Button>
              ))}
            </div>

            <Textarea
              placeholder="Digite sua mensagem ou selecione um template..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use {'{{nome}}'} para personalização automática com o nome do lead.
            </p>
          </div>

          {/* Agendamento */}
          <div className="space-y-3">
            <Label>Quando Enviar</Label>
            <Tabs
              defaultValue="draft"
              onValueChange={(value) => setValue('status', value as CampaignFormData['status'])}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="draft" className="gap-2">
                  <Save className="h-4 w-4" />
                  Rascunho
                </TabsTrigger>
                <TabsTrigger value="scheduled" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Agendar
                </TabsTrigger>
                <TabsTrigger value="active" className="gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Agora
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scheduled" className="space-y-4 mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label className="mb-2 block">Data</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !selectedDate && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate
                                ? format(selectedDate, 'PPP', { locale: ptBR })
                                : 'Selecione uma data'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="w-32">
                        <Label className="mb-2 block">Horário</Label>
                        <Select value={selectedTime} onValueChange={setSelectedTime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return ['00', '30'].map((min) => (
                                <SelectItem key={`${hour}:${min}`} value={`${hour}:${min}`}>
                                  {hour}:{min}
                                </SelectItem>
                              ));
                            }).flat()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <Card className="border-warning/50 bg-warning/5">
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      A campanha será enviada imediatamente após a criação para todos os leads selecionados.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Campanha'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
