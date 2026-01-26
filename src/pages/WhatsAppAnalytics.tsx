import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageCircle, TrendingUp, Clock, Users, Search, RefreshCw, ArrowUpDown, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { SendMessageDialog } from '@/components/whatsapp/SendMessageDialog';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadEngagement {
  lead_id: string | null;
  lead_name: string | null;
  lead_phone: string;
  total_messages: number;
  messages_sent: number;
  messages_received: number;
  last_message_at: string;
  engagement_score: number;
}

const WhatsAppAnalytics = () => {
  const { user } = useAuthContext();
  const [engagements, setEngagements] = useState<LeadEngagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'total' | 'recent' | 'score'>('recent');

  // Stats
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalConversations: 0,
    avgMessagesPerLead: 0,
    activeToday: 0,
  });

  useEffect(() => {
    if (user) {
      fetchEngagementData();
    }
  }, [user, sortBy]);

  const fetchEngagementData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch messages grouped by contact
      const { data: messages, error } = await supabase
        .from('whatsapp_messages')
        .select(`
          remote_jid,
          content,
          from_me,
          timestamp,
          lead_id,
          leads (
            id,
            name,
            phone
          )
        `)
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Process and group by contact
      const grouped = new Map<string, LeadEngagement>();

      messages?.forEach((msg) => {
        const phone = msg.remote_jid.replace('@s.whatsapp.net', '');
        const lead = msg.leads as { id: string; name: string; phone: string } | null;

        if (!grouped.has(phone)) {
          grouped.set(phone, {
            lead_id: lead?.id || null,
            lead_name: lead?.name || null,
            lead_phone: phone,
            total_messages: 0,
            messages_sent: 0,
            messages_received: 0,
            last_message_at: msg.timestamp,
            engagement_score: 0,
          });
        }

        const entry = grouped.get(phone)!;
        entry.total_messages++;
        if (msg.from_me) {
          entry.messages_sent++;
        } else {
          entry.messages_received++;
        }
      });

      // Calculate engagement scores
      const engagementList = Array.from(grouped.values()).map(e => {
        // Score based on: total messages, balance of conversation, recency
        const balanceScore = Math.min(e.messages_sent, e.messages_received) / Math.max(e.messages_sent, e.messages_received, 1);
        const volumeScore = Math.min(e.total_messages / 10, 1);
        const recencyScore = (Date.now() - new Date(e.last_message_at).getTime()) < 86400000 ? 1 : 0.5;
        e.engagement_score = Math.round((balanceScore * 30 + volumeScore * 40 + recencyScore * 30));
        return e;
      });

      // Sort
      if (sortBy === 'total') {
        engagementList.sort((a, b) => b.total_messages - a.total_messages);
      } else if (sortBy === 'recent') {
        engagementList.sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime());
      } else {
        engagementList.sort((a, b) => b.engagement_score - a.engagement_score);
      }

      setEngagements(engagementList);

      // Calculate stats
      const today = new Date().toDateString();
      setStats({
        totalMessages: messages?.length || 0,
        totalConversations: engagementList.length,
        avgMessagesPerLead: engagementList.length > 0 
          ? Math.round((messages?.length || 0) / engagementList.length) 
          : 0,
        activeToday: engagementList.filter(e => 
          new Date(e.last_message_at).toDateString() === today
        ).length,
      });

    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEngagements = engagements.filter(e => 
    e.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lead_phone.includes(searchTerm)
  );

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500/20 text-green-400';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <MainLayout>
      <PageHeader 
        title="WhatsApp Analytics" 
        description="Métricas de engajamento por lead via WhatsApp"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total de Mensagens</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
                <p className="text-sm text-muted-foreground">Conversas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgMessagesPerLead}</p>
                <p className="text-sm text-muted-foreground">Média por Lead</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
                <p className="text-sm text-muted-foreground">Ativos Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Table */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle>Engajamento por Lead</CardTitle>
              <CardDescription>Análise de conversas e interações</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48 bg-secondary/30"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-40 bg-secondary/30">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais Recente</SelectItem>
                  <SelectItem value="total">Mais Mensagens</SelectItem>
                  <SelectItem value="score">Maior Score</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={fetchEngagementData}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead className="text-center">Mensagens</TableHead>
                <TableHead className="text-center">Enviadas</TableHead>
                <TableHead className="text-center">Recebidas</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Última Mensagem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredEngagements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum dado de engajamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredEngagements.map((engagement) => (
                  <TableRow key={engagement.lead_phone}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {engagement.lead_name || 'Contato Desconhecido'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {engagement.lead_phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {engagement.total_messages}
                    </TableCell>
                    <TableCell className="text-center text-green-400">
                      {engagement.messages_sent}
                    </TableCell>
                    <TableCell className="text-center text-blue-400">
                      {engagement.messages_received}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getScoreColor(engagement.engagement_score)}>
                        {engagement.engagement_score}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(engagement.last_message_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <SendMessageDialog
                        defaultPhone={engagement.lead_phone}
                        leadName={engagement.lead_name || undefined}
                        trigger={
                          <Button size="sm" variant="ghost">
                            <Send className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default WhatsAppAnalytics;
