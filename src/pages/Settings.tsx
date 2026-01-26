import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader, ChannelIcon } from '@/components/common';
import { CHANNEL_LIST } from '@/constants/channels';
import { AdsIntegration } from '@/components/settings/AdsIntegration';
import { EvolutionIntegration } from '@/components/settings/EvolutionIntegration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Globe, Shield, Webhook, Save, Megaphone, MessageSquare } from 'lucide-react';

const CHANNEL_ENABLED: Record<string, boolean> = {
  email: true, sms: true, whatsapp: true, push: false, rcs: false,
};

const WEBHOOK_EVENTS = ['message.sent', 'message.delivered', 'message.opened', 'message.clicked', 'lead.created', 'lead.converted'];

const SECURITY_OPTIONS = [
  { id: '2fa', title: 'Autenticação de Dois Fatores', description: 'Adicione uma camada extra de segurança', enabled: false },
  { id: 'login-alerts', title: 'Notificações de Login', description: 'Receba alertas sobre novos logins', enabled: true },
  { id: 'ip-whitelist', title: 'IP Whitelist', description: 'Restrinja acesso por endereço IP', enabled: false },
  { id: 'audit-logs', title: 'Logs de Auditoria', description: 'Registre todas as ações do sistema', enabled: true },
];

const Settings = () => {
  return (
    <MainLayout>
      <PageHeader title="Configurações" description="Gerencie integrações e preferências do sistema" />

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="bg-card border border-border flex-wrap h-auto">
          <TabsTrigger value="channels" className="gap-2"><Globe className="h-4 w-4" />Canais</TabsTrigger>
          <TabsTrigger value="ads" className="gap-2"><Megaphone className="h-4 w-4" />Ads</TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2"><MessageSquare className="h-4 w-4" />WhatsApp</TabsTrigger>
          <TabsTrigger value="api" className="gap-2"><Key className="h-4 w-4" />API Keys</TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2"><Webhook className="h-4 w-4" />Webhooks</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" />Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Canais de Comunicação</h3>
            <p className="text-sm text-muted-foreground mb-6">Ative e configure os canais de comunicação para suas campanhas</p>
            <div className="space-y-4">
              {CHANNEL_LIST.map((channel, i) => (
                <div key={channel.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border opacity-0 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-4">
                    <ChannelIcon channel={channel.id} size="lg" />
                    <div>
                      <h4 className="font-medium text-card-foreground">{channel.label}</h4>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch defaultChecked={CHANNEL_ENABLED[channel.id]} />
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Integrações de Publicidade</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure suas contas de anúncios para criar públicos lookalike e sincronizar metas automaticamente
              </p>
            </div>
            <AdsIntegration platform="meta" />
            <AdsIntegration platform="google" />
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <EvolutionIntegration />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Chaves de API</h3>
            <p className="text-sm text-muted-foreground mb-6">Gerencie suas chaves de API para integrações externas</p>
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="twilio-sid">Twilio Account SID</Label><Input id="twilio-sid" type="password" placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-secondary/30 border-border" /></div>
              <div className="space-y-2"><Label htmlFor="twilio-token">Twilio Auth Token</Label><Input id="twilio-token" type="password" placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-secondary/30 border-border" /></div>
              <div className="space-y-2"><Label htmlFor="whatsapp-token">WhatsApp Business Token</Label><Input id="whatsapp-token" type="password" placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-secondary/30 border-border" /></div>
              <div className="space-y-2"><Label htmlFor="smtp-host">SMTP Host</Label><Input id="smtp-host" placeholder="smtp.example.com" className="bg-secondary/30 border-border" /></div>
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"><Save className="h-4 w-4" />Salvar Alterações</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Webhooks</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure webhooks para receber eventos em tempo real</p>
            <div className="space-y-4">
              <div className="space-y-2"><Label htmlFor="webhook-url">URL do Webhook</Label><Input id="webhook-url" placeholder="https://seu-dominio.com/webhook" className="bg-secondary/30 border-border" /></div>
              <div className="space-y-3">
                <Label>Eventos</Label>
                <div className="space-y-2">
                  {WEBHOOK_EVENTS.map((event) => (
                    <div key={event} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <span className="text-sm font-mono text-muted-foreground">{event}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
              <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"><Save className="h-4 w-4" />Salvar Webhooks</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Segurança</h3>
            <p className="text-sm text-muted-foreground mb-6">Configure opções de segurança e acesso</p>
            <div className="space-y-4">
              {SECURITY_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div><h4 className="font-medium text-card-foreground">{opt.title}</h4><p className="text-sm text-muted-foreground">{opt.description}</p></div>
                  <Switch defaultChecked={opt.enabled} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
