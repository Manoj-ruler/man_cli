export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      command_queries: {
        Row: {
          id: string;
          user_id: string;
          query_text: string;
          matched_command: string;
          category: string | null;
          response_time_ms: number | null;
          success: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          query_text: string;
          matched_command: string;
          category?: string | null;
          response_time_ms?: number | null;
          success?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          query_text?: string;
          matched_command?: string;
          category?: string | null;
          response_time_ms?: number | null;
          success?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      custom_snippets: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          command: string;
          description: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          label: string;
          command: string;
          description?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          command?: string;
          description?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      api_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          token: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
