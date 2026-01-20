import { PromptIntent, PromptPayload } from './types';
import { QuestionRequest, PlanRequest } from '../../types/planner';

export function getPrompt(type: PromptIntent, payload: PromptPayload[PromptIntent]): string {
  switch (type) {
    case 'QUESTIONS':
      return generateQuestionsPrompt(payload as QuestionRequest);
    case 'PLAN':
      return generatePlanPrompt(payload as PlanRequest);
    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}

function generateQuestionsPrompt(request: QuestionRequest): string {
  return `
You are a senior project planner.

Your task is to ANALYZE the project idea and OUTPUT a SMALL SET of foundational questions.
This is NOT a conversation. This is structured data generation.

--- PROJECT CONTEXT ---
idea = ${request.idea}
domain = ${request.domain}
platform = ${request.platform}

--- STRICT RULES ---
- Generate EXACTLY 5 to 7 questions
- Questions must be GENERAL and HIGH-IMPACT
- No implementation or tool-specific questions
- Each question must influence planning decisions
- Each question must be answerable in one step
- At least 2 questions MUST allow custom input

--- REQUIRED QUESTION AREAS ---
- user experience level
- project intent
- scope ambition
- constraints
- risk or complexity comfort

--- OUTPUT CONTRACT ---
Return ONLY valid JSON.
Return ONLY a valid JSON object.
Do NOT include explanations, thoughts, or reasoning.
Do NOT include assignments.
The response must start with '{' and end with '}'.

Wrap the JSON EXACTLY like this:


{
  "questions": [
    {
      "id": "q1",
      "question": "Short clear question",
      "options": ["Option A", "Option B", "Option C"],
      "allowCustom": false
    }
  ],
  "remarks": {
    "viability": "High | Medium | Low",
    "complexity": "Low | Medium | High",
    "recommendation": "Proceed | Proceed with caution | Re-scope"
  }
}
`;
}

function generatePlanPrompt(request: PlanRequest): string {
  const answersText = Object.entries(request.answers)
    .map(([id, answer]) => `${id}=${answer}`)
    .join(' | ');

  return `
You are a senior project architect.

Your task is to ANALYZE the project inputs and FILL the STRUCTURED PLAN TEMPLATE below.
This is NOT creative writing. This is structured system design.

--- PROJECT CONTEXT ---
idea = ${request.idea}
domain = ${request.domain}
platform = ${request.platform}
answers = ${answersText}

--- ABSOLUTE OUTPUT RULES (NON-NEGOTIABLE) ---
- Output MUST be a single valid JSON object
- The response MUST start with '{' and end with '}'
- Use double quotes ONLY
- Do NOT include quotes inside string values
- Do NOT include explanations, reasoning, thoughts, or commentary
- Do NOT include assignments or variable names
- Do NOT include markdown or formatting
- Do NOT include emojis or special characters
- Do NOT use multi-line strings
- Keep all strings short, factual, and slot-based
- Prefer arrays over paragraphs
- If unsure, choose the safest conservative option

--- CONTENT RULES ---
- No timelines with dates, only relative descriptors
- No marketing language
- No speculative claims
- Assume a solo developer unless answers indicate otherwise
- Every section must be filled, even if minimally
- Avoid redundancy across sections

--- SECTION GUIDANCE ---
metadata:
- Focus on constraints, risk, and feasibility

overview:
- Define what is built, who it is for, and why it matters
- Follow the structure defined in the JSON.

architecture_design:
- High-level system shape only
- No implementation details
- No technology names here
- Follow the structure defined in the JSON.

tech_stack:
- One entry per layer
- Be explicit and opinionated
- Alternatives must be realistic, not exhaustive
- Follow the structure defined in the JSON.

infrastructure_and_devops:
- Production-aware but minimal
- Focus on reliability and security basics
- Follow the structure defined in the JSON.

roadmap:
- Logical execution order
- Each phase must be actionable
- No dates, only progression logic
- Follow the structure defined in the JSON.

tasks:
- Concrete implementation steps
- Verifiable outcomes only
- Avoid vague actions
- Follow the structure defined in the JSON.

next_actions:
- Immediately executable steps
- No dependencies
- Follow the structure defined in the JSON.

future_backlog:
- Clearly non-essential features
- Deferred for rational reasons
- Follow the structure defined in the JSON.

--- OUTPUT CONTRACT ---
Return ONLY valid JSON.
Give all the fields in that are in the JSON.
No text before or after.

{
  "metadata": {
    "domain": "${request.domain}",
    "platform": "${request.platform}",
    "skillLevel": "Beginner | Intermediate | Advanced",
    "estimated_effort": "Low | Medium | High",
    "budget_profile": "Low | Medium | Enterprise",
    "assumptions": [
      "Assumption one",
      "Assumption two"
    ],
    "risk_assessment": [
      {
        "risk": "Potential blocker",
        "impact": "High | Medium | Low",
        "mitigation": "Preventive action"
      }
    ]
  },

  "overview": {
    "summary_points": [
      "What is being built",
      "Who it is for",
      "Core value"
    ],
    "primary_goal": "Single measurable goal",
    "success_criteria": [
      "Clear success condition"
    ],
    "user_personas": [
      {
        "role": "User type",
        "primary_need": "Primary goal"
      }
    ]
  },

  "architecture_design": {
    "system_pattern": "Monolith | Microservices | Serverless | Event-Driven",
    "data_flow_description": "High-level data movement",
    "diagram_reference": "Textual description of flow",
    "key_entities": [
      {
        "name": "Entity name",
        "attributes": ["attribute1", "attribute2"],
        "relationships": "Relationship description"
      }
    ]
  },

  "tech_stack": [
    {
      "layer": "frontend | backend | database | ai | auth | deployment | observability",
      "technology": "Technology name",
      "variant": "Exact setup",
      "usage_area": "Where used",
      "decision_factors": {
        "why_recommended": ["Reason"],
        "learning_value": "Low | Medium | High",
        "complexity_level": "Low | Medium | High",
        "scalability_ceiling": "When replacement is needed"
      },
      "core_packages": [
        {
          "name": "package-name",
          "purpose": "Purpose",
          "criticality": "Essential | Optional"
        }
      ],
      "pros": ["Advantage"],
      "cons": ["Limitation"],
      "alternatives": [
        {
          "technology": "Alternative",
          "when_to_choose": "Specific case",
          "tradeoff": "Primary downside"
        }
      ]
    }
  ],

  "infrastructure_and_devops": {
    "hosting_provider": "AWS | Vercel | GCP | Railway",
    "ci_cd_pipeline": "GitHub Actions | GitLab CI",
    "monitoring_strategy": "Logging | Tracing | Error Tracking",
    "security_measures": [
      "Authentication enforcement",
      "Data encryption",
      "Access control"
    ]
  },

  "roadmap": [
    {
      "phase_id": "phase-1",
      "title": "Phase title",
      "intent": "Phase purpose",
      "estimated_duration": "Short | Medium | Long",
      "deliverables": [
        "Deliverable"
      ],
      "milestone_gate": "Condition to proceed"
    }
  ],

  "tasks": [
    {
      "id": "task-1",
      "phase_id": "phase-1",
      "title": "Action",
      "description": "Implementation step",
      "technical_notes": "Key consideration",
      "difficulty": "1-5",
      "dependencies": [],
      "checkable": true,
      "verification_step": "Validation method"
    }
  ],

  "next_actions": [
    "Immediate executable step"
  ],

  "future_backlog": [
    {
      "feature": "Deferred feature",
      "reason_for_delay": "Non-critical"
    }
  ]
}
`;
}
