import { Lead, Campaign } from '@/types/crm';

export interface StatusConfig {
  label: string;
  color: string;
  description?: string;
}

export const LEAD_STATUSES: Record<Lead['status'], StatusConfig> = {
  new: {
    label: 'Novo',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Lead recém-cadastrado, ainda não contatado',
  },
  engaged: {
    label: 'Engajado',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Lead interagiu com campanhas ou conteúdo',
  },
  converted: {
    label: 'Convertido',
    color: 'bg-success/20 text-success border-success/30',
    description: 'Lead realizou a ação desejada (compra, cadastro, etc)',
  },
  inactive: {
    label: 'Inativo',
    color: 'bg-muted text-muted-foreground border-border',
    description: 'Lead sem interação por período prolongado',
  },
};

export const CAMPAIGN_STATUSES: Record<Campaign['status'], StatusConfig> = {
  draft: {
    label: 'Rascunho',
    color: 'bg-muted text-muted-foreground',
    description: 'Campanha em edição, não enviada',
  },
  scheduled: {
    label: 'Agendada',
    color: 'bg-blue-500/20 text-blue-400',
    description: 'Campanha programada para envio futuro',
  },
  active: {
    label: 'Ativa',
    color: 'bg-success/20 text-success',
    description: 'Campanha em execução',
  },
  paused: {
    label: 'Pausada',
    color: 'bg-warning/20 text-warning',
    description: 'Campanha temporariamente interrompida',
  },
  completed: {
    label: 'Concluída',
    color: 'bg-muted text-muted-foreground',
    description: 'Campanha finalizada',
  },
};

export const getLeadStatusConfig = (status: Lead['status']): StatusConfig => LEAD_STATUSES[status];
export const getCampaignStatusConfig = (status: Campaign['status']): StatusConfig => CAMPAIGN_STATUSES[status];
