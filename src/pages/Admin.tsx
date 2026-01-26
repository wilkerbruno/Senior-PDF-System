import { Users, Shield, ShieldCheck, UserCog, Loader2, Plus, X } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common';
import { StatsCard } from '@/components/common/StatsCard';
import { SendNotificationDialog } from '@/components/admin/SendNotificationDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useAuthContext } from '@/contexts/AuthContext';
import { AppRole } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatters';

const ROLE_CONFIG: Record<AppRole, { label: string; icon: typeof Shield; variant: 'default' | 'secondary' | 'outline' }> = {
  admin: { label: 'Admin', icon: ShieldCheck, variant: 'default' },
  moderator: { label: 'Moderador', icon: Shield, variant: 'secondary' },
  user: { label: 'Usuário', icon: UserCog, variant: 'outline' },
};

const ALL_ROLES: AppRole[] = ['admin', 'moderator', 'user'];

export default function Admin() {
  const { users, isLoading, addRole, removeRole } = useAdminUsers();
  const { user: currentUser } = useAuthContext();

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.roles.includes('admin')).length,
    moderators: users.filter((u) => u.roles.includes('moderator')).length,
  };

  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.[0]?.toUpperCase() || 'U';
  };

  const getAvailableRoles = (userRoles: AppRole[]) => {
    return ALL_ROLES.filter((role) => !userRoles.includes(role));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Administração"
        description="Gerencie usuários, permissões e envie notificações"
        actions={
          <SendNotificationDialog 
            users={users.map(u => ({ 
              id: u.id, 
              email: u.email, 
              full_name: u.full_name, 
              roles: u.roles 
            }))} 
          />
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Total de Usuários"
          value={stats.total}
          icon={Users}
          iconColor="text-primary"
        />
        <StatsCard
          label="Administradores"
          value={stats.admins}
          icon={ShieldCheck}
          iconColor="text-success"
        />
        <StatsCard
          label="Moderadores"
          value={stats.moderators}
          icon={Shield}
          iconColor="text-warning"
        />
      </div>

      {/* Users Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuários
          </CardTitle>
          <CardDescription>
            Gerencie as roles e permissões de cada usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isCurrentUser = user.id === currentUser?.id;
                const availableRoles = getAvailableRoles(user.roles);

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(user.full_name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name || 'Sem nome'}</p>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">Você</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => {
                          const config = ROLE_CONFIG[role];
                          const Icon = config.icon;
                          return (
                            <Badge
                              key={role}
                              variant={config.variant}
                              className="gap-1 pr-1"
                            >
                              <Icon className="w-3 h-3" />
                              {config.label}
                              {!isCurrentUser && user.roles.length > 1 && (
                                <button
                                  onClick={() => removeRole(user.id, role)}
                                  className="ml-1 hover:bg-background/20 rounded p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(new Date(user.created_at))}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isCurrentUser && availableRoles.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Plus className="w-3 h-3" />
                              Role
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {availableRoles.map((role) => {
                              const config = ROLE_CONFIG[role];
                              const Icon = config.icon;
                              return (
                                <DropdownMenuItem
                                  key={role}
                                  onClick={() => addRole(user.id, role)}
                                >
                                  <Icon className="w-4 h-4 mr-2" />
                                  Adicionar {config.label}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}
