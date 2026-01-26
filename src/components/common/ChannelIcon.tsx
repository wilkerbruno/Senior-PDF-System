import { cn } from '@/lib/utils';
import { Channel } from '@/types/crm';
import { getChannelConfig } from '@/constants/channels';

interface ChannelIconProps {
  channel: Channel;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { icon: 'h-4 w-4', container: 'p-1.5 rounded-md' },
  md: { icon: 'h-5 w-5', container: 'p-2.5 rounded-lg' },
  lg: { icon: 'h-6 w-6', container: 'p-3 rounded-xl' },
};

export function ChannelIcon({
  channel,
  size = 'md',
  showBackground = true,
  className,
}: ChannelIconProps) {
  const config = getChannelConfig(channel);
  const Icon = config.icon;
  const sizes = sizeClasses[size];

  if (showBackground) {
    return (
      <div className={cn(sizes.container, config.bgColor, className)}>
        <Icon className={cn(sizes.icon, config.color)} />
      </div>
    );
  }

  return <Icon className={cn(sizes.icon, config.color, className)} />;
}
