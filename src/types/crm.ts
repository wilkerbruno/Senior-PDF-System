export type Channel = 'email' | 'sms' | 'whatsapp' | 'push' | 'rcs';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  tags: string[];
  source: string;
  status: 'new' | 'engaged' | 'converted' | 'inactive';
  createdAt: Date;
  lastContact?: Date;
}

export interface Campaign {
  id: string;
  name: string;
  channel: Channel;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  subject?: string;
  content: string;
  targetLeads: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  scheduledAt?: Date;
  createdAt: Date;
}

export interface ChannelStats {
  channel: Channel;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  ctr: number;
}

export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  campaignsSent: number;
  averageCTR: number;
  conversions: number;
  revenue: number;
}

export interface Message {
  id: string;
  campaignId: string;
  leadId: string;
  channel: Channel;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
}
