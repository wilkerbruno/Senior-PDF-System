import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialAdsIntegration } from '@/components/settings/SocialAdsIntegration';
import { AdsIntegration } from '@/components/settings/AdsIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdsIntegrations = () => {
  return (
    <MainLayout>
      <PageHeader 
        title="Integrações de Ads" 
        description="Configure suas integrações com plataformas de publicidade"
      />

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-card border border-border flex-wrap h-auto">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="meta">Meta</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          <TabsTrigger value="kwai">Kwai</TabsTrigger>
          <TabsTrigger value="twitter">X (Twitter)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Todas as Plataformas</CardTitle>
              <CardDescription>
                Gerencie todas as suas integrações de publicidade em um só lugar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <IntegrationCard
                  icon="📘"
                  title="Meta Ads"
                  description="Facebook & Instagram"
                  status="available"
                />
                <IntegrationCard
                  icon="🔍"
                  title="Google Ads"
                  description="Search, Display & YouTube"
                  status="available"
                />
                <IntegrationCard
                  icon="🎵"
                  title="TikTok Ads"
                  description="TikTok for Business"
                  status="available"
                />
                <IntegrationCard
                  icon="📱"
                  title="Kwai Ads"
                  description="Kwai for Business"
                  status="available"
                />
                <IntegrationCard
                  icon="𝕏"
                  title="X (Twitter) Ads"
                  description="X Ads Platform"
                  status="available"
                />
                <IntegrationCard
                  icon="👻"
                  title="Snapchat Ads"
                  description="Em breve"
                  status="coming"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="space-y-6">
          <AdsIntegration platform="meta" />
        </TabsContent>

        <TabsContent value="google" className="space-y-6">
          <AdsIntegration platform="google" />
        </TabsContent>

        <TabsContent value="tiktok" className="space-y-6">
          <SocialAdsIntegration platform="tiktok" />
        </TabsContent>

        <TabsContent value="kwai" className="space-y-6">
          <SocialAdsIntegration platform="kwai" />
        </TabsContent>

        <TabsContent value="twitter" className="space-y-6">
          <SocialAdsIntegration platform="twitter" />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

function IntegrationCard({ 
  icon, 
  title, 
  description, 
  status 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  status: 'available' | 'coming' | 'connected';
}) {
  return (
    <div className={`p-4 rounded-xl border border-border bg-secondary/20 ${status === 'coming' ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {status === 'coming' && (
          <span className="text-xs bg-muted px-2 py-1 rounded">Em breve</span>
        )}
      </div>
    </div>
  );
}

export default AdsIntegrations;
