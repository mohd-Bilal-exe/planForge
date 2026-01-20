import { generateQuestions } from './ai/questionGenerator';
import { generatePlan } from './ai/planGenerator';
import { QuestionRequest, QuestionsResponse, PlanRequest, PlanResponse } from '../types/planner';
import { logger } from '../utils/logger';

export async function getQuestions(
  request: QuestionRequest,
  projectId: string,
  userId: string
): Promise<QuestionsResponse> {
  logger.info('Generating questions', { request, projectId });

  // Validate input
  if (!request.idea || request.idea.trim().length === 0) {
    throw new Error('Idea is required');
  }

  if (!['Tech Product', 'Non-Tech', 'Academic', 'Creative'].includes(request.domain)) {
    throw new Error("Domain must be 'tech' or 'non-tech'");
  }

  if (!projectId || projectId.trim().length === 0) {
    throw new Error('Project ID is required');
  }

  const questions = await generateQuestions(request, projectId, userId);
  logger.info('Questions generated', { count: questions.questions.length });

  return questions;
}

export async function getPlan(request: PlanRequest, userId: string): Promise<PlanResponse> {
  logger.info('Generating plan', {
    projectId: request.projectId,
    answerCount: Object.keys(request.answers).length,
  });

  // Validate input
  if (!request.projectId || request.projectId.trim().length === 0) {
    throw new Error('Project ID is required');
  }

  if (!request.answers || Object.keys(request.answers).length === 0) {
    throw new Error('Answers are required');
  }

  const plan = await generatePlan(request, userId);
  logger.info('Plan generated', {
    roadmapPhases: plan.roadmap.length,
    decisions: plan.decisions.length,
    tasks: plan.tasks.length,
  });

  return plan;
}
