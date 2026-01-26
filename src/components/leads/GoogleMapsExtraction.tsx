import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { MapPin, Search, Building2, Globe, Phone, Mail, Loader2, Download, Check } from 'lucide-react';

interface ExtractedBusiness {
  id: string;
  name: string;
  type: string;
  address: string;
  neighborhood: string;
  zone: string;
  phone?: string;
  website?: string;
  rating?: number;
  selected: boolean;
}

// Mock data for demonstration
const BUSINESS_TYPES = [
  'Restaurante',
  'Loja de Eletrônicos',
  'Farmácia',
  'Supermercado',
  'Padaria',
  'Oficina Mecânica',
  'Salão de Beleza',
  'Academia',
  'Pet Shop',
  'Loja de Roupas',
];

export function GoogleMapsExtraction({ onImport }: { onImport: (leads: any[]) => Promise<void> }) {
  const { toast } = useToast();
  const { neighborhoods, zones } = useNeighborhoods();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'search' | 'results' | 'importing'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [results, setResults] = useState<ExtractedBusiness[]>([]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulated search - in production this would call Google Maps API
    await new Promise(r => setTimeout(r, 2000));
    
    const mockResults: ExtractedBusiness[] = Array.from({ length: 15 }, (_, i) => ({
      id: `business-${i}`,
      name: `${businessType || 'Empresa'} ${['Premium', 'Express', 'Central', 'Master', 'Plus'][i % 5]} ${i + 1}`,
      type: businessType || BUSINESS_TYPES[Math.floor(Math.random() * BUSINESS_TYPES.length)],
      address: `Rua ${['das Flores', 'Principal', 'do Comércio', 'São Jorge', 'Nova'][i % 5]}, ${100 + i * 10}`,
      neighborhood: selectedNeighborhood || neighborhoods[Math.floor(Math.random() * neighborhoods.length)]?.name || 'Centro',
      zone: selectedZone || zones[Math.floor(Math.random() * zones.length)] || 'Zona Sul',
      phone: `(21) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      website: Math.random() > 0.5 ? `www.empresa${i + 1}.com.br` : undefined,
      rating: Math.floor(Math.random() * 20 + 30) / 10,
      selected: true,
    }));
    
    setResults(mockResults);
    setStep('results');
    setIsSearching(false);
  };

  const toggleSelection = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const toggleAll = (selected: boolean) => {
    setResults(prev => prev.map(r => ({ ...r, selected })));
  };

  const handleImport = async () => {
    const selectedBusinesses = results.filter(r => r.selected);
    if (selectedBusinesses.length === 0) {
      toast({ variant: 'destructive', title: 'Selecione ao menos um estabelecimento' });
      return;
    }

    setStep('importing');

    try {
      const leads = selectedBusinesses.map(b => ({
        name: b.name,
        email: `contato@${b.name.toLowerCase().replace(/\s+/g, '')}.com.br`,
        phone: b.phone || null,
        source: 'Google Maps',
        status: 'new' as const,
        neighborhood: b.neighborhood,
        zone: b.zone,
        business_type: b.type,
        city: 'Rio de Janeiro',
        purchase_potential: 'medium',
        audience_score: 'cold',
        last_contact: null,
      }));

      await onImport(leads);
      
      toast({
        title: 'Importação concluída!',
        description: `${leads.length} leads extraídos do Google Maps.`,
      });
      
      resetAndClose();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro na importação' });
      setStep('results');
    }
  };

  const resetAndClose = () => {
    setStep('search');
    setSearchQuery('');
    setSelectedZone('');
    setSelectedNeighborhood('');
    setBusinessType('');
    setResults([]);
    setIsOpen(false);
  };

  const selectedCount = results.filter(r => r.selected).length;
  const filteredNeighborhoods = selectedZone 
    ? neighborhoods.filter(n => n.zone === selectedZone)
    : neighborhoods;

  const downloadTemplate = () => {
    const template = `nome,tipo,endereco,bairro,zona,telefone,website
"Exemplo Empresa 1","Restaurante","Rua das Flores, 100","Copacabana","Zona Sul","(21) 99999-9999","www.exemplo1.com.br"
"Exemplo Empresa 2","Loja","Av. Principal, 200","Ipanema","Zona Sul","(21) 98888-8888",""`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_google_maps.csv';
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : resetAndClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          Extrair Google Maps
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Extração Google Maps
          </DialogTitle>
          <DialogDescription>
            {step === 'search' && 'Busque estabelecimentos no Google Maps para importar como leads'}
            {step === 'results' && 'Selecione os estabelecimentos para importar'}
            {step === 'importing' && 'Importando leads...'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {step === 'search' && (
            <div className="space-y-6 py-4">
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="gap-2" onClick={downloadTemplate}>
                  <Download className="h-4 w-4" />
                  Baixar Modelo
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Buscar por</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ex: restaurantes, lojas de eletrônicos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Estabelecimento</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zona</Label>
                  <Select value={selectedZone} onValueChange={(v) => { setSelectedZone(v); setSelectedNeighborhood(''); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as zonas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as zonas</SelectItem>
                      {zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Bairro</Label>
                  <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os bairros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os bairros</SelectItem>
                      {filteredNeighborhoods.map((n) => (
                        <SelectItem key={n.id} value={n.name}>{n.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Buscar Estabelecimentos
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedCount === results.length}
                    onCheckedChange={(checked) => toggleAll(!!checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedCount} de {results.length} selecionados
                  </span>
                </div>
                <Badge variant="secondary">{results.length} encontrados</Badge>
              </div>

              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-2">
                  {results.map((business) => (
                    <Card
                      key={business.id}
                      className={`p-4 cursor-pointer transition-colors ${
                        business.selected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => toggleSelection(business.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox checked={business.selected} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium truncate">{business.name}</span>
                            {business.rating && (
                              <Badge variant="outline" className="text-xs">
                                ⭐ {business.rating}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{business.type}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {business.address} - {business.neighborhood}, {business.zone}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {business.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {business.phone}
                              </span>
                            )}
                            {business.website && (
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" /> {business.website}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep('search')}>
                  Voltar
                </Button>
                <Button onClick={handleImport} disabled={selectedCount === 0} className="gap-2">
                  <Check className="h-4 w-4" />
                  Importar {selectedCount} Leads
                </Button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Importando estabelecimentos...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
