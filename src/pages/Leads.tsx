import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader, LeadAvatar, LeadStatusBadge, EmptyState, PageSkeleton, StatsCard } from '@/components/common';
import { useSupabaseLeads, DbLead } from '@/hooks/useSupabaseLeads';
import { formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadActions } from '@/components/leads/LeadActions';
import { CSVImport } from '@/components/leads/CSVImport';
import { GoogleMapsExtraction } from '@/components/leads/GoogleMapsExtraction';
import { TemplateDownloadButton } from '@/components/common/TemplateDownloadButton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Mail,
  Phone,
  MessageCircle,
  Users,
  UserPlus,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Leads = () => {
  const { leads, stats, filters, isLoading, updateSearch, updateLead, deleteLead, refetch } = useSupabaseLeads();
  const { user } = useAuthContext();
  const { toast } = useToast();

  const handleCSVImport = async (
    importedLeads: Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]
  ) => {
    if (!user) return;

    const leadsWithUser = importedLeads.map((lead) => ({
      ...lead,
      user_id: user.id,
    }));

    const { error } = await supabase.from('leads').insert(leadsWithUser);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na importação',
        description: error.message,
      });
      throw error;
    }

    await refetch();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageSkeleton variant="table" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Leads"
        description="Gerencie e segmente sua base de leads"
        actions={
          <div className="flex flex-wrap gap-2">
            <TemplateDownloadButton showAll />
            <GoogleMapsExtraction onImport={handleCSVImport} />
            <CSVImport onImport={handleCSVImport} />
            <LeadForm />
          </div>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          label="Total"
          value={stats.total}
          icon={Users}
          iconColor="text-primary"
        />
        <StatsCard
          label="Novos"
          value={stats.new}
          icon={UserPlus}
          iconColor="text-blue-400"
        />
        <StatsCard
          label="Engajados"
          value={stats.engaged}
          icon={UserCheck}
          iconColor="text-emerald-400"
        />
        <StatsCard
          label="Convertidos"
          value={stats.converted}
          icon={TrendingUp}
          iconColor="text-success"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum lead encontrado"
            description="Adicione seu primeiro lead para começar."
            action={{
              label: 'Adicionar Lead',
              onClick: () => document.querySelector<HTMLButtonElement>('[data-lead-form-trigger]')?.click(),
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Lead</TableHead>
                <TableHead className="text-muted-foreground">Contato</TableHead>
                <TableHead className="text-muted-foreground">Fonte</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Último Contato</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, index) => (
                <TableRow
                  key={lead.id}
                  className="border-border hover:bg-muted/30 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <LeadAvatar name={lead.name} />
                      <div>
                        <p className="font-medium text-card-foreground">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </Button>
                      {lead.phone && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4 text-green-400" />
                        </Button>
                      )}
                      {lead.source === 'whatsapp' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageCircle className="h-4 w-4 text-emerald-400" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground capitalize">{lead.source}</span>
                  </TableCell>
                  <TableCell>
                    <LeadStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {lead.last_contact ? formatDate(new Date(lead.last_contact)) : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <LeadActions
                      lead={lead}
                      onUpdate={updateLead}
                      onDelete={deleteLead}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default Leads;
