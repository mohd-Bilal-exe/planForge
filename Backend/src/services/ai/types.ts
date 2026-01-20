import { QuestionRequest, PlanRequest } from '../../types/planner';

export type PromptIntent = 'QUESTIONS' | 'PLAN';

export interface PromptPayload {
  QUESTIONS: QuestionRequest;
  PLAN: PlanRequest;
}

export interface GeminiResponse {
  text: string;
}
