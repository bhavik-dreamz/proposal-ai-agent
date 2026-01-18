export type ProjectType = 'MERN' | 'MEAN' | 'WordPress' | 'PHP' | 'Shopify';

export type Complexity = 'simple' | 'medium' | 'complex';

export type ProposalStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  client_name: string;
  client_email?: string;
  project_type: ProjectType;
  requirements: string;
  generated_proposal?: string;
  cost_estimate?: number;
  timeline_weeks?: number;
  complexity?: Complexity;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  embedding?: number[];
}

export interface Template {
  id: string;
  name: string;
  project_type: ProjectType;
  description?: string;
  content: string;
  sections: {
    executive_summary?: boolean;
    understanding?: boolean;
    solution?: boolean;
    technical?: boolean;
    timeline?: boolean;
    pricing?: boolean;
    next_steps?: boolean;
  };
  is_active: boolean;
  created_at: string;
}

export interface TechStack {
  id: string;
  name: ProjectType;
  description?: string;
  typical_features: string[];
  base_cost: number;
  cost_per_feature: number;
  base_timeline_weeks: number;
  additional_info: {
    strengths?: string[];
    best_for?: string[];
  };
  created_at: string;
}

export interface SampleProposal {
  id: string;
  title: string;
  project_type: ProjectType;
  full_content: string;
  requirements_excerpt: string;
  cost: number;
  timeline_weeks: number;
  is_approved: boolean;
  created_at: string;
  embedding?: number[];
}

export interface PricingRule {
  id: string;
  feature_name: string;
  project_type?: ProjectType;
  base_cost: number;
  time_hours: number;
  complexity_multiplier: {
    simple: number;
    medium: number;
    complex: number;
  };
  created_at: string;
}

export interface ProposalGenerationRequest {
  client_name: string;
  client_email?: string;
  requirements: string;
  project_type?: ProjectType;
  complexity?: Complexity;
}

export interface ProposalGenerationResponse {
  proposal: string;
  cost_estimate: number;
  timeline_weeks: number;
  project_type: ProjectType;
  complexity: Complexity;
  similar_proposals?: SampleProposal[];
}
