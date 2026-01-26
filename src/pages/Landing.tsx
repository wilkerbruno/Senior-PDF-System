import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Zap,
  BarChart3,
  Users,
  Shield,
  ArrowRight,
  Check,
  Star,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'WhatsApp Business',
    description: 'Envie campanhas em massa via WhatsApp com templates aprovados e respostas automáticas.',
  },
  {
    icon: Mail,
    title: 'Email Marketing',
    description: 'Crie campanhas de email profissionais com editor drag-and-drop e automações.',
  },
  {
    icon: Phone,
    title: 'SMS Marketing',
    description: 'Alcance seus clientes diretamente com mensagens SMS personalizadas.',
  },
  {
    icon: Instagram,
    title: 'Instagram DM',
    description: 'Automatize respostas e campanhas via Direct do Instagram.',
  },
  {
    icon: Facebook,
    title: 'Facebook Messenger',
    description: 'Integre chatbots e campanhas no Messenger do Facebook.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Métricas em tempo real de todas suas campanhas em um único dashboard.',
  },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: 'R$ 97',
    period: '/mês',
    description: 'Perfeito para pequenos negócios',
    features: [
      '1.000 leads',
      '5.000 mensagens/mês',
      '2 canais inclusos',
      'Dashboard básico',
      'Suporte por email',
    ],
    popular: false,
    cta: 'Começar Grátis',
  },
  {
    name: 'Professional',
    price: 'R$ 297',
    period: '/mês',
    description: 'Para empresas em crescimento',
    features: [
      '10.000 leads',
      '50.000 mensagens/mês',
      'Todos os canais',
      'Analytics avançado',
      'Automações ilimitadas',
      'Suporte prioritário',
      'API access',
    ],
    popular: true,
    cta: 'Teste 14 dias grátis',
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    period: '',
    description: 'Para grandes operações',
    features: [
      'Leads ilimitados',
      'Mensagens ilimitadas',
      'Todos os canais',
      'Analytics customizado',
      'White-label',
      'Suporte dedicado 24/7',
      'SLA garantido',
      'Onboarding dedicado',
    ],
    popular: false,
    cta: 'Fale Conosco',
  },
];

const TESTIMONIALS = [
  {
    name: 'Maria Silva',
    role: 'CEO, TechStore',
    content: 'Aumentamos nossas conversões em 340% no primeiro mês usando o CRM Marketing.',
    avatar: 'MS',
  },
  {
    name: 'João Santos',
    role: 'Diretor de Marketing, InnovaBank',
    content: 'A integração multicanal é simplesmente incrível. Economizamos 20h/semana em tarefas manuais.',
    avatar: 'JS',
  },
  {
    name: 'Ana Costa',
    role: 'Growth Manager, StartupX',
    content: 'O melhor investimento que fizemos em marketing digital. ROI de 8x no primeiro trimestre.',
    avatar: 'AC',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CRM Marketing</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </a>
            <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/auth">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <Zap className="w-3 h-3 mr-1" />
            Novo: Integração com IA generativa
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Unifique suas campanhas
            <br />
            <span className="gradient-text">em uma só plataforma</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            CRM Marketing multicanal para WhatsApp, Email, SMS, Instagram e Facebook. 
            Automatize, analise e converta mais com inteligência artificial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 text-lg px-8">
              <Link to="/auth">
                Começar Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/demo">
                <Play className="w-5 h-5 mr-2" />
                Ver Demo
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              14 dias grátis
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">10M+</div>
              <div className="text-muted-foreground">Mensagens enviadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">5.000+</div>
              <div className="text-muted-foreground">Empresas ativas</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">98%</div>
              <div className="text-muted-foreground">Taxa de entrega</div>
            </div>
            <div>
              <div className="text-4xl font-bold gradient-text mb-2">4.9</div>
              <div className="text-muted-foreground flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                Avaliação média
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              Recursos
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tudo que você precisa para
              <br />
              <span className="gradient-text">crescer seu negócio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para gerenciar todos os seus canais de comunicação com clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <Card 
                key={feature.title}
                className="group border-border/50 bg-card/50 hover:bg-card hover:shadow-glow transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-success/10 text-success border-success/20">
              Preços
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Planos para todos os
              <br />
              <span className="gradient-text">tamanhos de negócio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e escale conforme seu negócio cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative border-border/50 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-primary/10 to-card border-primary/30 shadow-glow scale-105' 
                    : 'bg-card/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-warning/10 text-warning border-warning/20">
              Depoimentos
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              O que nossos clientes
              <br />
              <span className="gradient-text">estão dizendo</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-lg mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pronto para transformar
            <br />
            <span className="gradient-text">seu marketing?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Junte-se a mais de 5.000 empresas que já usam o CRM Marketing para aumentar suas vendas.
          </p>
          <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90 text-lg px-8">
            <Link to="/auth">
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50 bg-card/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">CRM Marketing</span>
              </div>
              <p className="text-muted-foreground">
                A plataforma mais completa para marketing multicanal.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><Link to="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 CRM Marketing. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Segurança SSL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
