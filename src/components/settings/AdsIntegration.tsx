import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, ExternalLink, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdsIntegrationProps {
  platform: 'meta' | 'google';
}

export function AdsIntegration({ platform }: AdsIntegrationProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  const config = platform === 'meta' ? {
    title: 'Meta Ads (Facebook/Instagram)',
    description: 'Conecte sua conta Meta Business para criar públicos lookalike automaticamente',
    icon: '📘',
    fields: [
      { id: 'access_token', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxxxxxxxx', type: 'password' },
      { id: 'ad_account_id', label: 'Ad Account ID', placeholder: 'act_123456789', type: 'text' },
      { id: 'pixel_id', label: 'Pixel ID (opcional)', placeholder: '123456789012345', type: 'text' },
    ],
    features: ['Públicos Lookalike', 'Custom Audiences', 'Conversões API'],
    docsUrl: 'https://developers.facebook.com/docs/marketing-api',
  } : {
    title: 'Google Ads',
    description: 'Conecte sua conta Google Ads para sincronizar metas e campanhas',
    icon: '🔍',
    fields: [
      { id: 'client_id', label: 'Client ID', placeholder: 'xxxx.apps.googleusercontent.com', type: 'text' },
      { id: 'client_secret', label: 'Client Secret', placeholder: 'GOCSPX-xxxxxx', type: 'password' },
      { id: 'customer_id', label: 'Customer ID', placeholder: '123-456-7890', type: 'text' },
      { id: 'developer_token', label: 'Developer Token', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
    features: ['Sincronizar Metas', 'Customer Match', 'Conversões Offline'],
    docsUrl: 'https://developers.google.com/google-ads/api',
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulated test
    await new Promise(r => setTimeout(r, 1500));
    setIsConnected(true);
    setIsTesting(false);
    toast({
      title: 'Conexão bem-sucedida!',
      description: `Conectado ao ${config.title}`,
    });
  };

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'As credenciais foram salvas com sucesso.',
    });
  };

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <CardTitle className="text-lg">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge className="bg-green-500/20 text-green-400 gap-1">
                <CheckCircle className="h-3 w-3" /> Conectado
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" /> Desconectado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {config.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`${platform}-${field.id}`}>{field.label}</Label>
              <Input
                id={`${platform}-${field.id}`}
                type={field.type}
                placeholder={field.placeholder}
                className="bg-secondary/30 border-border"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Label>Funcionalidades</Label>
          <div className="flex flex-wrap gap-2">
            {config.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border">
                <Switch defaultChecked />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleTestConnection}
            disabled={isTesting}
          >
            <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
            Testar Conexão
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-primary to-accent" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button variant="ghost" className="gap-2 ml-auto" asChild>
            <a href={config.docsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Documentação
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
