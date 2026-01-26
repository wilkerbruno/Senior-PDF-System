import { useState } from 'react';
import { Users, Wand2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LookalikeGeneratorProps {
  topNeighborhoods: string[];
  topBusinessTypes: string[];
  hotLeadsCount: number;
}

export function LookalikeGenerator({
  topNeighborhoods,
  topBusinessTypes,
  hotLeadsCount,
}: LookalikeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedAudience, setGeneratedAudience] = useState<{
    name: string;
    size: string;
    characteristics: string[];
  } | null>(null);

  const generateLookalike = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate lookalike audience
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedAudience({
      name: `Lookalike - Melhores Compradores RJ ${new Date().toLocaleDateString('pt-BR')}`,
      size: `${(hotLeadsCount * 10).toLocaleString('pt-BR')} - ${(hotLeadsCount * 50).toLocaleString('pt-BR')} pessoas`,
      characteristics: [
        `Bairros: ${topNeighborhoods.slice(0, 3).join(', ')}`,
        `Segmentos: ${topBusinessTypes.slice(0, 3).join(', ')}`,
        'Interesse em tecnologia e smartphones',
        'Comportamento de compra online',
        'Faixa etária 25-55 anos',
      ],
    });
    
    setIsGenerating(false);
    toast.success('Público Lookalike gerado com sucesso!');
  };

  const copyAudienceConfig = () => {
    if (!generatedAudience) return;
    
    const config = JSON.stringify({
      name: generatedAudience.name,
      source: 'CRM Marketing RJ',
      baseAudience: {
        hotLeadsCount,
        topNeighborhoods: topNeighborhoods.slice(0, 5),
        topBusinessTypes: topBusinessTypes.slice(0, 5),
      },
      targeting: {
        locations: ['Rio de Janeiro, RJ, Brazil'],
        interests: ['iPhone', 'Smartphones', 'Tecnologia', 'E-commerce'],
        behaviors: ['Online shoppers', 'Business owners'],
      },
      similarityLevel: '1-3%',
    }, null, 2);
    
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Configuração copiada para a área de transferência!');
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Gerador de Públicos Lookalike
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Crie públicos semelhantes aos seus melhores compradores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Base Audience Info */}
        <div className="space-y-4">
          <h4 className="font-medium text-card-foreground">Base de Referência</h4>
          
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Leads quentes/super-quentes:</span>
              <Badge variant="secondary">{hotLeadsCount} leads</Badge>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Top Bairros:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {topNeighborhoods.slice(0, 5).map((n) => (
                  <Badge key={n} variant="outline" className="text-xs">
                    {n}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Top Segmentos:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {topBusinessTypes.slice(0, 5).map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={generateLookalike}
            disabled={isGenerating || hotLeadsCount === 0}
            className="w-full gap-2"
          >
            <Wand2 className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Gerando...' : 'Gerar Público Lookalike'}
          </Button>
        </div>

        {/* Generated Audience */}
        <div className="space-y-4">
          <h4 className="font-medium text-card-foreground">Público Gerado</h4>
          
          {generatedAudience ? (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">{generatedAudience.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAudienceConfig}
                  className="gap-1"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Tamanho estimado:</span>
                <p className="font-bold text-primary">{generatedAudience.size}</p>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Características:</span>
                <ul className="mt-1 space-y-1">
                  {generatedAudience.characteristics.map((c, i) => (
                    <li key={i} className="text-sm text-card-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-lg bg-muted/30 border border-border/50 border-dashed text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                Clique em "Gerar Público Lookalike" para criar um público similar aos seus melhores compradores
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="font-medium text-card-foreground mb-2">Como usar:</h4>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Gere o público lookalike baseado nos seus melhores leads</li>
          <li>Copie a configuração do público</li>
          <li>Cole no Meta Ads ou Google Ads para criar o público</li>
          <li>Use o público em suas campanhas de aquisição</li>
        </ol>
      </div>
    </div>
  );
}
