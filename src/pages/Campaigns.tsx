import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader, ChannelIcon, CampaignStatusBadge, EmptyState, PageSkeleton } from '@/components/common';
import { useSupabaseCampaigns } from '@/hooks/useSupabaseCampaigns';
import { formatNumber, formatDate, calculateProgress } from '@/utils/formatters';
import { CHANNEL_LIST, getChannelConfig } from '@/constants/channels';
import { Button } from '@/components/ui/button';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Users,
  MousePointerClick,
  TrendingUp,
  Play,
  Pause,
  MoreHorizontal,
  Send,
} from 'lucide-react';

const Campaigns = () => {
  const { campaigns, allCampaigns, filters, isLoading, updateChannelFilter, createCampaign } = useSupabaseCampaigns();

  return (
    <MainLayout>
      <PageHeader
        title="Campanhas"
        description="Crie e gerencie campanhas multicanal"
        actions={<CampaignForm onSubmit={createCampaign} />}
      />

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filters.channel === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateChannelFilter('all')}
          className={filters.channel === 'all' ? 'bg-primary' : ''}
        >
          Todas
        </Button>
        {CHANNEL_LIST.map((channel) => {
          const isActive = filters.channel === channel.id;
          return (
            <Button
              key={channel.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateChannelFilter(channel.id)}
              className={cn('gap-2', isActive && 'bg-primary')}
            >
              <ChannelIcon
                channel={channel.id}
                size="sm"
                showBackground={false}
                className={isActive ? 'text-primary-foreground' : ''}
              />
              <span>{channel.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Campaigns Grid */}
      {isLoading ? (
        <PageSkeleton variant="cards" />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nenhuma campanha encontrada"
          description="Crie sua primeira campanha para começar a engajar seus leads."
          action={{
            label: 'Criar Campanha',
            onClick: () => document.querySelector<HTMLButtonElement>('[data-campaign-form-trigger]')?.click(),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => {
            const channelConfig = getChannelConfig(campaign.channel);
            const progress = campaign.delivered > 0 ? calculateProgress(campaign.delivered, campaign.sent) : 0;
            const clickRate = campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0;
            const conversionRate = campaign.sent > 0 ? Math.round((campaign.converted / campaign.sent) * 100) : 0;

            return (
              <article
                key={campaign.id}
                className="glass-card rounded-xl p-5 opacity-0 animate-fade-in hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ChannelIcon channel={campaign.channel} />
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {campaign.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {channelConfig.label}
                      </p>
                    </div>
                  </div>
                  <CampaignStatusBadge status={campaign.status} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs">Enviados</span>
                    </div>
                    <p className="font-semibold text-card-foreground">
                      {formatNumber(campaign.sent)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      <span className="text-xs">CTR</span>
                    </div>
                    <p className="font-semibold text-primary">{clickRate}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-xs">Conversão</span>
                    </div>
                    <p className="font-semibold text-success">
                      {conversionRate}%
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Entregues</span>
                    <span className="text-card-foreground">
                      {formatNumber(campaign.delivered)} / {formatNumber(campaign.sent)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(new Date(campaign.scheduled_at || campaign.created_at))}</span>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === 'active' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {(campaign.status === 'draft' || campaign.status === 'paused') && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default Campaigns;
