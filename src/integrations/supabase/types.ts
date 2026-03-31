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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          featured_image: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          seo_title: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          base_content: string | null
          cover_image: string | null
          created_at: string
          h1: string | null
          id: string
          meta_description: string | null
          name: string
          seo_title: string | null
          slug: string
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          base_content?: string | null
          cover_image?: string | null
          created_at?: string
          h1?: string | null
          id?: string
          meta_description?: string | null
          name: string
          seo_title?: string | null
          slug: string
          state?: string
          status?: string
          updated_at?: string
        }
        Update: {
          base_content?: string | null
          cover_image?: string | null
          created_at?: string
          h1?: string | null
          id?: string
          meta_description?: string | null
          name?: string
          seo_title?: string | null
          slug?: string
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      neighborhoods: {
        Row: {
          base_content: string | null
          city_id: string
          cover_image: string | null
          created_at: string
          h1: string | null
          id: string
          meta_description: string | null
          name: string
          seo_title: string | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          base_content?: string | null
          city_id: string
          cover_image?: string | null
          created_at?: string
          h1?: string | null
          id?: string
          meta_description?: string | null
          name: string
          seo_title?: string | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          base_content?: string | null
          city_id?: string
          cover_image?: string | null
          created_at?: string
          h1?: string | null
          id?: string
          meta_description?: string | null
          name?: string
          seo_title?: string | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          featured_image: string | null
          h1: string | null
          id: string
          meta_description: string | null
          page_type: string
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          h1?: string | null
          id?: string
          meta_description?: string | null
          page_type?: string
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          featured_image?: string | null
          h1?: string | null
          id?: string
          meta_description?: string | null
          page_type?: string
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          benefits: string[] | null
          cover_image: string | null
          created_at: string
          faq: Json | null
          h1: string | null
          icon: string | null
          id: string
          keywords: string[] | null
          long_description: string | null
          meta_description: string | null
          name: string
          problems: string[] | null
          seo_title: string | null
          short_description: string | null
          slug: string
          sort_order: number | null
          status: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          cover_image?: string | null
          created_at?: string
          faq?: Json | null
          h1?: string | null
          icon?: string | null
          id?: string
          keywords?: string[] | null
          long_description?: string | null
          meta_description?: string | null
          name: string
          problems?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          cover_image?: string | null
          created_at?: string
          faq?: Json | null
          h1?: string | null
          icon?: string | null
          id?: string
          keywords?: string[] | null
          long_description?: string | null
          meta_description?: string | null
          name?: string
          problems?: string[] | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          business_hours: string | null
          company_name: string | null
          created_at: string
          email: string | null
          favicon_url: string | null
          global_scripts: string | null
          hero_image: string | null
          id: string
          logo_url: string | null
          phone: string | null
          updated_at: string
          whatsapp: string | null
          whatsapp_message: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          favicon_url?: string | null
          global_scripts?: string | null
          hero_image?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          favicon_url?: string | null
          global_scripts?: string | null
          hero_image?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
