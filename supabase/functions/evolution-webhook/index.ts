import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EvolutionMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  pushName?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
    imageMessage?: object;
    videoMessage?: object;
    audioMessage?: object;
    documentMessage?: object;
  };
  messageType?: string;
  messageTimestamp?: number;
  instanceName?: string;
}

interface WebhookPayload {
  event: string;
  instance: string;
  data: EvolutionMessage;
  apikey?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();
    console.log('Received Evolution webhook:', JSON.stringify(payload, null, 2));

    // Only process message events
    if (!payload.event?.includes('message') || !payload.data) {
      return new Response(
        JSON.stringify({ success: true, message: 'Event ignored' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: message, instance } = payload;

    // Find the user config for this instance
    const { data: config, error: configError } = await supabase
      .from('evolution_config')
      .select('user_id')
      .eq('instance_name', instance)
      .single();

    if (configError || !config) {
      console.error('No config found for instance:', instance);
      return new Response(
        JSON.stringify({ success: false, error: 'Instance not configured' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract message content
    let content = '';
    let messageType = 'text';

    if (message.message?.conversation) {
      content = message.message.conversation;
    } else if (message.message?.extendedTextMessage?.text) {
      content = message.message.extendedTextMessage.text;
    } else if (message.message?.imageMessage) {
      messageType = 'image';
      content = '[Imagem]';
    } else if (message.message?.videoMessage) {
      messageType = 'video';
      content = '[Vídeo]';
    } else if (message.message?.audioMessage) {
      messageType = 'audio';
      content = '[Áudio]';
    } else if (message.message?.documentMessage) {
      messageType = 'document';
      content = '[Documento]';
    }

    // Insert message into database
    const { error: insertError } = await supabase
      .from('whatsapp_messages')
      .upsert({
        user_id: config.user_id,
        instance_name: instance,
        remote_jid: message.key.remoteJid,
        message_id: message.key.id,
        message_type: messageType,
        content: content,
        from_me: message.key.fromMe,
        status: 'received',
        timestamp: message.messageTimestamp 
          ? new Date(message.messageTimestamp * 1000).toISOString()
          : new Date().toISOString(),
        raw_data: payload.data,
      }, {
        onConflict: 'message_id',
      });

    if (insertError) {
      console.error('Error inserting message:', insertError);
      return new Response(
        JSON.stringify({ success: false, error: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Message processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
