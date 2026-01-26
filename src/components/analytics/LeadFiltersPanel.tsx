import { useState } from 'react';
import { Filter, Download, Users, Building2, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface LeadFiltersPanelProps {
  zones: string[];
  neighborhoods: { name: string; zone: string }[];
  onFilterChange: (filters: LeadFilters) => void;
  filteredCount: number;
  totalCount: number;
}

export interface LeadFilters {
  zone: string | null;
  neighborhood: string | null;
  businessType: string | null;
  audienceScore: string | null;
  purchasePotential: string | null;
}

const businessTypes = [
  { value: 'varejo', label: 'Varejo' },
  { value: 'atacado', label: 'Atacado' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'tecnologia', label: 'Tecnologia' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'outros', label: 'Outros' },
];

const audienceScores = [
  { value: 'super_hot', label: 'Super Quente', color: 'bg-red-500' },
  { value: 'hot', label: 'Quente', color: 'bg-orange-500' },
  { value: 'warm', label: 'Morno', color: 'bg-yellow-500' },
  { value: 'cold', label: 'Frio', color: 'bg-blue-500' },
];

const purchasePotentials = [
  { value: 'high', label: 'Alto' },
  { value: 'medium', label: 'Médio' },
  { value: 'low', label: 'Baixo' },
];

export function LeadFiltersPanel({
  zones,
  neighborhoods,
  onFilterChange,
  filteredCount,
  totalCount,
}: LeadFiltersPanelProps) {
  const [filters, setFilters] = useState<LeadFilters>({
    zone: null,
    neighborhood: null,
    businessType: null,
    audienceScore: null,
    purchasePotential: null,
  });

  const filteredNeighborhoods = filters.zone
    ? neighborhoods.filter(n => n.zone === filters.zone)
    : neighborhoods;

  const updateFilter = (key: keyof LeadFilters, value: string | null) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset neighborhood when zone changes
    if (key === 'zone') {
      newFilters.neighborhood = null;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters: LeadFilters = {
      zone: null,
      neighborhood: null,
      businessType: null,
      audienceScore: null,
      purchasePotential: null,
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const exportAudience = () => {
    // Generate CSV export
    const csvContent = `Filtros aplicados:\nZona: ${filters.zone || 'Todas'}\nBairro: ${filters.neighborhood || 'Todos'}\nTipo de Negócio: ${filters.businessType || 'Todos'}\nScore: ${filters.audienceScore || 'Todos'}\nPotencial: ${filters.purchasePotential || 'Todos'}\n\nTotal de leads: ${filteredCount}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `publico-campanha-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Gerador de Públicos
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Filtre e exporte públicos para campanhas
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              {activeFiltersCount} filtros ativos
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Zone Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Zona
          </label>
          <Select
            value={filters.zone || 'all'}
            onValueChange={(v) => updateFilter('zone', v === 'all' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as zonas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as zonas</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Neighborhood Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Bairro
          </label>
          <Select
            value={filters.neighborhood || 'all'}
            onValueChange={(v) => updateFilter('neighborhood', v === 'all' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {filteredNeighborhoods.map((n) => (
                <SelectItem key={n.name} value={n.name}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Business Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Building2 className="h-3 w-3" /> Tipo Negócio
          </label>
          <Select
            value={filters.businessType || 'all'}
            onValueChange={(v) => updateFilter('businessType', v === 'all' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audience Score Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Temperatura
          </label>
          <Select
            value={filters.audienceScore || 'all'}
            onValueChange={(v) => updateFilter('audienceScore', v === 'all' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as temperaturas</SelectItem>
              {audienceScores.map((score) => (
                <SelectItem key={score.value} value={score.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${score.color}`} />
                    {score.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Purchase Potential Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" /> Potencial
          </label>
          <Select
            value={filters.purchasePotential || 'all'}
            onValueChange={(v) => updateFilter('purchasePotential', v === 'all' ? null : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os potenciais</SelectItem>
              {purchasePotentials.map((potential) => (
                <SelectItem key={potential.value} value={potential.value}>
                  {potential.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <p className="text-2xl font-bold text-card-foreground">
              {filteredCount.toLocaleString('pt-BR')}
            </p>
            <p className="text-sm text-muted-foreground">
              leads encontrados de {totalCount.toLocaleString('pt-BR')} total
            </p>
          </div>
        </div>

        <Button onClick={exportAudience} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Público
        </Button>
      </div>
    </div>
  );
}
