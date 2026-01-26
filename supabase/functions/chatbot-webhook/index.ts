import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatbotConfig {
  id: string;
  user_id: string;
  is_enabled: boolean;
  welcome_message: string | null;
  fallback_message: string;
  business_hours_start: string;
  business_hours_end: string;
  out_of_hours_message: string;
}

interface ChatbotRule {
  id: string;
  trigger_keywords: string[];
  response: string;
  match_type: string;
  priority: number;
  is_active: boolean;
}

interface EvolutionConfig {
  instance_name: string;
  api_url: string;
  api_key: string;
}

function isWithinBusinessHours(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const startTimeMinutes = startHours * 60 + startMinutes;
  const endTimeMinutes = endHours * 60 + endMinutes;

  return currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
}

function findMatchingRule(message: string, rules: ChatbotRule[]): ChatbotRule | null {
  const lowerMessage = message.toLowerCase();
  
  // Sort by priority (higher first)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    if (!rule.is_active) continue;

    for (const keyword of rule.trigger_keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      switch (rule.match_type) {
        case 'exact':
          if (lowerMessage === lowerKeyword) return rule;
          break;
        case 'starts_with':
          if (lowerMessage.startsWith(lowerKeyword)) return rule;
          break;
        case 'contains':
        default:
          if (lowerMessage.includes(lowerKeyword)) return rule;
          break;
      }
    }
  }

  return null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Chatbot webhook received:', JSON.stringify(payload, null, 2));

    // Check if it's a message event
    if (!payload.event?.includes('messages') || !payload.data?.message) {
      return new Response(
        JSON.stringify({ message: 'Not a message event' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const messageData = payload.data.message;
    const instanceName = payload.instance;

    // Skip if it's an outgoing message
    if (messageData.key?.fromMe) {
      return new Response(
        JSON.stringify({ message: 'Outgoing message, skipping' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract message content
    const messageContent = messageData.message?.conversation || 
                          messageData.message?.extendedTextMessage?.text || '';

    if (!messageContent) {
      return new Response(
        JSON.stringify({ message: 'No text content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find user by instance name
    const { data: evolutionConfig, error: configError } = await supabaseClient
      .from('evolution_config')
      .select('*')
      .eq('instance_name', instanceName)
      .single();

    if (configError || !evolutionConfig) {
      console.log('No Evolution config found for instance:', instanceName);
      return new Response(
        JSON.stringify({ message: 'Instance not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = evolutionConfig.user_id;
    const config = evolutionConfig as EvolutionConfig;

    // Get chatbot configuration
    const { data: chatbotConfig, error: chatbotError } = await supabaseClient
      .from('whatsapp_chatbot')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (chatbotError || !chatbotConfig || !chatbotConfig.is_enabled) {
      console.log('Chatbot not enabled for user:', userId);
      return new Response(
        JSON.stringify({ message: 'Chatbot not enabled' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const botConfig = chatbotConfig as ChatbotConfig;

    // Check business hours
    const withinHours = isWithinBusinessHours(
      botConfig.business_hours_start,
      botConfig.business_hours_end
    );

    let responseMessage: string;

    if (!withinHours) {
      responseMessage = botConfig.out_of_hours_message;
    } else {
      // Get chatbot rules
      const { data: rules, error: rulesError } = await supabaseClient
        .from('whatsapp_chatbot_rules')
        .select('*')
        .eq('chatbot_id', botConfig.id);

      if (rulesError) {
        console.error('Error fetching rules:', rulesError);
      }

      const matchingRule = findMatchingRule(messageContent, (rules || []) as ChatbotRule[]);

      if (matchingRule) {
        responseMessage = matchingRule.response;
      } else {
        responseMessage = botConfig.fallback_message;
      }
    }

    // Send response via Evolution API
    const remoteJid = messageData.key?.remoteJid;
    const phoneNumber = remoteJid?.replace('@s.whatsapp.net', '').replace('@c.us', '');

    if (phoneNumber) {
      const evolutionUrl = `${config.api_url}/message/sendText/${config.instance_name}`;
      
      const response = await fetch(evolutionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.api_key,
        },
        body: JSON.stringify({
          number: `${phoneNumber}@s.whatsapp.net`,
          text: responseMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error sending chatbot response:', errorData);
        throw new Error(`Evolution API error: ${errorData}`);
      }

      console.log('Chatbot response sent successfully to:', phoneNumber);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Chatbot response sent',
        response: responseMessage 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chatbot-webhook:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
