import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Plus, Edit2, Trash2, Loader2, Power, Clock, MessageSquare } from 'lucide-react';
import { useWhatsAppChatbot, ChatbotRule } from '@/hooks/useWhatsAppChatbot';

export function ChatbotConfig() {
  const { config, rules, isLoading, createOrUpdateConfig, toggleChatbot, addRule, updateRule, deleteRule } = useWhatsAppChatbot();
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ChatbotRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [configForm, setConfigForm] = useState({
    welcome_message: '',
    fallback_message: 'Obrigado pelo contato! Em breve retornaremos.',
    business_hours_start: '09:00',
    business_hours_end: '18:00',
    out_of_hours_message: 'Estamos fora do horário de atendimento. Retornaremos em breve!',
  });

  const [ruleForm, setRuleForm] = useState({
    trigger_keywords: '',
    response: '',
    match_type: 'contains',
    priority: 0,
    is_active: true,
  });

  useEffect(() => {
    if (config) {
      setConfigForm({
        welcome_message: config.welcome_message || '',
        fallback_message: config.fallback_message,
        business_hours_start: config.business_hours_start,
        business_hours_end: config.business_hours_end,
        out_of_hours_message: config.out_of_hours_message,
      });
    }
  }, [config]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    await createOrUpdateConfig({
      ...configForm,
      welcome_message: configForm.welcome_message || null,
    });
    setIsSaving(false);
  };

  const handleToggleChatbot = async (enabled: boolean) => {
    await toggleChatbot(enabled);
  };

  const handleSubmitRule = async () => {
    const keywords = ruleForm.trigger_keywords.split(',').map(k => k.trim()).filter(Boolean);
    
    if (editingRule) {
      await updateRule(editingRule.id, {
        trigger_keywords: keywords,
        response: ruleForm.response,
        match_type: ruleForm.match_type,
        priority: ruleForm.priority,
        is_active: ruleForm.is_active,
      });
    } else {
      await addRule({
        trigger_keywords: keywords,
        response: ruleForm.response,
        match_type: ruleForm.match_type,
        priority: ruleForm.priority,
        is_active: ruleForm.is_active,
      });
    }

    resetRuleForm();
  };

  const resetRuleForm = () => {
    setRuleForm({
      trigger_keywords: '',
      response: '',
      match_type: 'contains',
      priority: 0,
      is_active: true,
    });
    setEditingRule(null);
    setIsRuleDialogOpen(false);
  };

  const handleEditRule = (rule: ChatbotRule) => {
    setEditingRule(rule);
    setRuleForm({
      trigger_keywords: rule.trigger_keywords.join(', '),
      response: rule.response,
      match_type: rule.match_type,
      priority: rule.priority,
      is_active: rule.is_active,
    });
    setIsRuleDialogOpen(true);
  };

  const handleDeleteRule = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta regra?')) {
      await deleteRule(id);
    }
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
    <div className="space-y-6">
      {/* Main Config Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chatbot WhatsApp
              </CardTitle>
              <CardDescription>
                Configure respostas automáticas para mensagens recebidas
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {config?.is_enabled ? 'Ativo' : 'Desativado'}
              </span>
              <Switch
                checked={config?.is_enabled || false}
                onCheckedChange={handleToggleChatbot}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-lg ${config?.is_enabled ? 'bg-green-500/10' : 'bg-secondary/50'}`}>
            <Power className={`h-5 w-5 ${config?.is_enabled ? 'text-green-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-medium">
                {config?.is_enabled ? 'Chatbot está ativo' : 'Chatbot está desativado'}
              </p>
              <p className="text-sm text-muted-foreground">
                {config?.is_enabled 
                  ? 'Mensagens recebidas serão respondidas automaticamente'
                  : 'Ative para começar a responder automaticamente'
                }
              </p>
            </div>
          </div>

          {/* Messages Config */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="welcome">Mensagem de Boas-vindas</Label>
              <Textarea
                id="welcome"
                placeholder="Olá! Seja bem-vindo(a)! Como posso ajudar?"
                value={configForm.welcome_message}
                onChange={(e) => setConfigForm({ ...configForm, welcome_message: e.target.value })}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                Enviada quando um novo contato inicia conversa
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback">Mensagem Padrão</Label>
              <Textarea
                id="fallback"
                placeholder="Obrigado pelo contato! Em breve retornaremos."
                value={configForm.fallback_message}
                onChange={(e) => setConfigForm({ ...configForm, fallback_message: e.target.value })}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                Enviada quando nenhuma regra corresponder
              </p>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário de Atendimento
            </Label>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="hours_start">Início</Label>
                <Input
                  id="hours_start"
                  type="time"
                  value={configForm.business_hours_start}
                  onChange={(e) => setConfigForm({ ...configForm, business_hours_start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours_end">Fim</Label>
                <Input
                  id="hours_end"
                  type="time"
                  value={configForm.business_hours_end}
                  onChange={(e) => setConfigForm({ ...configForm, business_hours_end: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="out_of_hours">Mensagem Fora do Horário</Label>
                <Input
                  id="out_of_hours"
                  placeholder="Estamos fechados..."
                  value={configForm.out_of_hours_message}
                  onChange={(e) => setConfigForm({ ...configForm, out_of_hours_message: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveConfig} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      {/* Rules Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Regras de Resposta
              </CardTitle>
              <CardDescription>
                Configure palavras-chave e respostas automáticas
              </CardDescription>
            </div>
            <Dialog open={isRuleDialogOpen} onOpenChange={(open) => {
              if (!open) resetRuleForm();
              setIsRuleDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2" disabled={!config}>
                  <Plus className="h-4 w-4" />
                  Nova Regra
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? 'Editar Regra' : 'Nova Regra de Resposta'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure palavras-chave que acionam uma resposta automática
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <Input
                      id="keywords"
                      placeholder="preço, valor, quanto custa"
                      value={ruleForm.trigger_keywords}
                      onChange={(e) => setRuleForm({ ...ruleForm, trigger_keywords: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separe múltiplas palavras por vírgula
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="match_type">Tipo de Correspondência</Label>
                    <Select
                      value={ruleForm.match_type}
                      onValueChange={(value) => setRuleForm({ ...ruleForm, match_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contains">Contém</SelectItem>
                        <SelectItem value="exact">Exata</SelectItem>
                        <SelectItem value="starts_with">Começa com</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="response">Resposta</Label>
                    <Textarea
                      id="response"
                      placeholder="Digite a resposta automática..."
                      value={ruleForm.response}
                      onChange={(e) => setRuleForm({ ...ruleForm, response: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="priority">Prioridade</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="0"
                        value={ruleForm.priority}
                        onChange={(e) => setRuleForm({ ...ruleForm, priority: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        id="is_active"
                        checked={ruleForm.is_active}
                        onCheckedChange={(checked) => setRuleForm({ ...ruleForm, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Ativa</Label>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={resetRuleForm}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmitRule}
                    disabled={!ruleForm.trigger_keywords || !ruleForm.response}
                  >
                    {editingRule ? 'Salvar' : 'Criar Regra'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!config ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Salve as configurações primeiro para adicionar regras</p>
            </div>
          ) : rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma regra configurada</p>
              <p className="text-sm">Adicione regras para respostas automáticas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <Card key={rule.id} className={`bg-secondary/20 ${!rule.is_active ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {rule.trigger_keywords.map((keyword, i) => (
                            <Badge key={i} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            {rule.match_type === 'contains' ? 'Contém' : 
                             rule.match_type === 'exact' ? 'Exata' : 'Começa com'}
                          </Badge>
                          {!rule.is_active && (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                              Inativa
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {rule.response}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
