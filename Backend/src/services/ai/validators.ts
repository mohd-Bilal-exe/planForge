import { Question } from '../../types/planner';

export function validateQuestionsResponse(data: unknown): {
  questions: Question[];
  remarks: {
    viability: string;
    complexity: string;
    recommendation: string;
  };
} {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Questions response must be an object');
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.questions)) {
    throw new Error('questions must be an array');
  }

  const questionsArray = obj.questions;

  if (questionsArray.length < 5 || questionsArray.length > 7) {
    throw new Error('Must generate 5-7 questions');
  }

  const customAllowedCount = questionsArray.filter(
    q => typeof q === 'object' && q !== null && (q as any).allowCustom === true
  ).length;

  if (customAllowedCount < 2) {
    throw new Error('At least 2 questions must allow custom input');
  }

  const questions: Question[] = questionsArray.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Invalid question at index ${index}`);
    }

    const q = item as Record<string, unknown>;

    if (typeof q.id !== 'string' || typeof q.question !== 'string' || !Array.isArray(q.options)) {
      throw new Error(`Question at index ${index} missing required fields`);
    }

    if (q.options.length < 3 || q.options.length > 5) {
      throw new Error(`Question at index ${index} must have 3-5 options`);
    }

    return {
      id: q.id,
      question: q.question,
      options: q.options.map(String),
      allowCustom: Boolean(q.allowCustom),
    };
  });

  if (typeof obj.remarks !== 'object' || obj.remarks === null) {
    throw new Error('remarks must be an object');
  }

  const remarks = obj.remarks as Record<string, unknown>;

  return {
    questions,
    remarks: {
      viability: String(remarks.viability || ''),
      complexity: String(remarks.complexity || ''),
      recommendation: String(remarks.recommendation || ''),
    },
  };
}
import { PlanResponse } from '../../types/planner';

export function validatePlanResponse(data: unknown): PlanResponse {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Plan must be an object');
  }

  const plan = data as Record<string, unknown>;

  // ---- METADATA ----
  if (typeof plan.metadata !== 'object' || plan.metadata === null) {
    throw new Error('Plan missing metadata');
  }

  const m = plan.metadata as Record<string, unknown>;

  // ---- OVERVIEW ----
  if (typeof plan.overview !== 'object' || plan.overview === null) {
    throw new Error('Plan missing overview');
  }

  const o = plan.overview as Record<string, unknown>;

  // ---- ARCHITECTURE ----
  if (typeof plan.architecture_design !== 'object' || plan.architecture_design === null) {
    throw new Error('Plan missing architecture_design');
  }

  const arch = plan.architecture_design as Record<string, unknown>;

  // ---- TECH STACK ----
  if (!Array.isArray(plan.tech_stack)) {
    throw new Error('tech_stack must be an array');
  }

  // ---- ROADMAP ----
  if (!Array.isArray(plan.roadmap)) {
    throw new Error('roadmap must be an array');
  }

  // ---- TASKS ----
  if (!Array.isArray(plan.tasks)) {
    throw new Error('tasks must be an array');
  }

  // ---- NEXT ACTIONS ----
  if (!Array.isArray(plan.next_actions)) {
    throw new Error('next_actions must be an array');
  }

  // ---- FUTURE BACKLOG ----
  if (!Array.isArray(plan.future_backlog)) {
    throw new Error('future_backlog must be an array');
  }

  return {
    metadata: {
      domain: String(m.domain || ''),
      platform: String(m.platform || ''),
      skillLevel: String(m.skillLevel || ''),
      estimated_effort: String(m.estimated_effort || ''),
      budget_profile: String(m.budget_profile || ''),
      assumptions: Array.isArray(m.assumptions) ? m.assumptions.map(String) : [],
      risk_assessment: Array.isArray(m.risk_assessment)
        ? m.risk_assessment.map((r: any) => ({
            risk: String(r.risk || ''),
            impact: String(r.impact || ''),
            mitigation: String(r.mitigation || ''),
          }))
        : [],
    },

    overview: {
      summary_points: Array.isArray(o.summary_points) ? o.summary_points.map(String) : [],
      primary_goal: String(o.primary_goal || ''),
      success_criteria: Array.isArray(o.success_criteria) ? o.success_criteria.map(String) : [],
      user_personas: Array.isArray(o.user_personas)
        ? o.user_personas.map((p: any) => ({
            role: String(p.role || ''),
            primary_need: String(p.primary_need || ''),
          }))
        : [],
    },

    architecture_design: {
      system_pattern: String(arch.system_pattern || ''),
      data_flow_description: String(arch.data_flow_description || ''),
      diagram_reference: String(arch.diagram_reference || ''),
      key_entities: Array.isArray(arch.key_entities)
        ? arch.key_entities.map((e: any) => ({
            name: String(e.name || ''),
            attributes: Array.isArray(e.attributes) ? e.attributes.map(String) : [],
            relationships: String(e.relationships || ''),
          }))
        : [],
    },

    tech_stack: (plan.tech_stack as any[]).map(t => ({
      layer: String(t.layer || ''),
      technology: String(t.technology || ''),
      variant: String(t.variant || ''),
      usage_area: String(t.usage_area || ''),
      decision_factors: {
        why_recommended: Array.isArray(t.decision_factors?.why_recommended)
          ? t.decision_factors.why_recommended.map(String)
          : [],
        learning_value: String(t.decision_factors?.learning_value || ''),
        complexity_level: String(t.decision_factors?.complexity_level || ''),
        scalability_ceiling: String(t.decision_factors?.scalability_ceiling || ''),
      },
      core_packages: Array.isArray(t.core_packages)
        ? t.core_packages.map((p: any) => ({
            name: String(p.name || ''),
            purpose: String(p.purpose || ''),
            criticality: String(p.criticality || ''),
          }))
        : [],
      pros: Array.isArray(t.pros) ? t.pros.map(String) : [],
      cons: Array.isArray(t.cons) ? t.cons.map(String) : [],
      alternatives: Array.isArray(t.alternatives)
        ? t.alternatives.map((a: any) => ({
            technology: String(a.technology || ''),
            when_to_choose: String(a.when_to_choose || ''),
            tradeoff: String(a.tradeoff || ''),
          }))
        : [],
    })),

    infrastructure_and_devops: {
      hosting_provider: String((plan.infrastructure_and_devops as any)?.hosting_provider || ''),
      ci_cd_pipeline: String((plan.infrastructure_and_devops as any)?.ci_cd_pipeline || ''),
      monitoring_strategy: String((plan.infrastructure_and_devops as any)?.monitoring_strategy || ''),
      security_measures: Array.isArray((plan.infrastructure_and_devops as any)?.security_measures)
        ? (plan.infrastructure_and_devops as any).security_measures.map(String)
        : [],
    },

    roadmap: (plan.roadmap as any[]).map((r, index) => ({
      phase_id: String(r.phase_id || `phase-${index + 1}`),
      title: String(r.title || ''),
      intent: String(r.intent || ''),
      estimated_duration: String(r.estimated_duration || ''),
      deliverables: Array.isArray(r.deliverables) ? r.deliverables.map(String) : [],
      milestone_gate: String(r.milestone_gate || ''),
    })),

    tasks: (plan.tasks as any[]).map((t, index) => ({
      id: String(t.id || `task-${index + 1}`),
      phase_id: String(t.phase_id || ''),
      title: String(t.title || ''),
      description: String(t.description || ''),
      technical_notes: String(t.technical_notes || ''),
      difficulty: String(t.difficulty || ''),
      dependencies: Array.isArray(t.dependencies) ? t.dependencies.map(String) : [],
      checkable: Boolean(t.checkable),
      verification_step: String(t.verification_step || ''),
    })),

    next_actions: (plan.next_actions as unknown[]).map(String),

    future_backlog: (plan.future_backlog as any[]).map(f => ({
      feature: String(f.feature || ''),
      reason_for_delay: String(f.reason_for_delay || ''),
    })),
  };
}
