import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type TemplateType = 'leads' | 'campaigns' | 'google_maps' | 'meta_audiences';

interface TemplateDownloadButtonProps {
  type?: TemplateType;
  showAll?: boolean;
}

const TEMPLATES: Record<TemplateType, { name: string; content: string; filename: string }> = {
  leads: {
    name: 'Leads',
    filename: 'modelo_leads.csv',
    content: `nome,email,telefone,origem,status,bairro,zona,tipo_negocio,potencial_compra
"João Silva","joao@email.com","(21) 99999-1111","Website","new","Copacabana","Zona Sul","Restaurante","high"
"Maria Santos","maria@empresa.com","(21) 98888-2222","Indicação","engaged","Ipanema","Zona Sul","Loja de Roupas","medium"
"Carlos Oliveira","carlos@loja.com.br","(21) 97777-3333","Google Ads","new","Tijuca","Zona Norte","Eletrônicos","high"`,
  },
  campaigns: {
    name: 'Campanhas',
    filename: 'modelo_campanhas.csv',
    content: `nome,canal,status,data_agendamento,enviados,entregues,abertos,clicados,convertidos
"Black Friday 2024","email","completed","2024-11-29","5000","4850","2100","450","89"
"Promoção Natal","whatsapp","scheduled","2024-12-20","0","0","0","0","0"
"Lançamento Produto","sms","draft","","0","0","0","0","0"`,
  },
  google_maps: {
    name: 'Google Maps',
    filename: 'modelo_google_maps.csv',
    content: `nome,tipo,endereco,bairro,zona,telefone,website,avaliacao
"Restaurante Premium","Restaurante","Rua das Flores, 100","Copacabana","Zona Sul","(21) 99999-9999","www.restaurante.com.br","4.5"
"Loja Eletrônicos","Loja de Eletrônicos","Av. Principal, 200","Ipanema","Zona Sul","(21) 98888-8888","","4.2"`,
  },
  meta_audiences: {
    name: 'Meta Audiences',
    filename: 'modelo_meta_audiences.csv',
    content: `email,telefone,nome,cidade,estado,pais,data_nascimento,genero,valor_cliente
"cliente1@email.com","5521999991111","João Silva","Rio de Janeiro","RJ","BR","1990-05-15","M","1500.00"
"cliente2@email.com","5521988882222","Maria Santos","Rio de Janeiro","RJ","BR","1985-08-22","F","2300.00"`,
  },
};

export function TemplateDownloadButton({ type, showAll = false }: TemplateDownloadButtonProps) {
  const downloadTemplate = (templateType: TemplateType) => {
    const template = TEMPLATES[templateType];
    const blob = new Blob([template.content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = template.filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showAll) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Modelos CSV
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(TEMPLATES).map(([key, template]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => downloadTemplate(key as TemplateType)}
              className="cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (!type) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => downloadTemplate(type)}
    >
      <Download className="h-4 w-4" />
      Baixar Modelo
    </Button>
  );
}
