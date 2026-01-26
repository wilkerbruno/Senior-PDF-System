import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, X, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWhatsAppScheduled } from '@/hooks/useWhatsAppScheduled';
import { useWhatsAppTemplates } from '@/hooks/useWhatsAppTemplates';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function ScheduledMessages() {
  const { 
    pendingMessages, 
    sentMessages, 
    failedMessages, 
    isLoading, 
    scheduleMessage, 
    cancelScheduledMessage,
    deleteScheduledMessage 
  } = useWhatsAppScheduled();
  const { templates } = useWhatsAppTemplates();
  const { leads } = useSupabaseLeads();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    message: '',
    scheduled_at: '',
    lead_id: '',
    template_id: '',
  });

  const handleSubmit = async () => {
    if (!formData.phone || !formData.message || !formData.scheduled_at) return;

    await scheduleMessage({
      phone: formData.phone.replace(/\D/g, ''),
      message: formData.message,
      scheduled_at: new Date(formData.scheduled_at).toISOString(),
      lead_id: formData.lead_id || undefined,
      template_id: formData.template_id || undefined,
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      phone: '',
      message: '',
      scheduled_at: '',
      lead_id: '',
      template_id: '',
    });
    setIsOpen(false);
  };

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setFormData({
        ...formData,
        lead_id: leadId,
        phone: lead.phone || '',
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        template_id: templateId,
        message: template.content,
      });
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mensagens Agendadas
            </CardTitle>
            <CardDescription>
              Agende mensagens para envio futuro
            </CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agendar Mensagem
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Agendar Mensagem WhatsApp</DialogTitle>
                <DialogDescription>
                  Escolha quando a mensagem será enviada
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecionar Lead (opcional)</Label>
                  <Select value={formData.lead_id} onValueChange={handleLeadSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.filter(l => l.phone).map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Número de Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="5521999999999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Usar Template (opcional)</Label>
                  <Select value={formData.template_id} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    placeholder="Digite sua mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Data e Hora do Envio</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.phone || !formData.message || !formData.scheduled_at}
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Agendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingMessages.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Enviadas ({sentMessages.length})
            </TabsTrigger>
            <TabsTrigger value="failed" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Falhas ({failedMessages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {pendingMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mensagem agendada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMessages.map((msg) => (
                  <Card key={msg.id} className="bg-secondary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                              Agendado
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(msg.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-1">
                            Para: {formatPhone(msg.phone)}
                            {msg.lead?.name && ` (${msg.lead.name})`}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {msg.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => cancelScheduledMessage(msg.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {sentMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mensagem enviada ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sentMessages.map((msg) => (
                  <Card key={msg.id} className="bg-secondary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600">
                          Enviada
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {msg.sent_at && format(new Date(msg.sent_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        Para: {formatPhone(msg.phone)}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {msg.message}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="failed" className="mt-4">
            {failedMessages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma falha registrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {failedMessages.map((msg) => (
                  <Card key={msg.id} className="bg-secondary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-red-500/10 text-red-600">
                              Falhou
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">
                            Para: {formatPhone(msg.phone)}
                          </p>
                          {msg.error_message && (
                            <p className="text-sm text-red-500 mb-2">
                              Erro: {msg.error_message}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {msg.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteScheduledMessage(msg.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
