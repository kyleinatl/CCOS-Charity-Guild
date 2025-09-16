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
      automation_logs: {
        Row: {
          actions_executed: Json[] | null
          automation_id: string
          created_at: string | null
          error_message: string | null
          id: string
          member_id: string | null
          success: boolean | null
          trigger_data: Json | null
        }
        Insert: {
          actions_executed?: Json[] | null
          automation_id: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          member_id?: string | null
          success?: boolean | null
          trigger_data?: Json | null
        }
        Update: {
          actions_executed?: Json[] | null
          automation_id?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          member_id?: string | null
          success?: boolean | null
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      automations: {
        Row: {
          actions: Json[]
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          last_run: string | null
          name: string
          next_run: string | null
          run_count: number | null
          status: Database["public"]["Enums"]["automation_status"] | null
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
        }
        Insert: {
          actions: Json[]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run?: string | null
          name: string
          next_run?: string | null
          run_count?: number | null
          status?: Database["public"]["Enums"]["automation_status"] | null
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json[]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          last_run?: string | null
          name?: string
          next_run?: string | null
          run_count?: number | null
          status?: Database["public"]["Enums"]["automation_status"] | null
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      communication_recipients: {
        Row: {
          bounced: boolean | null
          clicked: boolean | null
          clicked_at: string | null
          communication_id: string
          created_at: string | null
          delivered: boolean | null
          delivered_at: string | null
          id: string
          member_id: string
          opened: boolean | null
          opened_at: string | null
          unsubscribed: boolean | null
        }
        Insert: {
          bounced?: boolean | null
          clicked?: boolean | null
          clicked_at?: string | null
          communication_id: string
          created_at?: string | null
          delivered?: boolean | null
          delivered_at?: string | null
          id?: string
          member_id: string
          opened?: boolean | null
          opened_at?: string | null
          unsubscribed?: boolean | null
        }
        Update: {
          bounced?: boolean | null
          clicked?: boolean | null
          clicked_at?: string | null
          communication_id?: string
          created_at?: string | null
          delivered?: boolean | null
          delivered_at?: string | null
          id?: string
          member_id?: string
          opened?: boolean | null
          opened_at?: string | null
          unsubscribed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_recipients_communication_id_fkey"
            columns: ["communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_recipients_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_recipients_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      communications: {
        Row: {
          click_rate: number | null
          content: string
          created_at: string | null
          created_by: string | null
          delivery_rate: number | null
          from_email: string | null
          id: string
          open_rate: number | null
          platform: string | null
          recipient_segments: string[]
          reply_to_email: string | null
          scheduled_for: string | null
          sent_at: string | null
          subject: string
          tags: string[] | null
          template_id: string | null
          total_recipients: number | null
          type: Database["public"]["Enums"]["communication_type"]
          updated_at: string | null
        }
        Insert: {
          click_rate?: number | null
          content: string
          created_at?: string | null
          created_by?: string | null
          delivery_rate?: number | null
          from_email?: string | null
          id?: string
          open_rate?: number | null
          platform?: string | null
          recipient_segments: string[]
          reply_to_email?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          subject: string
          tags?: string[] | null
          template_id?: string | null
          total_recipients?: number | null
          type: Database["public"]["Enums"]["communication_type"]
          updated_at?: string | null
        }
        Update: {
          click_rate?: number | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          delivery_rate?: number | null
          from_email?: string | null
          id?: string
          open_rate?: number | null
          platform?: string | null
          recipient_segments?: string[]
          reply_to_email?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          subject?: string
          tags?: string[] | null
          template_id?: string | null
          total_recipients?: number | null
          type?: Database["public"]["Enums"]["communication_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          anonymous: boolean | null
          created_at: string | null
          created_by: string | null
          designation: string | null
          donation_date: string | null
          id: string
          is_recurring: boolean | null
          member_id: string
          method: Database["public"]["Enums"]["donation_method"]
          net_amount: number | null
          notes: string | null
          parent_donation_id: string | null
          payment_processor: string | null
          processing_fee: number | null
          public_acknowledgment: boolean | null
          receipt_number: string | null
          receipt_sent: boolean | null
          receipt_sent_date: string | null
          recurring_end_date: string | null
          recurring_frequency: string | null
          tax_deductible: boolean | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          anonymous?: boolean | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          donation_date?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id: string
          method: Database["public"]["Enums"]["donation_method"]
          net_amount?: number | null
          notes?: string | null
          parent_donation_id?: string | null
          payment_processor?: string | null
          processing_fee?: number | null
          public_acknowledgment?: boolean | null
          receipt_number?: string | null
          receipt_sent?: boolean | null
          receipt_sent_date?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          tax_deductible?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          anonymous?: boolean | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          donation_date?: string | null
          id?: string
          is_recurring?: boolean | null
          member_id?: string
          method?: Database["public"]["Enums"]["donation_method"]
          net_amount?: number | null
          notes?: string | null
          parent_donation_id?: string | null
          payment_processor?: string | null
          processing_fee?: number | null
          public_acknowledgment?: boolean | null
          receipt_number?: string | null
          receipt_sent?: boolean | null
          receipt_sent_date?: string | null
          recurring_end_date?: string | null
          recurring_frequency?: string | null
          tax_deductible?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_parent_donation_id_fkey"
            columns: ["parent_donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          amount_paid: number | null
          attended: boolean | null
          check_in_time: string | null
          checked_in: boolean | null
          created_at: string | null
          dietary_restrictions: string | null
          event_id: string
          id: string
          member_id: string
          notes: string | null
          number_of_guests: number | null
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["donation_method"] | null
          registration_date: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["registration_status"] | null
          total_attendees: number | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          attended?: boolean | null
          check_in_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          dietary_restrictions?: string | null
          event_id: string
          id?: string
          member_id: string
          notes?: string | null
          number_of_guests?: number | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["donation_method"] | null
          registration_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          total_attendees?: number | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          attended?: boolean | null
          check_in_time?: string | null
          checked_in?: boolean | null
          created_at?: string | null
          dietary_restrictions?: string | null
          event_id?: string
          id?: string
          member_id?: string
          notes?: string | null
          number_of_guests?: number | null
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["donation_method"] | null
          registration_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["registration_status"] | null
          total_attendees?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          created_by: string | null
          current_registrations: number | null
          description: string | null
          early_bird_deadline: string | null
          early_bird_price: number | null
          end_date: string | null
          event_type: string | null
          fundraising_goal: number | null
          id: string
          image_url: string | null
          is_virtual: boolean | null
          member_discount_percent: number | null
          name: string
          registration_deadline: string | null
          requires_approval: boolean | null
          start_date: string
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          ticket_price: number | null
          total_raised: number | null
          updated_at: string | null
          updated_by: string | null
          venue_address: string | null
          venue_name: string | null
          virtual_link: string | null
          waitlist_enabled: boolean | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          early_bird_deadline?: string | null
          early_bird_price?: number | null
          end_date?: string | null
          event_type?: string | null
          fundraising_goal?: number | null
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          member_discount_percent?: number | null
          name: string
          registration_deadline?: string | null
          requires_approval?: boolean | null
          start_date: string
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          ticket_price?: number | null
          total_raised?: number | null
          updated_at?: string | null
          updated_by?: string | null
          venue_address?: string | null
          venue_name?: string | null
          virtual_link?: string | null
          waitlist_enabled?: boolean | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string | null
          current_registrations?: number | null
          description?: string | null
          early_bird_deadline?: string | null
          early_bird_price?: number | null
          end_date?: string | null
          event_type?: string | null
          fundraising_goal?: number | null
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          member_discount_percent?: number | null
          name?: string
          registration_deadline?: string | null
          requires_approval?: boolean | null
          start_date?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          ticket_price?: number | null
          total_raised?: number | null
          updated_at?: string | null
          updated_by?: string | null
          venue_address?: string | null
          venue_name?: string | null
          virtual_link?: string | null
          waitlist_enabled?: boolean | null
        }
        Relationships: []
      }
      member_activities: {
        Row: {
          activity_description: string | null
          activity_type: string
          activity_value: number | null
          created_at: string | null
          id: string
          member_id: string
          related_communication_id: string | null
          related_donation_id: string | null
          related_event_id: string | null
        }
        Insert: {
          activity_description?: string | null
          activity_type: string
          activity_value?: number | null
          created_at?: string | null
          id?: string
          member_id: string
          related_communication_id?: string | null
          related_donation_id?: string | null
          related_event_id?: string | null
        }
        Update: {
          activity_description?: string | null
          activity_type?: string
          activity_value?: number | null
          created_at?: string | null
          id?: string
          member_id?: string
          related_communication_id?: string | null
          related_donation_id?: string | null
          related_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_activities_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_related_communication_id_fkey"
            columns: ["related_communication_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_related_donation_id_fkey"
            columns: ["related_donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "event_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_activities_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          email: string
          email_subscribed: boolean | null
          employer: string | null
          engagement_score: number | null
          first_name: string
          id: string
          interests: string[] | null
          last_donation_date: string | null
          last_name: string
          member_since: string | null
          newsletter_subscribed: boolean | null
          notes: string | null
          occupation: string | null
          phone: string | null
          sms_subscribed: boolean | null
          state: string | null
          tier: Database["public"]["Enums"]["member_tier"] | null
          total_donated: number | null
          updated_at: string | null
          updated_by: string | null
          zip_code: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email: string
          email_subscribed?: boolean | null
          employer?: string | null
          engagement_score?: number | null
          first_name: string
          id?: string
          interests?: string[] | null
          last_donation_date?: string | null
          last_name: string
          member_since?: string | null
          newsletter_subscribed?: boolean | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          sms_subscribed?: boolean | null
          state?: string | null
          tier?: Database["public"]["Enums"]["member_tier"] | null
          total_donated?: number | null
          updated_at?: string | null
          updated_by?: string | null
          zip_code?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          email?: string
          email_subscribed?: boolean | null
          employer?: string | null
          engagement_score?: number | null
          first_name?: string
          id?: string
          interests?: string[] | null
          last_donation_date?: string | null
          last_name?: string
          member_since?: string | null
          newsletter_subscribed?: boolean | null
          notes?: string | null
          occupation?: string | null
          phone?: string | null
          sms_subscribed?: boolean | null
          state?: string | null
          tier?: Database["public"]["Enums"]["member_tier"] | null
          total_donated?: number | null
          updated_at?: string | null
          updated_by?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          member_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          member_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          member_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      donation_summary: {
        Row: {
          avg_amount: number | null
          donation_count: number | null
          month: string | null
          total_amount: number | null
          unique_donors: number | null
        }
        Relationships: []
      }
      event_summary: {
        Row: {
          attendees: number | null
          available_spots: number | null
          capacity: number | null
          confirmed_registrations: number | null
          current_registrations: number | null
          end_date: string | null
          id: string | null
          name: string | null
          pending_registrations: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          ticket_price: number | null
          total_raised: number | null
          total_registrations: number | null
        }
        Relationships: []
      }
      member_summary: {
        Row: {
          avg_donation_amount: number | null
          donation_count: number | null
          email: string | null
          engagement_score: number | null
          event_registration_count: number | null
          events_attended: number | null
          full_name: string | null
          id: string | null
          last_activity_date: string | null
          last_donation_date: string | null
          member_since: string | null
          tier: Database["public"]["Enums"]["member_tier"] | null
          total_donated: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_member_tier: {
        Args: { total_amount: number }
        Returns: Database["public"]["Enums"]["member_tier"]
      }
      get_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      automation_status: "active" | "paused" | "completed" | "error"
      communication_type:
        | "newsletter"
        | "email_campaign"
        | "social_media"
        | "direct_email"
      donation_method:
        | "online"
        | "check"
        | "cash"
        | "credit_card"
        | "bank_transfer"
      event_status: "draft" | "published" | "active" | "completed" | "cancelled"
      member_tier: "bronze" | "silver" | "gold" | "platinum"
      registration_status: "pending" | "confirmed" | "cancelled" | "attended"
      user_role: "admin_role" | "treasurer_role" | "member_role"
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
      automation_status: ["active", "paused", "completed", "error"],
      communication_type: [
        "newsletter",
        "email_campaign",
        "social_media",
        "direct_email",
      ],
      donation_method: [
        "online",
        "check",
        "cash",
        "credit_card",
        "bank_transfer",
      ],
      event_status: ["draft", "published", "active", "completed", "cancelled"],
      member_tier: ["bronze", "silver", "gold", "platinum"],
      registration_status: ["pending", "confirmed", "cancelled", "attended"],
      user_role: ["admin_role", "treasurer_role", "member_role"],
    },
  },
} as const
