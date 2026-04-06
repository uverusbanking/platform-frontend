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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      approval_actions: {
        Row: {
          action: Database["public"]["Enums"]["approval_action_type"]
          actor_id: string
          actor_name: string
          actor_role: string
          approval_request_id: string
          comment: string | null
          created_at: string
          id: string
          step_number: number
        }
        Insert: {
          action: Database["public"]["Enums"]["approval_action_type"]
          actor_id: string
          actor_name: string
          actor_role: string
          approval_request_id: string
          comment?: string | null
          created_at?: string
          id?: string
          step_number?: number
        }
        Update: {
          action?: Database["public"]["Enums"]["approval_action_type"]
          actor_id?: string
          actor_name?: string
          actor_role?: string
          approval_request_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_actions_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          created_at: string
          current_step: number
          due_by: string | null
          id: string
          payment_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["approval_status"]
          total_steps: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          due_by?: string | null
          id?: string
          payment_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["approval_status"]
          total_steps?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          due_by?: string | null
          id?: string
          payment_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["approval_status"]
          total_steps?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          account_number: string
          amount: number
          bank_name: string
          created_at: string
          currency: string
          id: string
          memo: string | null
          recipient_tag: string | null
          schedule: Database["public"]["Enums"]["schedule_type"]
          source_account: string
          source_account_label: string | null
          status: Database["public"]["Enums"]["payment_status"]
          submitted_by: string
          submitted_by_name: string
          submitted_by_role: string
          updated_at: string
          batch_id: string | null
          mandate_id: string | null
        }
        Insert: {
          account_number: string
          amount: number
          bank_name: string
          created_at?: string
          currency?: string
          id?: string
          memo?: string | null
          recipient_tag?: string | null
          schedule?: Database["public"]["Enums"]["schedule_type"]
          source_account: string
          source_account_label?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          submitted_by: string
          submitted_by_name: string
          submitted_by_role?: string
          updated_at?: string
          batch_id?: string | null
          mandate_id?: string | null
        }
        Update: {
          account_number?: string
          amount?: number
          bank_name?: string
          created_at?: string
          currency?: string
          id?: string
          memo?: string | null
          recipient_tag?: string | null
          schedule?: Database["public"]["Enums"]["schedule_type"]
          source_account?: string
          source_account_label?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          submitted_by?: string
          submitted_by_name?: string
          submitted_by_role?: string
          updated_at?: string
          batch_id?: string | null
          mandate_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payment_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_mandate_id_fkey"
            columns: ["mandate_id"]
            isOneToOne: false
            referencedRelation: "payment_mandates"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_batches: {
        Row: {
          id: string
          name: string
          total_recipients: number
          total_amount: number
          status: Database["public"]["Enums"]["payment_status"]
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          total_recipients?: number
          total_amount?: number
          status?: Database["public"]["Enums"]["payment_status"]
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          total_recipients?: number
          total_amount?: number
          status?: Database["public"]["Enums"]["payment_status"]
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_mandates: {
        Row: {
          id: string
          recipient: string
          description: string | null
          frequency: string
          amount: number
          status: string
          next_payment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipient: string
          description?: string | null
          frequency: string
          amount?: number
          status?: string
          next_payment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipient?: string
          description?: string | null
          frequency?: string
          amount?: number
          status?: string
          next_payment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          counterparty: string
          created_at: string
          currency: string
          direction: string
          id: string
          memo: string | null
          payment_id: string | null
          source_account: string
          status: Database["public"]["Enums"]["transaction_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          counterparty: string
          created_at?: string
          currency?: string
          direction?: string
          id?: string
          memo?: string | null
          payment_id?: string | null
          source_account: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          counterparty?: string
          created_at?: string
          currency?: string
          direction?: string
          id?: string
          memo?: string | null
          payment_id?: string | null
          source_account?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      approval_action_type: "approved" | "rejected" | "commented" | "escalated"
      approval_status: "pending" | "approved" | "rejected" | "escalated"
      payment_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "processing"
        | "completed"
        | "failed"
      priority_level: "normal" | "high" | "critical"
      schedule_type: "immediate" | "scheduled" | "recurring"
      transaction_status: "processing" | "completed" | "failed"
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
      approval_action_type: ["approved", "rejected", "commented", "escalated"],
      approval_status: ["pending", "approved", "rejected", "escalated"],
      payment_status: [
        "draft",
        "pending",
        "approved",
        "rejected",
        "processing",
        "completed",
        "failed",
      ],
      priority_level: ["normal", "high", "critical"],
      schedule_type: ["immediate", "scheduled", "recurring"],
      transaction_status: ["processing", "completed", "failed"],
    },
  },
} as const
