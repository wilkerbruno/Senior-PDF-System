import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNeighborhoods } from '@/hooks/useNeighborhoods';
import { Upload, FileSpreadsheet, Check, X, ArrowRight, Loader2, Download, MapPin } from 'lucide-react';
import { DbLead } from '@/hooks/useSupabaseLeads';

interface CSVImportProps {
  onImport: (leads: Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => Promise<void>;
}

type LeadField = 'name' | 'email' | 'phone' | 'source' | 'status' | 'neighborhood' | 'zone' | 'business_type' | 'purchase_potential' | 'ignore';

interface FieldMapping {
  [csvColumn: string]: LeadField;
}

const LEAD_FIELDS: { value: LeadField; label: string; required: boolean }[] = [
  { value: 'name', label: 'Nome', required: true },
  { value: 'email', label: 'Email', required: true },
  { value: 'phone', label: 'Telefone', required: false },
  { value: 'source', label: 'Origem', required: false },
  { value: 'status', label: 'Status', required: false },
  { value: 'neighborhood', label: 'Bairro', required: false },
  { value: 'zone', label: 'Zona', required: false },
  { value: 'business_type', label: 'Tipo de Negócio', required: false },
  { value: 'purchase_potential', label: 'Potencial de Compra', required: false },
  { value: 'ignore', label: 'Ignorar', required: false },
];

// RJ neighborhoods mapping for auto-detection
const RJ_NEIGHBORHOOD_ZONES: Record<string, string> = {
  'Copacabana': 'Zona Sul', 'Ipanema': 'Zona Sul', 'Leblon': 'Zona Sul', 'Botafogo': 'Zona Sul', 'Flamengo': 'Zona Sul',
  'Laranjeiras': 'Zona Sul', 'Catete': 'Zona Sul', 'Glória': 'Zona Sul', 'Leme': 'Zona Sul', 'Urca': 'Zona Sul',
  'Humaitá': 'Zona Sul', 'Jardim Botânico': 'Zona Sul', 'Gávea': 'Zona Sul', 'Lagoa': 'Zona Sul', 'São Conrado': 'Zona Sul',
  'Tijuca': 'Zona Norte', 'Méier': 'Zona Norte', 'Vila Isabel': 'Zona Norte', 'Grajaú': 'Zona Norte', 'Maracanã': 'Zona Norte',
  'Engenho Novo': 'Zona Norte', 'Piedade': 'Zona Norte', 'Abolição': 'Zona Norte', 'Pilares': 'Zona Norte',
  'Barra da Tijuca': 'Zona Oeste', 'Recreio': 'Zona Oeste', 'Jacarepaguá': 'Zona Oeste', 'Campo Grande': 'Zona Oeste',
  'Santa Cruz': 'Zona Oeste', 'Bangu': 'Zona Oeste', 'Realengo': 'Zona Oeste',
  'Centro': 'Centro', 'Lapa': 'Centro', 'Saúde': 'Centro', 'Gamboa': 'Centro', 'Santo Cristo': 'Centro',
};

const findZoneForNeighborhood = (neighborhood: string): string | null => {
  const normalized = neighborhood.trim();
  for (const [name, zone] of Object.entries(RJ_NEIGHBORHOOD_ZONES)) {
    if (normalized.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(normalized.toLowerCase())) {
      return zone;
    }
  }
  return null;
};

export function CSVImport({ onImport }: CSVImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<FieldMapping>({});
  const [isImporting, setIsImporting] = useState(false);
  const [mappedNeighborhoods, setMappedNeighborhoods] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { neighborhoods } = useNeighborhoods();

  const parseCSV = (text: string): string[][] => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    return lines.map((line) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if ((char === ',' || char === ';') && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      
      if (parsed.length < 2) {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido',
          description: 'O arquivo deve ter cabeçalho e pelo menos uma linha de dados.',
        });
        return;
      }

      const [headerRow, ...dataRows] = parsed;
      setHeaders(headerRow);
      setCsvData(dataRows);

      // Auto-mapping based on column names
      const autoMapping: FieldMapping = {};
      headerRow.forEach((header) => {
      const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('nome') || lowerHeader.includes('name')) {
          autoMapping[header] = 'name';
        } else if (lowerHeader.includes('email') || lowerHeader.includes('e-mail')) {
          autoMapping[header] = 'email';
        } else if (lowerHeader.includes('telefone') || lowerHeader.includes('phone') || lowerHeader.includes('cel')) {
          autoMapping[header] = 'phone';
        } else if (lowerHeader.includes('origem') || lowerHeader.includes('source')) {
          autoMapping[header] = 'source';
        } else if (lowerHeader.includes('status')) {
          autoMapping[header] = 'status';
        } else if (lowerHeader.includes('bairro') || lowerHeader.includes('neighborhood')) {
          autoMapping[header] = 'neighborhood';
        } else if (lowerHeader.includes('zona') || lowerHeader.includes('zone')) {
          autoMapping[header] = 'zone';
        } else if (lowerHeader.includes('tipo') || lowerHeader.includes('negocio') || lowerHeader.includes('business')) {
          autoMapping[header] = 'business_type';
        } else if (lowerHeader.includes('potencial') || lowerHeader.includes('potential')) {
          autoMapping[header] = 'purchase_potential';
        } else {
          autoMapping[header] = 'ignore';
        }
      });
      setMapping(autoMapping);
      setStep('mapping');
    };
    reader.readAsText(file);
  }, [toast]);

  const updateMapping = (csvColumn: string, field: LeadField) => {
    setMapping((prev) => ({ ...prev, [csvColumn]: field }));
  };

  const getMappedLeads = useCallback((): Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] => {
    let autoMappedCount = 0;
    
    const leads = csvData
      .map((row) => {
        const lead: Partial<Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {
          source: 'CSV Import',
          status: 'new',
          last_contact: null,
          city: 'Rio de Janeiro',
          purchase_potential: 'medium',
          audience_score: 'cold',
        };

        headers.forEach((header, index) => {
          const field = mapping[header];
          const value = row[index]?.trim() || '';

          if (field === 'name') lead.name = value;
          else if (field === 'email') lead.email = value;
          else if (field === 'phone') lead.phone = value || null;
          else if (field === 'source' && value) lead.source = value;
          else if (field === 'status' && ['new', 'engaged', 'converted', 'inactive'].includes(value)) {
            lead.status = value as DbLead['status'];
          }
          else if (field === 'neighborhood' && value) {
            lead.neighborhood = value;
            // Auto-map zone based on neighborhood
            if (!lead.zone) {
              const detectedZone = findZoneForNeighborhood(value);
              if (detectedZone) {
                lead.zone = detectedZone;
                autoMappedCount++;
              }
            }
          }
          else if (field === 'zone' && value) lead.zone = value;
          else if (field === 'business_type' && value) lead.business_type = value;
          else if (field === 'purchase_potential' && ['low', 'medium', 'high'].includes(value)) {
            lead.purchase_potential = value;
          }
        });

        return lead as Omit<DbLead, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
      })
      .filter((lead) => lead.name && lead.email);
    
    setMappedNeighborhoods(autoMappedCount);
    return leads;
  }, [csvData, headers, mapping]);

  const isValidMapping = useCallback(() => {
    const mappedFields = Object.values(mapping);
    return mappedFields.includes('name') && mappedFields.includes('email');
  }, [mapping]);

  const handleImport = async () => {
    setIsImporting(true);
    setStep('importing');

    try {
      const leads = getMappedLeads();
      await onImport(leads);
      
      toast({
        title: 'Importação concluída!',
        description: `${leads.length} leads importados com sucesso.`,
      });
      
      resetAndClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na importação',
        description: 'Não foi possível importar os leads.',
      });
      setStep('preview');
    } finally {
      setIsImporting(false);
    }
  };

  const resetAndClose = () => {
    setStep('upload');
    setCsvData([]);
    setHeaders([]);
    setMapping({});
    setIsOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? setIsOpen(true) : resetAndClose()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Leads via CSV
          </DialogTitle>
          <DialogDescription>
            {step === 'upload' && 'Selecione um arquivo CSV com seus leads.'}
            {step === 'mapping' && 'Mapeie as colunas do CSV para os campos de lead.'}
            {step === 'preview' && 'Revise os dados antes de importar.'}
            {step === 'importing' && 'Importando leads...'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Arraste um arquivo CSV ou clique para selecionar
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-muted-foreground px-2">
                <span>Coluna do CSV</span>
                <span>Campo do Lead</span>
              </div>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {headers.map((header) => (
                    <div key={header} className="grid grid-cols-2 gap-4 items-center">
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <span className="truncate">{header}</span>
                      </div>
                      <Select
                        value={mapping[header] || 'ignore'}
                        onValueChange={(value) => updateMapping(header, value as LeadField)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_FIELDS.map((field) => (
                            <SelectItem key={field.value} value={field.value}>
                              <span className="flex items-center gap-2">
                                {field.label}
                                {field.required && (
                                  <Badge variant="secondary" className="text-xs">
                                    Obrigatório
                                  </Badge>
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep('preview')}
                  disabled={!isValidMapping()}
                  className="gap-2"
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {getMappedLeads().length} leads prontos para importação
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" /> Válidos: {getMappedLeads().length}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <X className="h-3 w-3" /> Ignorados: {csvData.length - getMappedLeads().length}
                  </Badge>
                </div>
              </div>
              <ScrollArea className="h-[300px] border rounded-md">
                <div className="p-4 space-y-2">
                  {getMappedLeads().slice(0, 10).map((lead, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </div>
                        <div className="text-right text-sm">
                          {lead.phone && <p>{lead.phone}</p>}
                          <p className="text-muted-foreground">{lead.source}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {getMappedLeads().length > 10 && (
                    <p className="text-center text-sm text-muted-foreground py-2">
                      ... e mais {getMappedLeads().length - 10} leads
                    </p>
                  )}
                </div>
              </ScrollArea>
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep('mapping')}>
                  Voltar
                </Button>
                <Button onClick={handleImport} className="gap-2">
                  <Check className="h-4 w-4" /> Importar {getMappedLeads().length} Leads
                </Button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Importando leads...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
