export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          user_id: string
          username: string
          bio: string | null
          template: "creator" | "shop" | "coach"
          color_scheme: string
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          bio?: string | null
          template?: "creator" | "shop" | "coach"
          color_scheme?: string
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          bio?: string | null
          template?: "creator" | "shop" | "coach"
          color_scheme?: string
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          page_id: string
          title: string
          url: string
          icon: string | null
          click_count: number
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          title: string
          url: string
          icon?: string | null
          click_count?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          title?: string
          url?: string
          icon?: string | null
          click_count?: number
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          page_id: string
          view_date: string
          views: number
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          view_date?: string
          views?: number
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          view_date?: string
          views?: number
          created_at?: string
        }
      }
    }
    Functions: {
      increment_page_views: {
        Args: { page_uuid: string }
        Returns: void
      }
      increment_link_clicks: {
        Args: { link_uuid: string }
        Returns: void
      }
    }
  }
}
