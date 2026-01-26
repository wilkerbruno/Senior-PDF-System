import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Check, 
  ArrowLeft,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 97,
    yearlyPrice: 77,
    description: 'Perfeito para pequenos negócios começando no marketing digital',
    features: [
      { text: '1.000 leads', included: true },
      { text: '5.000 mensagens/mês', included: true },
      { text: '2 canais (Email + SMS)', included: true },
      { text: 'Dashboard básico', included: true },
      { text: 'Suporte por email', included: true },
      { text: 'Relatórios semanais', included: true },
      { text: 'Automações avançadas', included: false },
      { text: 'API access', included: false },
      { text: 'White-label', included: false },
    ],
    popular: false,
    cta: 'Começar Grátis',
    trialDays: 7,
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 297,
    yearlyPrice: 237,
    description: 'Para empresas em crescimento que precisam de mais poder',
    features: [
      { text: '10.000 leads', included: true },
      { text: '50.000 mensagens/mês', included: true },
      { text: 'Todos os canais', included: true },
      { text: 'Analytics avançado', included: true },
      { text: 'Automações ilimitadas', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'API access', included: true },
      { text: 'Relatórios personalizados', included: true },
      { text: 'White-label', included: false },
    ],
    popular: true,
    cta: 'Teste 14 dias grátis',
    trialDays: 14,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Para grandes operações que precisam de soluções customizadas',
    features: [
      { text: 'Leads ilimitados', included: true },
      { text: 'Mensagens ilimitadas', included: true },
      { text: 'Todos os canais', included: true },
      { text: 'Analytics customizado', included: true },
      { text: 'Automações ilimitadas', included: true },
      { text: 'Suporte dedicado 24/7', included: true },
      { text: 'API access ilimitado', included: true },
      { text: 'White-label completo', included: true },
      { text: 'SLA garantido', included: true },
      { text: 'Onboarding dedicado', included: true },
    ],
    popular: false,
    cta: 'Fale Conosco',
    trialDays: null,
  },
];

const FAQ_ITEMS = [
  {
    question: 'Posso testar antes de assinar?',
    answer: 'Sim! Oferecemos 7 dias de teste grátis no plano Starter e 14 dias no plano Professional. Não é necessário cartão de crédito para começar.',
  },
  {
    question: 'Como funciona o limite de mensagens?',
    answer: 'O limite de mensagens é renovado mensalmente. Mensagens não utilizadas não acumulam para o próximo mês. Se precisar de mais mensagens, você pode fazer upgrade a qualquer momento.',
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas imediatamente e o valor é calculado proporcionalmente.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express), PIX e boleto bancário. Para planos Enterprise, também oferecemos faturamento.',
  },
  {
    question: 'O que acontece se eu exceder meus limites?',
    answer: 'Você receberá um aviso quando estiver próximo do limite. Após exceder, você pode comprar pacotes adicionais ou fazer upgrade do plano. Nunca interrompemos suas campanhas sem aviso.',
  },
  {
    question: 'Vocês oferecem suporte em português?',
    answer: 'Sim! Todo nosso suporte é em português brasileiro. Oferecemos atendimento por email, chat e, para planos Enterprise, suporte telefônico dedicado.',
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Sob consulta';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
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
              <span className="text-lg font-bold">CRM Marketing</span>
            </div>
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
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-success/10 text-success border-success/20">
            <Zap className="w-3 h-3 mr-1" />
            Economize 20% no plano anual
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o plano ideal
            <br />
            <span className="gradient-text">para seu negócio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comece grátis e escale conforme sua empresa cresce. 
            Sem surpresas, sem taxas ocultas.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Mensal
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Anual
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                -20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            
            return (
              <Card 
                key={plan.id}
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
                  <CardDescription className="min-h-[48px]">
                    {plan.description}
                  </CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">
                      {formatPrice(price)}
                    </span>
                    {price && (
                      <span className="text-muted-foreground">/mês</span>
                    )}
                    {isYearly && price && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Cobrado anualmente
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li 
                        key={feature.text} 
                        className={`flex items-center gap-2 ${
                          !feature.included ? 'text-muted-foreground' : ''
                        }`}
                      >
                        <Check 
                          className={`w-5 h-5 flex-shrink-0 ${
                            feature.included ? 'text-success' : 'text-muted-foreground/30'
                          }`} 
                        />
                        <span className={!feature.included ? 'line-through' : ''}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                  
                  {plan.trialDays && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {plan.trialDays} dias grátis, sem cartão de crédito
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <HelpCircle className="w-3 h-3 mr-1" />
              Dúvidas Frequentes
            </Badge>
            <h2 className="text-3xl font-bold">
              Perguntas Frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-4 bg-card/50"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <Card className="mt-16 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 max-w-4xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ainda tem dúvidas?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Nossa equipe está pronta para ajudar você a escolher o melhor plano 
              para suas necessidades.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-primary hover:opacity-90">
                <Link to="/auth">Começar Agora</Link>
              </Button>
              <Button size="lg" variant="outline">
                Falar com Vendas
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
