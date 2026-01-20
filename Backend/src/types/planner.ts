export type Domain = 'tech' | 'non-tech' | 'academic' | 'creative';
export type Platform = 'web' | 'mobile' | 'desktop' | 'api' | 'custom';

export interface QuestionRequest {
  idea: string;
  domain: Domain;
  platform: Platform;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  allowCustom: boolean;
}
export interface QuestionsRemarks {
  viability: string;
  complexity: string;
  recommendation: string;
}

export interface QuestionsResponse {
  questions: Question[];
  remarks: QuestionsRemarks;
}

export interface AnswerMap {
  [questionId: string]: string;
}

export interface PlanRequest {
  projectId: string;
  answers: AnswerMap;
  idea: string;
  platform: Platform;
  domain: Domain;
}
export interface PlanRisk {
  risk: string;
  impact: 'High' | 'Medium' | 'Low' | string;
  mitigation: string;
}

export interface PlanMetadata {
  domain: string;
  platform: string;
  skillLevel: string;
  estimated_effort: string;
  budget_profile: string;
  assumptions: string[];
  risk_assessment: PlanRisk[];
}

export interface UserPersona {
  role: string;
  primary_need: string;
}

export interface PlanOverview {
  summary_points: string[];
  primary_goal: string;
  success_criteria: string[];
  user_personas: UserPersona[];
}
export interface ArchitectureEntity {
  name: string;
  attributes: string[];
  relationships: string;
}

export interface ArchitectureDesign {
  system_pattern: string;
  data_flow_description: string;
  diagram_reference: string;
  key_entities: ArchitectureEntity[];
}
export interface TechDecisionFactors {
  why_recommended: string[];
  learning_value: string;
  complexity_level: string;
  scalability_ceiling: string;
}

export interface CorePackage {
  name: string;
  purpose: string;
  criticality: 'Essential' | 'Optional';
}

export interface TechAlternative {
  technology: string;
  when_to_choose: string;
  tradeoff: string;
}

export interface TechStackItem {
  layer: string;
  technology: string;
  variant: string;
  usage_area: string;
  decision_factors: TechDecisionFactors;
  core_packages: CorePackage[];
  pros: string[];
  cons: string[];
  alternatives: TechAlternative[];
}
export interface InfrastructureAndDevOps {
  hosting_provider: string;
  ci_cd_pipeline: string;
  monitoring_strategy: string;
  security_measures: string[];
}

export interface DecisionAlternative {
  option: string;
  tradeoff: string;
}
export interface RoadmapPhase {
  phase_id: string;
  title: string;
  intent: string;
  estimated_duration: string;
  deliverables: string[];
  milestone_gate: string;
}

export interface Task {
  id: string;
  phase_id: string;
  title: string;
  description: string;
  technical_notes: string;
  difficulty: string;
  dependencies: string[];
  checkable: boolean;
  verification_step: string;
}

export interface FutureBacklogItem {
  feature: string;
  reason_for_delay: string;
}

export interface PlanResponse {
  metadata: PlanMetadata;
  overview: PlanOverview;
  architecture_design: ArchitectureDesign;
  tech_stack: TechStackItem[];
  infrastructure_and_devops: InfrastructureAndDevOps;
  roadmap: RoadmapPhase[];
  tasks: Task[];
  next_actions: string[];
  future_backlog: FutureBacklogItem[];
}
