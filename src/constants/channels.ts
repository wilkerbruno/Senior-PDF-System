import { Mail, Smartphone, MessageCircle, Bell, MessageSquare, LucideIcon } from 'lucide-react';
import { Channel } from '@/types/crm';

export interface ChannelConfig {
  id: Channel;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export const CHANNELS: Record<Channel, ChannelConfig> = {
  email: {
    id: 'email',
    icon: Mail,
    label: 'Email',
    description: 'Marketing por email com templates personalizados',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  sms: {
    id: 'sms',
    icon: Smartphone,
    label: 'SMS',
    description: 'Mensagens de texto diretas e objetivas',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  whatsapp: {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    description: 'Comunicação instantânea via WhatsApp Business',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  push: {
    id: 'push',
    icon: Bell,
    label: 'Push',
    description: 'Notificações push para apps e browsers',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  rcs: {
    id: 'rcs',
    icon: MessageSquare,
    label: 'RCS',
    description: 'Rich Communication Services - SMS avançado',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
};

export const CHANNEL_LIST = Object.values(CHANNELS);

export const getChannelConfig = (channel: Channel): ChannelConfig => CHANNELS[channel];
