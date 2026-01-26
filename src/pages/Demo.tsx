import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  ArrowLeft,
  Users,
  Send,
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  Target,
  Download,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for demo
const MOCK_STATS = {
  totalLeads: 12458,
  activeLeads: 8234,
  messagesSent: 45678,
  avgCTR: 12.5,
  conversions: 1234,
  revenue: 156780,
};

const MOCK_CAMPAIGNS = [
  { id: 1, name: 'Black Friday 2024', channel: 'whatsapp', status: 'active', sent: 5000, delivered: 4850, opened: 3200, clicked: 1200, converted: 340 },
  { id: 2, name: 'Newsletter Dezembro', channel: 'email', status: 'completed', sent: 12000, delivered: 11500, opened: 4500, clicked: 1800, converted: 450 },
  { id: 3, name: 'Promoção SMS', channel: 'sms', status: 'scheduled', sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0 },
  { id: 4, name: 'Engajamento Stories', channel: 'instagram', status: 'active', sent: 3500, delivered: 3400, opened: 2100, clicked: 890, converted: 210 },
];

const MOCK_LEADS = [
  { id: 1, name: 'Maria Silva', email: 'maria@exemplo.com', status: 'engaged', source: 'WhatsApp', lastContact: '2024-01-15' },
  { id: 2, name: 'João Santos', email: 'joao@exemplo.com', status: 'new', source: 'Landing Page', lastContact: '2024-01-14' },
  { id: 3, name: 'Ana Costa', email: 'ana@exemplo.com', status: 'converted', source: 'Email', lastContact: '2024-01-13' },
  { id: 4, name: 'Pedro Lima', email: 'pedro@exemplo.com', status: 'engaged', source: 'Instagram', lastContact: '2024-01-12' },
  { id: 5, name: 'Lucia Ferreira', email: 'lucia@exemplo.com', status: 'inactive', source: 'SMS', lastContact: '2024-01-10' },
];

const CHANNEL_ICONS = {
  whatsapp: MessageSquare,
  email: Mail,
  sms: Phone,
  instagram: Instagram,
};

const STATUS_COLORS = {
  active: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary',
  scheduled: 'bg-warning/10 text-warning',
  paused: 'bg-muted text-muted-foreground',
};

const LEAD_STATUS_COLORS = {
  new: 'bg-primary/10 text-primary',
  engaged: 'bg-success/10 text-success',
  converted: 'bg-accent/10 text-accent',
  inactive: 'bg-muted text-muted-foreground',
};

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const generateDemoHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRM Marketing - Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f1419; color: #e7e9ea; }
    .gradient-text { background: linear-gradient(135deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gradient-bg { background: linear-gradient(135deg, #0ea5e9, #8b5cf6); }
    .card { background: rgba(32, 41, 53, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
    .stat-card { background: linear-gradient(180deg, rgba(32, 41, 53, 0.9), rgba(32, 41, 53, 0.7)); }
  </style>
</head>
<body class="min-h-screen p-8">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold">CRM Marketing</h1>
          <p class="text-gray-400 text-sm">Demo Interativa</p>
        </div>
      </div>
      <span class="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
        ● Dados de demonstração
      </span>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">Total Leads</p>
        <p class="text-2xl font-bold">${formatNumber(MOCK_STATS.totalLeads)}</p>
      </div>
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">Ativos</p>
        <p class="text-2xl font-bold text-green-400">${formatNumber(MOCK_STATS.activeLeads)}</p>
      </div>
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">Mensagens</p>
        <p class="text-2xl font-bold text-blue-400">${formatNumber(MOCK_STATS.messagesSent)}</p>
      </div>
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">CTR Médio</p>
        <p class="text-2xl font-bold text-purple-400">${MOCK_STATS.avgCTR}%</p>
      </div>
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">Conversões</p>
        <p class="text-2xl font-bold text-orange-400">${formatNumber(MOCK_STATS.conversions)}</p>
      </div>
      <div class="stat-card p-4 rounded-xl">
        <p class="text-gray-400 text-sm mb-1">Receita</p>
        <p class="text-2xl font-bold gradient-text">${formatCurrency(MOCK_STATS.revenue)}</p>
      </div>
    </div>

    <!-- Campaigns Table -->
    <div class="card p-6 mb-8">
      <h2 class="text-xl font-bold mb-4">Campanhas Recentes</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Campanha</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Canal</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Enviados</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Conversões</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_CAMPAIGNS.map(c => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="py-3 px-4 font-medium">${c.name}</td>
              <td class="py-3 px-4 capitalize">${c.channel}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs ${c.status === 'active' ? 'bg-green-500/10 text-green-400' : c.status === 'completed' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}">
                  ${c.status === 'active' ? 'Ativo' : c.status === 'completed' ? 'Concluído' : 'Agendado'}
                </span>
              </td>
              <td class="py-3 px-4">${formatNumber(c.sent)}</td>
              <td class="py-3 px-4 text-green-400">${formatNumber(c.converted)}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="card p-6">
      <h2 class="text-xl font-bold mb-4">Leads Recentes</h2>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Nome</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Fonte</th>
            </tr>
          </thead>
          <tbody>
            ${MOCK_LEADS.map(l => `
            <tr class="border-b border-white/5 hover:bg-white/5">
              <td class="py-3 px-4 font-medium">${l.name}</td>
              <td class="py-3 px-4 text-gray-400">${l.email}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full text-xs ${l.status === 'engaged' ? 'bg-green-500/10 text-green-400' : l.status === 'converted' ? 'bg-purple-500/10 text-purple-400' : l.status === 'new' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'}">
                  ${l.status === 'engaged' ? 'Engajado' : l.status === 'converted' ? 'Convertido' : l.status === 'new' ? 'Novo' : 'Inativo'}
                </span>
              </td>
              <td class="py-3 px-4">${l.source}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center mt-12 text-gray-400 text-sm">
      <p>CRM Marketing - Demo Interativa</p>
      <p class="mt-2">Esta é uma demonstração com dados fictícios.</p>
    </footer>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crm-marketing-demo.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/landing">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">CRM Marketing</h1>
                <p className="text-xs text-muted-foreground">Demo Interativa</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
              Dados de demonstração
            </Badge>
            <Button onClick={generateDemoHTML} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Baixar HTML
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/auth">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Total Leads</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(MOCK_STATS.totalLeads)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Ativos</span>
              </div>
              <p className="text-2xl font-bold text-success">{formatNumber(MOCK_STATS.activeLeads)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Send className="w-4 h-4" />
                <span className="text-sm">Mensagens</span>
              </div>
              <p className="text-2xl font-bold text-primary">{formatNumber(MOCK_STATS.messagesSent)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm">CTR Médio</span>
              </div>
              <p className="text-2xl font-bold text-accent">{MOCK_STATS.avgCTR}%</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm">Conversões</span>
              </div>
              <p className="text-2xl font-bold text-warning">{formatNumber(MOCK_STATS.conversions)}</p>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Receita</span>
              </div>
              <p className="text-2xl font-bold gradient-text">{formatCurrency(MOCK_STATS.revenue)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Campaigns and Leads */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="bg-card/50 border border-border/50">
            <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Campanhas Recentes
                </CardTitle>
                <CardDescription>
                  Visualize o desempenho de suas campanhas multicanal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campanha</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enviados</TableHead>
                      <TableHead>Entregues</TableHead>
                      <TableHead>Abertos</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead>Conversões</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_CAMPAIGNS.map((campaign) => {
                      const Icon = CHANNEL_ICONS[campaign.channel as keyof typeof CHANNEL_ICONS];
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span className="capitalize">{campaign.channel}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={STATUS_COLORS[campaign.status as keyof typeof STATUS_COLORS]}>
                              {campaign.status === 'active' ? 'Ativo' : 
                               campaign.status === 'completed' ? 'Concluído' : 
                               campaign.status === 'scheduled' ? 'Agendado' : 'Pausado'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatNumber(campaign.sent)}</TableCell>
                          <TableCell>{formatNumber(campaign.delivered)}</TableCell>
                          <TableCell>{formatNumber(campaign.opened)}</TableCell>
                          <TableCell>{formatNumber(campaign.clicked)}</TableCell>
                          <TableCell className="text-success font-medium">
                            {formatNumber(campaign.converted)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Leads Recentes
                </CardTitle>
                <CardDescription>
                  Gerencie e acompanhe seus leads em um só lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fonte</TableHead>
                      <TableHead>Último Contato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LEADS.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                        <TableCell>
                          <Badge className={LEAD_STATUS_COLORS[lead.status as keyof typeof LEAD_STATUS_COLORS]}>
                            {lead.status === 'engaged' ? 'Engajado' :
                             lead.status === 'converted' ? 'Convertido' :
                             lead.status === 'new' ? 'Novo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell className="text-muted-foreground">{lead.lastContact}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Desempenho por Canal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-success" />
                        <span>WhatsApp</span>
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>Email</span>
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-warning" />
                        <span>SMS</span>
                      </div>
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-accent" />
                        <span>Instagram</span>
                      </div>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle>Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Enviados</span>
                      <span className="font-bold">20.500</span>
                    </div>
                    <Progress value={100} className="h-3 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Entregues</span>
                      <span className="font-bold">19.750</span>
                    </div>
                    <Progress value={96} className="h-3 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Abertos</span>
                      <span className="font-bold">9.800</span>
                    </div>
                    <Progress value={48} className="h-3 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Clicados</span>
                      <span className="font-bold">3.890</span>
                    </div>
                    <Progress value={19} className="h-3 bg-muted" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-success font-medium">Convertidos</span>
                      <span className="font-bold text-success">1.000</span>
                    </div>
                    <Progress value={5} className="h-3 bg-muted" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA */}
        <Card className="mt-8 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Gostou do que viu?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Crie sua conta gratuita e comece a usar o CRM Marketing hoje mesmo. 
              14 dias de teste sem compromisso.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/auth">
                  Criar Conta Grátis
                </Link>
              </Button>
              <Button size="lg" variant="outline" onClick={generateDemoHTML}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Demo HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
