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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      eventos: {
        Row: {
          confirmado_em: string | null
          created_at: string | null
          id: string
          observacoes: string | null
          orcamento_id: string | null
          pdf_url: string | null
          realizado_em: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          confirmado_em?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          pdf_url?: string | null
          realizado_em?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmado_em?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          pdf_url?: string | null
          realizado_em?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_estoque: {
        Row: {
          created_at: string | null
          id: string
          motivo: string | null
          produto_id: string | null
          quantidade_anterior: number
          quantidade_atual: number
          quantidade_movimentada: number
          tipo_movimentacao: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade_anterior: number
          quantidade_atual: number
          quantidade_movimentada: number
          tipo_movimentacao: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade_anterior?: number
          quantidade_atual?: number
          quantidade_movimentada?: number
          tipo_movimentacao?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cpf: string | null
          created_at: string | null
          created_by: string | null
          evento_data: string
          evento_hora: string | null
          evento_local: string
          evento_nome: string
          id: string
          margem_lucro: number | null
          modo_pagamento: string
          nome_contratante: string
          observacoes: string | null
          pdf_url: string | null
          status: string | null
          telefone: string | null
          tipo: string
          updated_at: string | null
          valor_total: number | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          evento_data: string
          evento_hora?: string | null
          evento_local: string
          evento_nome: string
          id?: string
          margem_lucro?: number | null
          modo_pagamento: string
          nome_contratante: string
          observacoes?: string | null
          pdf_url?: string | null
          status?: string | null
          telefone?: string | null
          tipo: string
          updated_at?: string | null
          valor_total?: number | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          evento_data?: string
          evento_hora?: string | null
          evento_local?: string
          evento_nome?: string
          id?: string
          margem_lucro?: number | null
          modo_pagamento?: string
          nome_contratante?: string
          observacoes?: string | null
          pdf_url?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos_produtos: {
        Row: {
          created_at: string | null
          id: string
          orcamento_id: string | null
          produto_id: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          orcamento_id?: string | null
          produto_id?: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string | null
          id?: string
          orcamento_id?: string | null
          produto_id?: string | null
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_produtos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string
          codigo: string
          created_at: string | null
          descricao_completa: string | null
          duracao_segundos: number | null
          efeito: string | null
          fabricante: string | null
          id: string
          nome_produto: string
          quantidade_disponivel: number | null
          tubos: string | null
          updated_at: string | null
          valor_compra: number
          valor_venda: number
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          codigo: string
          created_at?: string | null
          descricao_completa?: string | null
          duracao_segundos?: number | null
          efeito?: string | null
          fabricante?: string | null
          id?: string
          nome_produto: string
          quantidade_disponivel?: number | null
          tubos?: string | null
          updated_at?: string | null
          valor_compra: number
          valor_venda: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          codigo?: string
          created_at?: string | null
          descricao_completa?: string | null
          duracao_segundos?: number | null
          efeito?: string | null
          fabricante?: string | null
          id?: string
          nome_produto?: string
          quantidade_disponivel?: number | null
          tubos?: string | null
          updated_at?: string | null
          valor_compra?: number
          valor_venda?: number
        }
        Relationships: []
      }
      solicitacoes_orcamento: {
        Row: {
          created_at: string
          data_evento: string | null
          email: string | null
          enviado_email: boolean
          hora_evento: string | null
          id: string
          kit_selecionado: string | null
          localizacao_evento: string | null
          nome_completo: string
          observacoes: string | null
          tipo_evento: string | null
          tipo_solicitacao: string
          whatsapp: string
        }
        Insert: {
          created_at?: string
          data_evento?: string | null
          email?: string | null
          enviado_email?: boolean
          hora_evento?: string | null
          id?: string
          kit_selecionado?: string | null
          localizacao_evento?: string | null
          nome_completo: string
          observacoes?: string | null
          tipo_evento?: string | null
          tipo_solicitacao: string
          whatsapp: string
        }
        Update: {
          created_at?: string
          data_evento?: string | null
          email?: string | null
          enviado_email?: boolean
          hora_evento?: string | null
          id?: string
          kit_selecionado?: string | null
          localizacao_evento?: string | null
          nome_completo?: string
          observacoes?: string | null
          tipo_evento?: string | null
          tipo_solicitacao?: string
          whatsapp?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          role: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          role: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_show_as_completed: {
        Args: {
          p_allow_insufficient_stock?: boolean
          p_consumptions: Json
          p_final_value: number
          p_orcamento_id: string
        }
        Returns: Json
      }
      is_admin_user: { Args: never; Returns: boolean }
      test_as_admin: { Args: { test_query: string }; Returns: Json[] }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
