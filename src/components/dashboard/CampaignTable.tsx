import { DbCampaign } from '@/hooks/useSupabaseCampaigns';
import { ChannelIcon, CampaignStatusBadge } from '@/components/common';
import { getChannelConfig } from '@/constants/channels';
import { formatNumber, formatDate } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CampaignTableProps {
  campaigns: DbCampaign[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const calculateRate = (part: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  return (
    <section className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-card-foreground">
          Campanhas Recentes
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-muted-foreground">Campanha</TableHead>
            <TableHead className="text-muted-foreground">Canal</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground text-right">Enviados</TableHead>
            <TableHead className="text-muted-foreground text-right">Abertura</TableHead>
            <TableHead className="text-muted-foreground text-right">CTR</TableHead>
            <TableHead className="text-muted-foreground text-right">Conversão</TableHead>
            <TableHead className="text-muted-foreground">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign, index) => {
            const channelConfig = getChannelConfig(campaign.channel);
            const openRate = calculateRate(campaign.opened, campaign.sent);
            const clickRate = calculateRate(campaign.clicked, campaign.sent);
            const conversionRate = calculateRate(campaign.converted, campaign.sent);

            return (
              <TableRow
                key={campaign.id}
                className="border-border hover:bg-muted/30 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <span className="font-medium text-card-foreground">
                    {campaign.name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel={campaign.channel} size="sm" />
                    <span className="text-sm">{channelConfig.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <CampaignStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(campaign.sent)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-primary">{openRate}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-accent">{clickRate}%</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-success">{conversionRate}%</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(new Date(campaign.created_at))}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
