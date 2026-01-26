import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CHANNEL_LIST } from '@/constants/channels';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
  LayoutDashboard,
  Users,
  Send,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronLeft,
  Zap,
  MapPin,
  MessageCircle,
  TrendingUp,
  Megaphone,
} from 'lucide-react';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: Send, label: 'Campanhas', path: '/campaigns' },
  { icon: MessageCircle, label: 'WhatsApp', path: '/whatsapp' },
  { icon: TrendingUp, label: 'WhatsApp Analytics', path: '/whatsapp-analytics' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: MapPin, label: 'Analytics RJ', path: '/analytics-rj' },
  { icon: Megaphone, label: 'Ads Integrations', path: '/ads-integrations' },
  { icon: ShieldCheck, label: 'Admin', path: '/admin', adminOnly: true },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold text-sidebar-foreground">
                CRM<span className="gradient-text">Pro</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!collapsed && <NotificationBell />}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 text-sidebar-foreground transition-transform',
                  collapsed && 'rotate-180'
                )}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menu principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Channels */}
        {!collapsed && (
          <div className="px-3 py-4 border-t border-sidebar-border">
            <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Canais
            </h3>
            <div className="space-y-1">
              {CHANNEL_LIST.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                  >
                    <Icon className={cn('h-4 w-4', channel.color)} />
                    <span className="text-sm">{channel.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
              U
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  Usuário Admin
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@crmpro.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
