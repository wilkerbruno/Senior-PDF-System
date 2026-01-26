-- Create notifications table for real-time admin alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Admins can view all notifications" 
ON public.notifications FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true);

-- Index for faster queries
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create WhatsApp analytics aggregated view table
CREATE TABLE public.whatsapp_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  lead_name TEXT,
  lead_phone TEXT,
  total_messages INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  first_message_at TIMESTAMP WITH TIME ZONE,
  avg_response_time_minutes NUMERIC,
  engagement_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.whatsapp_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own analytics" 
ON public.whatsapp_analytics FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics" 
ON public.whatsapp_analytics FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own analytics" 
ON public.whatsapp_analytics FOR ALL 
USING (auth.uid() = user_id);

-- Index for analytics queries
CREATE INDEX idx_whatsapp_analytics_user ON public.whatsapp_analytics(user_id);
CREATE INDEX idx_whatsapp_analytics_lead ON public.whatsapp_analytics(lead_id);

-- Trigger to update updated_at
CREATE TRIGGER update_whatsapp_analytics_updated_at
BEFORE UPDATE ON public.whatsapp_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create ads_integrations table for TikTok, Kwai, X/Twitter
CREATE TABLE public.ads_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  account_id TEXT,
  pixel_id TEXT,
  is_connected BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ads_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own integrations" 
ON public.ads_integrations FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all integrations" 
ON public.ads_integrations FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Unique constraint per user per platform
CREATE UNIQUE INDEX idx_ads_integrations_user_platform ON public.ads_integrations(user_id, platform);

-- Trigger
CREATE TRIGGER update_ads_integrations_updated_at
BEFORE UPDATE ON public.ads_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification when new message arrives
CREATE OR REPLACE FUNCTION public.notify_new_whatsapp_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify for incoming messages (not from_me)
  IF NEW.from_me = false THEN
    INSERT INTO public.notifications (user_id, type, title, message, action_url, metadata)
    VALUES (
      NEW.user_id,
      'whatsapp',
      'Nova mensagem WhatsApp',
      COALESCE(LEFT(NEW.content, 100), 'Nova mensagem recebida'),
      '/whatsapp',
      jsonb_build_object('message_id', NEW.id, 'remote_jid', NEW.remote_jid, 'lead_id', NEW.lead_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for new whatsapp messages
CREATE TRIGGER trigger_notify_new_whatsapp_message
AFTER INSERT ON public.whatsapp_messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_whatsapp_message();