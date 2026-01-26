import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledMessage {
  id: string;
  user_id: string;
  phone: string;
  message: string;
  scheduled_at: string;
}

interface EvolutionConfig {
  instance_name: string;
  api_url: string;
  api_key: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get pending messages that are due
    const now = new Date().toISOString();
    const { data: pendingMessages, error: fetchError } = await supabaseClient
      .from('whatsapp_scheduled')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .limit(50);

    if (fetchError) {
      throw new Error(`Error fetching scheduled messages: ${fetchError.message}`);
    }

    if (!pendingMessages || pendingMessages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No messages to process', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${pendingMessages.length} scheduled messages`);

    const results = [];

    for (const msg of pendingMessages as ScheduledMessage[]) {
      try {
        // Get user's Evolution API config
        const { data: config, error: configError } = await supabaseClient
          .from('evolution_config')
          .select('*')
          .eq('user_id', msg.user_id)
          .single();

        if (configError || !config) {
          throw new Error('Evolution API not configured');
        }

        const evolutionConfig = config as EvolutionConfig;

        // Format phone number
        let phoneNumber = msg.phone.replace(/\D/g, '');
        if (!phoneNumber.includes('@')) {
          phoneNumber = `${phoneNumber}@s.whatsapp.net`;
        }

        // Send message via Evolution API
        const evolutionUrl = `${evolutionConfig.api_url}/message/sendText/${evolutionConfig.instance_name}`;
        
        const response = await fetch(evolutionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': evolutionConfig.api_key,
          },
          body: JSON.stringify({
            number: phoneNumber,
            text: msg.message,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Evolution API error: ${errorData}`);
        }

        // Update message status to sent
        await supabaseClient
          .from('whatsapp_scheduled')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', msg.id);

        results.push({ id: msg.id, status: 'sent' });
        console.log(`Message ${msg.id} sent successfully`);

      } catch (error) {
        console.error(`Error processing message ${msg.id}:`, error);
        
        // Update message status to failed
        await supabaseClient
          .from('whatsapp_scheduled')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          })
          .eq('id', msg.id);

        results.push({ id: msg.id, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Processing complete', 
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-scheduled-messages:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
