import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Lead, Campaign } from '@/types/crm';
import { getLeadStatusConfig, getCampaignStatusConfig } from '@/constants/statuses';

interface LeadStatusBadgeProps {
  status: Lead['status'];
  className?: string;
}

interface CampaignStatusBadgeProps {
  status: Campaign['status'];
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const config = getLeadStatusConfig(status);

  return (
    <Badge variant="outline" className={cn('border', config.color, className)}>
      {config.label}
    </Badge>
  );
}

export function CampaignStatusBadge({ status, className }: CampaignStatusBadgeProps) {
  const config = getCampaignStatusConfig(status);

  return (
    <Badge className={cn('border-0', config.color, className)}>
      {config.label}
    </Badge>
  );
}
