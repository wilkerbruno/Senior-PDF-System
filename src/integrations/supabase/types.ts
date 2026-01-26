export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ads_integrations: {
        Row: {
          access_token: string | null
          account_id: string | null
          created_at: string
          id: string
          is_connected: boolean | null
          pixel_id: string | null
          platform: string
          refresh_token: string | null
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean | null
          pixel_id?: string | null
          platform: string
          refresh_token?: string | null
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          created_at?: string
          id?: string
          is_connected?: boolean | null
          pixel_id?: string | null
          platform?: string
          refresh_token?: string | null
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          channel: string
          clicked: number
          converted: number
          created_at: string
          delivered: number
          id: string
          name: string
          opened: number
          scheduled_at: string | null
          sent: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel: string
          clicked?: number
          converted?: number
          created_at?: string
          delivered?: number
          id?: string
          name: string
          opened?: number
          scheduled_at?: string | null
          sent?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          clicked?: number
          converted?: number
          created_at?: string
          delivered?: number
          id?: string
          name?: string
          opened?: number
          scheduled_at?: string | null
          sent?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversion_stats: {
        Row: {
          city: string | null
          conversions: number | null
          created_at: string
          id: string
          neighborhood: string | null
          period_end: string
          period_start: string
          revenue: number | null
          total_leads: number | null
          updated_at: string
          user_id: string
          zone: string | null
        }
        Insert: {
          city?: string | null
          conversions?: number | null
          created_at?: string
          id?: string
          neighborhood?: string | null
          period_end: string
          period_start: string
          revenue?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id: string
          zone?: string | null
        }
        Update: {
          city?: string | null
          conversions?: number | null
          created_at?: string
          id?: string
          neighborhood?: string | null
          period_end?: string
          period_start?: string
          revenue?: number | null
          total_leads?: number | null
          updated_at?: string
          user_id?: string
          zone?: string | null
        }
        Relationships: []
      }
      evolution_config: {
        Row: {
          api_key: string
          api_url: string
          created_at: string
          id: string
          instance_name: string
          updated_at: string
          user_id: string
          webhook_enabled: boolean
        }
        Insert: {
          api_key: string
          api_url: string
          created_at?: string
          id?: string
          instance_name: string
          updated_at?: string
          user_id: string
          webhook_enabled?: boolean
        }
        Update: {
          api_key?: string
          api_url?: string
          created_at?: string
          id?: string
          instance_name?: string
          updated_at?: string
          user_id?: string
          webhook_enabled?: boolean
        }
        Relationships: []
      }
      leads: {
        Row: {
          audience_score: string | null
          business_type: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          interests: string[] | null
          last_contact: string | null
          name: string
          neighborhood: string | null
          phone: string | null
          purchase_potential: string | null
          source: string
          status: string
          updated_at: string
          user_id: string
          zone: string | null
        }
        Insert: {
          audience_score?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          last_contact?: string | null
          name: string
          neighborhood?: string | null
          phone?: string | null
          purchase_potential?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id: string
          zone?: string | null
        }
        Update: {
          audience_score?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          last_contact?: string | null
          name?: string
          neighborhood?: string | null
          phone?: string | null
          purchase_potential?: string | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
          zone?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rj_neighborhoods: {
        Row: {
          city: string
          created_at: string
          id: string
          name: string
          zone: string
        }
        Insert: {
          city?: string
          created_at?: string
          id?: string
          name: string
          zone: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          name?: string
          zone?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_analytics: {
        Row: {
          avg_response_time_minutes: number | null
          created_at: string
          engagement_score: number | null
          first_message_at: string | null
          id: string
          last_message_at: string | null
          lead_id: string | null
          lead_name: string | null
          lead_phone: string | null
          messages_received: number | null
          messages_sent: number | null
          total_messages: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_response_time_minutes?: number | null
          created_at?: string
          engagement_score?: number | null
          first_message_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          messages_received?: number | null
          messages_sent?: number | null
          total_messages?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_response_time_minutes?: number | null
          created_at?: string
          engagement_score?: number | null
          first_message_at?: string | null
          id?: string
          last_message_at?: string | null
          lead_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          messages_received?: number | null
          messages_sent?: number | null
          total_messages?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_analytics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_chatbot: {
        Row: {
          business_hours_end: string | null
          business_hours_start: string | null
          created_at: string
          fallback_message: string | null
          id: string
          is_enabled: boolean | null
          out_of_hours_message: string | null
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          business_hours_end?: string | null
          business_hours_start?: string | null
          created_at?: string
          fallback_message?: string | null
          id?: string
          is_enabled?: boolean | null
          out_of_hours_message?: string | null
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          business_hours_end?: string | null
          business_hours_start?: string | null
          created_at?: string
          fallback_message?: string | null
          id?: string
          is_enabled?: boolean | null
          out_of_hours_message?: string | null
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      whatsapp_chatbot_rules: {
        Row: {
          chatbot_id: string
          created_at: string
          id: string
          is_active: boolean | null
          match_type: string | null
          priority: number | null
          response: string
          trigger_keywords: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          match_type?: string | null
          priority?: number | null
          response: string
          trigger_keywords: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          match_type?: string | null
          priority?: number | null
          response?: string
          trigger_keywords?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_chatbot_rules_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_chatbot"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_messages: {
        Row: {
          content: string | null
          created_at: string
          from_me: boolean
          id: string
          instance_name: string
          lead_id: string | null
          message_id: string
          message_type: string
          raw_data: Json | null
          remote_jid: string
          status: string
          timestamp: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          from_me?: boolean
          id?: string
          instance_name: string
          lead_id?: string | null
          message_id: string
          message_type?: string
          raw_data?: Json | null
          remote_jid: string
          status?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          from_me?: boolean
          id?: string
          instance_name?: string
          lead_id?: string | null
          message_id?: string
          message_type?: string
          raw_data?: Json | null
          remote_jid?: string
          status?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_scheduled: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          lead_id: string | null
          message: string
          phone: string
          scheduled_at: string
          sent_at: string | null
          status: string | null
          template_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          message: string
          phone: string
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string | null
          message?: string
          phone?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_scheduled_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_scheduled_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
          usage_count: number | null
          user_id: string
          variables: string[] | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
          variables?: string[] | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
          variables?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
