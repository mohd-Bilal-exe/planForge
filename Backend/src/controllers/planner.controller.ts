import { Response } from 'express';
import { getQuestions, getPlan } from '../services/planner.service';
import { sendSuccess, sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { QuestionRequest, PlanRequest } from '../types/planner';
import { FirebaseAuthRequest } from '../middlewares/firebaseAuth.middleware';

export async function questionsController(req: FirebaseAuthRequest, res: Response): Promise<void> {
  try {
    const { idea, domain, platform, projectId } = req.body;

    if (!idea || !domain || !platform || !projectId) {
      sendError(res, 'Idea, domain, platform, and projectId are required', 400);
      return;
    }

    if (!req.user?.uid) {
      sendError(res, 'User authentication required', 401);
      return;
    }

    const request: QuestionRequest = {
      idea: String(idea),
      domain: domain as QuestionRequest['domain'],
      platform: platform as QuestionRequest['platform'],
    };

    const result = await getQuestions(request, String(projectId), req.user.uid);
    sendSuccess(res, result);
  } catch (error) {
    logger.error('Questions generation error', { error });
    const message = error instanceof Error ? error.message : 'Failed to generate questions';
    sendError(res, message, 400);
  }
}

export async function planController(req: FirebaseAuthRequest, res: Response): Promise<void> {
  try {
    const { projectId, answers } = req.body;

    if (!projectId || !answers) {
      sendError(res, 'ProjectId and answers are required', 400);
      return;
    }

    if (typeof answers !== 'object' || answers === null) {
      sendError(res, 'Answers must be an object', 400);
      return;
    }

    if (!req.user?.uid) {
      sendError(res, 'User authentication required', 401);
      return;
    }

    const request: PlanRequest = {
      idea: req.body.idea ?? '',
      domain: req.body.domain ?? '',
      platform: req.body.platform ?? '',
      projectId: String(projectId),
      answers: answers as PlanRequest['answers'],
    };

    const result = await getPlan(request, req.user.uid);
    sendSuccess(res, result);
  } catch (error) {
    logger.error('Plan generation error', { error });
    const message = error instanceof Error ? error.message : 'Failed to generate plan';
    sendError(res, message, 400);
  }
}
