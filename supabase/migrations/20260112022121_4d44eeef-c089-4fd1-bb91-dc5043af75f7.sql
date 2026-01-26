-- Add lead_id column to whatsapp_messages for linking
ALTER TABLE public.whatsapp_messages 
ADD COLUMN lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL;

-- Create index for lead_id
CREATE INDEX idx_whatsapp_messages_lead_id ON public.whatsapp_messages(lead_id);

-- Enable realtime for whatsapp_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;

-- Create function to auto-link messages to leads based on phone number
CREATE OR REPLACE FUNCTION public.link_whatsapp_message_to_lead()
RETURNS TRIGGER AS $$
DECLARE
  phone_number TEXT;
  found_lead_id UUID;
BEGIN
  -- Extract phone number from remote_jid (format: 5521999999999@s.whatsapp.net)
  phone_number := regexp_replace(NEW.remote_jid, '@.*$', '');
  
  -- Try to find a lead with matching phone number for the same user
  SELECT id INTO found_lead_id
  FROM public.leads
  WHERE user_id = NEW.user_id
    AND (
      -- Match with various phone formats
      replace(replace(replace(phone, ' ', ''), '-', ''), '+', '') LIKE '%' || phone_number || '%'
      OR phone_number LIKE '%' || replace(replace(replace(phone, ' ', ''), '-', ''), '+', '') || '%'
    )
  LIMIT 1;
  
  -- If found, link the message to the lead
  IF found_lead_id IS NOT NULL THEN
    NEW.lead_id := found_lead_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-link messages on insert
CREATE TRIGGER trigger_link_whatsapp_to_lead
BEFORE INSERT ON public.whatsapp_messages
FOR EACH ROW
EXECUTE FUNCTION public.link_whatsapp_message_to_lead();