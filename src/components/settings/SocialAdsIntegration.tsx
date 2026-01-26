import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, ExternalLink, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

type Platform = 'tiktok' | 'kwai' | 'twitter';

interface SocialAdsIntegrationProps {
  platform: Platform;
}

const platformConfigs: Record<Platform, {
  title: string;
  description: string;
  icon: string;
  fields: Array<{ id: string; label: string; placeholder: string; type: string }>;
  features: string[];
  docsUrl: string;
}> = {
  tiktok: {
    title: 'TikTok Ads',
    description: 'Conecte sua conta TikTok for Business para campanhas e conversões',
    icon: '🎵',
    fields: [
      { id: 'access_token', label: 'Access Token', placeholder: 'Seu access token do TikTok', type: 'password' },
      { id: 'account_id', label: 'Advertiser ID', placeholder: '123456789', type: 'text' },
      { id: 'pixel_id', label: 'Pixel ID', placeholder: 'CXXXXXXXXXXXXXXXXX', type: 'text' },
    ],
    features: ['TikTok Pixel', 'Custom Audiences', 'Conversões Offline'],
    docsUrl: 'https://business-api.tiktok.com/portal/docs',
  },
  kwai: {
    title: 'Kwai Ads',
    description: 'Integre com Kwai for Business para campanhas de vídeo',
    icon: '📱',
    fields: [
      { id: 'access_token', label: 'Access Token', placeholder: 'Seu access token do Kwai', type: 'password' },
      { id: 'account_id', label: 'Account ID', placeholder: 'kwai_account_123', type: 'text' },
      { id: 'pixel_id', label: 'Pixel ID (opcional)', placeholder: 'kwai_pixel_123', type: 'text' },
    ],
    features: ['Kwai Pixel', 'Audience Targeting', 'Video Campaigns'],
    docsUrl: 'https://developers.kwai.com/',
  },
  twitter: {
    title: 'X (Twitter) Ads',
    description: 'Conecte sua conta X Ads para campanhas e conversões',
    icon: '𝕏',
    fields: [
      { id: 'access_token', label: 'Bearer Token', placeholder: 'AAAAAAAAAAAAAAAAAAAAAx...', type: 'password' },
      { id: 'account_id', label: 'Ads Account ID', placeholder: '18ce54d4x5t', type: 'text' },
      { id: 'pixel_id', label: 'Conversion ID (opcional)', placeholder: 'o2nxx', type: 'text' },
    ],
    features: ['X Pixel', 'Tailored Audiences', 'Conversion Tracking'],
    docsUrl: 'https://developer.x.com/en/docs/x-ads-api',
  },
};

export function SocialAdsIntegration({ platform }: SocialAdsIntegrationProps) {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});

  const config = platformConfigs[platform];

  useEffect(() => {
    if (user) {
      loadConfig();
    }
  }, [user, platform]);

  const loadConfig = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('ads_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormData({
          access_token: data.access_token || '',
          account_id: data.account_id || '',
          pixel_id: data.pixel_id || '',
        });
        setIsConnected(data.is_connected || false);
        setEnabledFeatures((data.settings as Record<string, boolean>) || {});
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ads_integrations')
        .upsert({
          user_id: user.id,
          platform,
          access_token: formData.access_token,
          account_id: formData.account_id,
          pixel_id: formData.pixel_id,
          is_connected: isConnected,
          settings: enabledFeatures,
        }, {
          onConflict: 'user_id,platform',
        });

      if (error) throw error;

      toast({
        title: 'Configurações salvas',
        description: `Integração ${config.title} atualizada com sucesso.`,
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    // Simulate API test
    await new Promise(r => setTimeout(r, 1500));
    
    if (formData.access_token && formData.account_id) {
      setIsConnected(true);
      toast({
        title: 'Conexão bem-sucedida!',
        description: `Conectado ao ${config.title}`,
      });
    } else {
      toast({
        title: 'Erro na conexão',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
    }
    setIsTesting(false);
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-border">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

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
                value={formData[field.id] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
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
                <Switch 
                  checked={enabledFeatures[feature] || false}
                  onCheckedChange={(checked) => setEnabledFeatures(prev => ({ ...prev, [feature]: checked }))}
                />
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
          <Button 
            className="gap-2 bg-gradient-to-r from-primary to-accent" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
