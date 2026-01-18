// This is a placeholder for Supabase database types
// In production, you would generate this using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
export type Database = {
  public: {
    Tables: {
      proposals: {
        Row: {
          id: string;
          client_name: string;
          client_email: string | null;
          project_type: string;
          requirements: string;
          generated_proposal: string | null;
          cost_estimate: number | null;
          timeline_weeks: number | null;
          complexity: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          embedding: number[] | null;
        };
        Insert: {
          id?: string;
          client_name: string;
          client_email?: string | null;
          project_type: string;
          requirements: string;
          generated_proposal?: string | null;
          cost_estimate?: number | null;
          timeline_weeks?: number | null;
          complexity?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          client_name?: string;
          client_email?: string | null;
          project_type?: string;
          requirements?: string;
          generated_proposal?: string | null;
          cost_estimate?: number | null;
          timeline_weeks?: number | null;
          complexity?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          embedding?: number[] | null;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          project_type: string;
          description: string | null;
          content: string;
          sections: Record<string, any>;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_type: string;
          description?: string | null;
          content: string;
          sections?: Record<string, any>;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          project_type?: string;
          description?: string | null;
          content?: string;
          sections?: Record<string, any>;
          is_active?: boolean;
          created_at?: string;
        };
      };
      tech_stacks: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          typical_features: string[];
          base_cost: number;
          cost_per_feature: number;
          base_timeline_weeks: number;
          additional_info: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          typical_features?: string[];
          base_cost: number;
          cost_per_feature: number;
          base_timeline_weeks: number;
          additional_info?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          typical_features?: string[];
          base_cost?: number;
          cost_per_feature?: number;
          base_timeline_weeks?: number;
          additional_info?: Record<string, any>;
          created_at?: string;
        };
      };
      sample_proposals: {
        Row: {
          id: string;
          title: string;
          project_type: string;
          full_content: string;
          requirements_excerpt: string;
          cost: number;
          timeline_weeks: number;
          is_approved: boolean;
          created_at: string;
          embedding: number[] | null;
        };
        Insert: {
          id?: string;
          title: string;
          project_type: string;
          full_content: string;
          requirements_excerpt: string;
          cost: number;
          timeline_weeks: number;
          is_approved?: boolean;
          created_at?: string;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          project_type?: string;
          full_content?: string;
          requirements_excerpt?: string;
          cost?: number;
          timeline_weeks?: number;
          is_approved?: boolean;
          created_at?: string;
          embedding?: number[] | null;
        };
      };
      pricing_rules: {
        Row: {
          id: string;
          feature_name: string;
          project_type: string | null;
          base_cost: number;
          time_hours: number;
          complexity_multiplier: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          feature_name: string;
          project_type?: string | null;
          base_cost: number;
          time_hours: number;
          complexity_multiplier?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          feature_name?: string;
          project_type?: string | null;
          base_cost?: number;
          time_hours?: number;
          complexity_multiplier?: Record<string, any>;
          created_at?: string;
        };
      };
    };
  };
};
