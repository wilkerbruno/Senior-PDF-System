import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  MessageCircle, 
  Search, 
  User, 
  Link, 
  Unlink, 
  RefreshCw,
  Phone,
  Image,
  Video,
  Mic,
  FileText,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Bot,
  FileCode,
  Send,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatsCard } from '@/components/common/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useWhatsAppMessages, WhatsAppMessage } from '@/hooks/useWhatsAppMessages';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';
import { Skeleton } from '@/components/ui/skeleton';
import { TemplatesManager } from '@/components/whatsapp/TemplatesManager';
import { ScheduledMessages } from '@/components/whatsapp/ScheduledMessages';
import { ChatbotConfig } from '@/components/whatsapp/ChatbotConfig';
import { SendMessageDialog } from '@/components/whatsapp/SendMessageDialog';

function MessageTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'image':
      return <Image className="h-4 w-4 text-muted-foreground" />;
    case 'video':
      return <Video className="h-4 w-4 text-muted-foreground" />;
    case 'audio':
      return <Mic className="h-4 w-4 text-muted-foreground" />;
    case 'document':
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    default:
      return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

function MessageCard({ 
  message, 
  onLink, 
  onUnlink,
  leads 
}: { 
  message: WhatsAppMessage;
  onLink: (messageId: string, leadId: string) => void;
  onUnlink: (messageId: string) => void;
  leads: Array<{ id: string; name: string; phone: string | null }>;
}) {
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const phoneNumber = message.remote_jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  const formattedPhone = phoneNumber.length > 10 
    ? `+${phoneNumber.slice(0, 2)} (${phoneNumber.slice(2, 4)}) ${phoneNumber.slice(4, 9)}-${phoneNumber.slice(9)}`
    : phoneNumber;

  const handleLink = () => {
    if (selectedLeadId) {
      onLink(message.id, selectedLeadId);
      setDialogOpen(false);
      setSelectedLeadId('');
    }
  };

  return (
    <Card className={`${message.from_me ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-green-500'}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {message.from_me ? (
                <ArrowUpRight className="h-4 w-4 text-primary" />
              ) : (
                <ArrowDownLeft className="h-4 w-4 text-green-500" />
              )}
              <span className="font-medium truncate">
                {message.lead?.name || formattedPhone}
              </span>
              {message.lead && (
                <Badge variant="secondary" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Lead vinculado
                </Badge>
              )}
              <MessageTypeIcon type={message.message_type} />
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {message.content || `[${message.message_type}]`}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {formattedPhone}
              </span>
              <span>
                {format(new Date(message.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
              <Badge variant="outline" className="text-xs">
                {message.instance_name}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {message.lead_id ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUnlink(message.id)}
                title="Desvincular lead"
              >
                <Unlink className="h-4 w-4" />
              </Button>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" title="Vincular a lead">
                    <Link className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Vincular mensagem a lead</DialogTitle>
                    <DialogDescription>
                      Selecione um lead para vincular a esta mensagem de {formattedPhone}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name} {lead.phone && `(${lead.phone})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleLink} disabled={!selectedLeadId}>
                        Vincular
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WhatsAppMessages() {
  const { 
    messages, 
    allMessages,
    isLoading, 
    filters, 
    updateFilters, 
    linkToLead, 
    unlinkFromLead,
    refresh 
  } = useWhatsAppMessages();
  
  const { leads } = useSupabaseLeads();

  const stats = {
    total: allMessages.length,
    received: allMessages.filter(m => !m.from_me).length,
    sent: allMessages.filter(m => m.from_me).length,
    linked: allMessages.filter(m => m.lead_id).length,
  };

  return (
    <MainLayout>
      <PageHeader
        title="WhatsApp"
        description="Gerencie mensagens, templates e chatbot"
        actions={<SendMessageDialog />}
      />

      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="messages" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Mensagens
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileCode className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="gap-2">
            <Calendar className="h-4 w-4" />
            Agendadas
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="gap-2">
            <Bot className="h-4 w-4" />
            Chatbot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              label="Total de Mensagens"
              value={stats.total}
              icon={MessageCircle}
              iconColor="text-primary"
            />
            <StatsCard
              label="Recebidas"
              value={stats.received}
              icon={ArrowDownLeft}
              iconColor="text-success"
            />
            <StatsCard
              label="Enviadas"
              value={stats.sent}
              icon={Send}
              iconColor="text-primary"
            />
            <StatsCard
              label="Vinculadas a Leads"
              value={stats.linked}
              icon={User}
              iconColor="text-accent"
            />
          </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por conteúdo, telefone ou lead..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="linked-only"
                    checked={filters.linkedOnly}
                    onCheckedChange={(checked) => 
                      updateFilters({ linkedOnly: checked, unlinkedOnly: false })
                    }
                  />
                  <Label htmlFor="linked-only" className="text-sm">
                    Apenas vinculadas
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    id="unlinked-only"
                    checked={filters.unlinkedOnly}
                    onCheckedChange={(checked) => 
                      updateFilters({ unlinkedOnly: checked, linkedOnly: false })
                    }
                  />
                  <Label htmlFor="unlinked-only" className="text-sm">
                    Apenas sem vínculo
                  </Label>
                </div>
                
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Mensagens ({messages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma mensagem encontrada</p>
                  <p className="text-sm mt-2">
                    Configure a Evolution API nas configurações para começar a receber mensagens
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onLink={linkToLead}
                      onUnlink={unlinkFromLead}
                      leads={leads.map(l => ({ id: l.id, name: l.name, phone: l.phone }))}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesManager />
        </TabsContent>

        <TabsContent value="scheduled">
          <ScheduledMessages />
        </TabsContent>

        <TabsContent value="chatbot">
          <ChatbotConfig />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
