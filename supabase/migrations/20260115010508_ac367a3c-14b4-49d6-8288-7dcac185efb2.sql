-- Create table for WhatsApp message templates
CREATE TABLE public.whatsapp_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for scheduled WhatsApp messages
CREATE TABLE public.whatsapp_scheduled (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for chatbot configuration
CREATE TABLE public.whatsapp_chatbot (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  welcome_message TEXT,
  fallback_message TEXT DEFAULT 'Obrigado pelo contato! Em breve retornaremos.',
  business_hours_start TIME DEFAULT '09:00',
  business_hours_end TIME DEFAULT '18:00',
  out_of_hours_message TEXT DEFAULT 'Estamos fora do horário de atendimento. Retornaremos em breve!',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for chatbot auto-response rules
CREATE TABLE public.whatsapp_chatbot_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  chatbot_id UUID NOT NULL REFERENCES public.whatsapp_chatbot(id) ON DELETE CASCADE,
  trigger_keywords TEXT[] NOT NULL,
  response TEXT NOT NULL,
  match_type TEXT DEFAULT 'contains',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_scheduled ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_chatbot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_chatbot_rules ENABLE ROW LEVEL SECURITY;

-- RLS policies for whatsapp_templates
CREATE POLICY "Users can manage their own templates" ON public.whatsapp_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all templates" ON public.whatsapp_templates FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for whatsapp_scheduled
CREATE POLICY "Users can manage their own scheduled messages" ON public.whatsapp_scheduled FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all scheduled messages" ON public.whatsapp_scheduled FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for whatsapp_chatbot
CREATE POLICY "Users can manage their own chatbot" ON public.whatsapp_chatbot FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chatbots" ON public.whatsapp_chatbot FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for whatsapp_chatbot_rules
CREATE POLICY "Users can manage their own chatbot rules" ON public.whatsapp_chatbot_rules FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all chatbot rules" ON public.whatsapp_chatbot_rules FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_whatsapp_scheduled_updated_at BEFORE UPDATE ON public.whatsapp_scheduled FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_whatsapp_chatbot_updated_at BEFORE UPDATE ON public.whatsapp_chatbot FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_whatsapp_chatbot_rules_updated_at BEFORE UPDATE ON public.whatsapp_chatbot_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();