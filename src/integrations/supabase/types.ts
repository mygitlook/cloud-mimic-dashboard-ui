export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          resource: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          resource: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          resource?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          invoice_data: Json
          month: number
          total_amount: number
          user_id: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_data: Json
          month: number
          total_amount: number
          user_id?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_data?: Json
          month?: number
          total_amount?: number
          user_id?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "billing_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_summary: {
        Row: {
          billing_period: string
          currency: string | null
          generated_at: string | null
          id: string
          invoice_data: Json | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_period: string
          currency?: string | null
          generated_at?: string | null
          id?: string
          invoice_data?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_period?: string
          currency?: string | null
          generated_at?: string | null
          id?: string
          invoice_data?: Json | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_attachments: {
        Row: {
          campaign_id: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_attachments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          failed_count: number | null
          id: string
          message: string | null
          name: string
          sent_count: number | null
          status: string | null
          total_contacts: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failed_count?: number | null
          id?: string
          message?: string | null
          name: string
          sent_count?: number | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          failed_count?: number | null
          id?: string
          message?: string | null
          name?: string
          sent_count?: number | null
          status?: string | null
          total_contacts?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          campaign_id: string | null
          created_at: string
          delivered_at: string | null
          group_name: string | null
          id: string
          name: string
          phone: string
          sent_at: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          group_name?: string | null
          id?: string
          name: string
          phone: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          group_name?: string | null
          id?: string
          name?: string
          phone?: string
          sent_at?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      iam_group_policies: {
        Row: {
          assigned_at: string | null
          group_id: string | null
          id: string
          policy_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          group_id?: string | null
          id?: string
          policy_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          group_id?: string | null
          id?: string
          policy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iam_group_policies_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "iam_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iam_group_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "iam_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      iam_groups: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      iam_policies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          policy_document: Json
          policy_type: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          policy_document: Json
          policy_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          policy_document?: Json
          policy_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      iam_user_groups: {
        Row: {
          assigned_at: string | null
          group_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iam_user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "iam_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iam_user_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "iam_users"
            referencedColumns: ["id"]
          },
        ]
      }
      iam_user_policies: {
        Row: {
          assigned_at: string | null
          id: string
          policy_id: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iam_user_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "iam_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iam_user_policies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "iam_users"
            referencedColumns: ["id"]
          },
        ]
      }
      iam_users: {
        Row: {
          console_access: boolean | null
          created_at: string | null
          created_by: string | null
          email: string
          full_name: string | null
          id: string
          last_activity: string | null
          mfa_enabled: boolean | null
          password_hash: string
          programmatic_access: boolean | null
          status: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          console_access?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email: string
          full_name?: string | null
          id?: string
          last_activity?: string | null
          mfa_enabled?: boolean | null
          password_hash: string
          programmatic_access?: boolean | null
          status?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          console_access?: boolean | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          full_name?: string | null
          id?: string
          last_activity?: string | null
          mfa_enabled?: boolean | null
          password_hash?: string
          programmatic_access?: boolean | null
          status?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      instances: {
        Row: {
          ami: string | null
          created_at: string | null
          id: string
          name: string
          private_ip: string | null
          public_ip: string | null
          state: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ami?: string | null
          created_at?: string | null
          id: string
          name: string
          private_ip?: string | null
          public_ip?: string | null
          state: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ami?: string | null
          created_at?: string | null
          id?: string
          name?: string
          private_ip?: string | null
          public_ip?: string | null
          state?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          permissions: Json | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          permissions?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      service_usage: {
        Row: {
          billing_period: string
          id: string
          metadata: Json | null
          quantity: number
          recorded_at: string | null
          resource_id: string | null
          service_type: string
          total_cost: number
          unit_cost: number
          usage_type: string
          user_id: string | null
        }
        Insert: {
          billing_period: string
          id?: string
          metadata?: Json | null
          quantity: number
          recorded_at?: string | null
          resource_id?: string | null
          service_type: string
          total_cost: number
          unit_cost: number
          usage_type: string
          user_id?: string | null
        }
        Update: {
          billing_period?: string
          id?: string
          metadata?: Json | null
          quantity?: number
          recorded_at?: string | null
          resource_id?: string | null
          service_type?: string
          total_cost?: number
          unit_cost?: number
          usage_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          cost_per_hour: number
          created_at: string | null
          id: string
          service_name: string
          service_type: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cost_per_hour: number
          created_at?: string | null
          id?: string
          service_name: string
          service_type: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cost_per_hour?: number
          created_at?: string | null
          id?: string
          service_name?: string
          service_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_billing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_monthly_billing: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      track_service_usage: {
        Args: {
          p_user_id: string
          p_service_type: string
          p_resource_id: string
          p_usage_type: string
          p_quantity: number
          p_unit_cost: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
