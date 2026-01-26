-- Add RJ-specific fields to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Rio de Janeiro',
ADD COLUMN IF NOT EXISTS zone TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS purchase_potential TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS audience_score TEXT DEFAULT 'cold';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_neighborhood ON public.leads(neighborhood);
CREATE INDEX IF NOT EXISTS idx_leads_zone ON public.leads(zone);
CREATE INDEX IF NOT EXISTS idx_leads_audience_score ON public.leads(audience_score);
CREATE INDEX IF NOT EXISTS idx_leads_city ON public.leads(city);

-- Create neighborhoods reference table
CREATE TABLE IF NOT EXISTS public.rj_neighborhoods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  zone TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Rio de Janeiro',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rj_neighborhoods ENABLE ROW LEVEL SECURITY;

-- Public read access for neighborhoods
CREATE POLICY "Anyone can view neighborhoods" 
ON public.rj_neighborhoods 
FOR SELECT 
USING (true);

-- Insert RJ neighborhoods by zone
INSERT INTO public.rj_neighborhoods (name, zone, city) VALUES
-- Zona Sul
('Copacabana', 'Zona Sul', 'Rio de Janeiro'),
('Ipanema', 'Zona Sul', 'Rio de Janeiro'),
('Leblon', 'Zona Sul', 'Rio de Janeiro'),
('Botafogo', 'Zona Sul', 'Rio de Janeiro'),
('Flamengo', 'Zona Sul', 'Rio de Janeiro'),
('Laranjeiras', 'Zona Sul', 'Rio de Janeiro'),
('Catete', 'Zona Sul', 'Rio de Janeiro'),
('Glória', 'Zona Sul', 'Rio de Janeiro'),
('Urca', 'Zona Sul', 'Rio de Janeiro'),
('Leme', 'Zona Sul', 'Rio de Janeiro'),
('Humaitá', 'Zona Sul', 'Rio de Janeiro'),
('Lagoa', 'Zona Sul', 'Rio de Janeiro'),
('Jardim Botânico', 'Zona Sul', 'Rio de Janeiro'),
('Gávea', 'Zona Sul', 'Rio de Janeiro'),
('São Conrado', 'Zona Sul', 'Rio de Janeiro'),
-- Zona Norte
('Tijuca', 'Zona Norte', 'Rio de Janeiro'),
('Vila Isabel', 'Zona Norte', 'Rio de Janeiro'),
('Grajaú', 'Zona Norte', 'Rio de Janeiro'),
('Méier', 'Zona Norte', 'Rio de Janeiro'),
('Madureira', 'Zona Norte', 'Rio de Janeiro'),
('Penha', 'Zona Norte', 'Rio de Janeiro'),
('Bonsucesso', 'Zona Norte', 'Rio de Janeiro'),
('Olaria', 'Zona Norte', 'Rio de Janeiro'),
('Ramos', 'Zona Norte', 'Rio de Janeiro'),
('Ilha do Governador', 'Zona Norte', 'Rio de Janeiro'),
-- Zona Oeste
('Barra da Tijuca', 'Zona Oeste', 'Rio de Janeiro'),
('Recreio', 'Zona Oeste', 'Rio de Janeiro'),
('Jacarepaguá', 'Zona Oeste', 'Rio de Janeiro'),
('Campo Grande', 'Zona Oeste', 'Rio de Janeiro'),
('Santa Cruz', 'Zona Oeste', 'Rio de Janeiro'),
('Bangu', 'Zona Oeste', 'Rio de Janeiro'),
('Realengo', 'Zona Oeste', 'Rio de Janeiro'),
-- Centro
('Centro', 'Centro', 'Rio de Janeiro'),
('Lapa', 'Centro', 'Rio de Janeiro'),
('Santa Teresa', 'Centro', 'Rio de Janeiro'),
('Saúde', 'Centro', 'Rio de Janeiro'),
('Gamboa', 'Centro', 'Rio de Janeiro')
ON CONFLICT DO NOTHING;

-- Create conversion stats table for analytics
CREATE TABLE IF NOT EXISTS public.conversion_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  neighborhood TEXT,
  zone TEXT,
  city TEXT DEFAULT 'Rio de Janeiro',
  total_leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for conversion_stats
ALTER TABLE public.conversion_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversion_stats
CREATE POLICY "Users can view their own stats" 
ON public.conversion_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.conversion_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.conversion_stats 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stats" 
ON public.conversion_stats 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));