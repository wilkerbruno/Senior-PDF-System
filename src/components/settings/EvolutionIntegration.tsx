import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, Copy, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface EvolutionConfig {
  id?: string;
  instance_name: string;
  api_url: string;
  api_key: string;
  webhook_enabled: boolean;
}

export function EvolutionIntegration() {
  const { user } = useAuthContext();
  const [config, setConfig] = useState<EvolutionConfig>({
    instance_name: "",
    api_url: "",
    api_key: "",
    webhook_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/evolution-webhook`;

  useEffect(() => {
    if (user) {
      loadConfig();
      loadMessageCount();
    }
  }, [user]);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("evolution_config")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setConfig({
          id: data.id,
          instance_name: data.instance_name,
          api_url: data.api_url,
          api_key: data.api_key,
          webhook_enabled: data.webhook_enabled,
        });
      }
    } catch (error) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageCount = async () => {
    try {
      const { count } = await supabase
        .from("whatsapp_messages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);

      setMessageCount(count || 0);
    } catch (error) {
      console.error("Error loading message count:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!config.instance_name || !config.api_url || !config.api_key) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        instance_name: config.instance_name,
        api_url: config.api_url,
        api_key: config.api_key,
        webhook_enabled: config.webhook_enabled,
      };

      if (config.id) {
        const { error } = await supabase
          .from("evolution_config")
          .update(payload)
          .eq("id", config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("evolution_config")
          .insert(payload);
        if (error) throw error;
      }

      toast.success("Configuração salva com sucesso!");
      loadConfig();
    } catch (error: any) {
      console.error("Error saving config:", error);
      toast.error(error.message || "Erro ao salvar configuração");
    } finally {
      setIsSaving(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success("URL copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const testConnection = async () => {
    if (!config.api_url || !config.api_key) {
      toast.error("Configure a URL e API Key primeiro");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${config.api_url}/instance/fetchInstances`, {
        headers: {
          apikey: config.api_key,
        },
      });

      if (response.ok) {
        toast.success("Conexão estabelecida com sucesso!");
      } else {
        toast.error("Falha na conexão. Verifique as credenciais.");
      }
    } catch (error) {
      toast.error("Erro ao conectar. Verifique a URL.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !config.instance_name) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>Evolution API</CardTitle>
                <CardDescription>
                  Integração com WhatsApp via Evolution API
                </CardDescription>
              </div>
            </div>
            <Badge variant={config.id ? "default" : "secondary"}>
              {config.id ? "Configurado" : "Não configurado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instance_name">Nome da Instância *</Label>
              <Input
                id="instance_name"
                placeholder="minha-instancia"
                value={config.instance_name}
                onChange={(e) =>
                  setConfig({ ...config, instance_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api_url">URL da API *</Label>
              <Input
                id="api_url"
                placeholder="https://sua-evolution-api.com"
                value={config.api_url}
                onChange={(e) =>
                  setConfig({ ...config, api_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api_key">API Key *</Label>
            <Input
              id="api_key"
              type="password"
              placeholder="Sua chave de API"
              value={config.api_key}
              onChange={(e) =>
                setConfig({ ...config, api_key: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="space-y-0.5">
              <Label>Webhook Ativo</Label>
              <p className="text-sm text-muted-foreground">
                Receber mensagens automaticamente
              </p>
            </div>
            <Switch
              checked={config.webhook_enabled}
              onCheckedChange={(checked) =>
                setConfig({ ...config, webhook_enabled: checked })
              }
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Configuração
            </Button>
            <Button variant="outline" onClick={testConnection} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Testar Conexão
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuração do Webhook</CardTitle>
          <CardDescription>
            Configure este URL no seu Evolution API para receber mensagens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={webhookUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyWebhookUrl}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Eventos recomendados:</strong> messages.upsert,
              messages.update
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{messageCount}</p>
              <p className="text-sm text-muted-foreground">
                Mensagens recebidas
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadMessageCount}
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
