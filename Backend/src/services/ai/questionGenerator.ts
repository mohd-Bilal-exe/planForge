import { isAiAvailable } from '../../config/gemini';
import { getPrompt } from './promptFactory';
import { validateQuestionsResponse } from './validators';
import { QuestionRequest, QuestionsResponse, Question } from '../../types/planner';
import { logger } from '../../utils/logger';
import { getFirestore } from '../../config/firebase';
import { chatManager } from './chatManager';
import extractJsonBlock from './jsonExtractor';

export async function generateQuestions(
  request: QuestionRequest,
  projectId: string,
  userId: string
): Promise<QuestionsResponse> {
  if (!isAiAvailable()) {
    logger.warn('Gemini API key not available, returning mock questions');
    const mockQuestions = getMockQuestions();
    return mockQuestions;
  }

  try {
    const prompt = getPrompt('QUESTIONS', request);

    // Create or get chat session for this project
    const chatSession = chatManager.createChat(projectId, userId);

    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = await response.text();
    const jsonString = extractJsonBlock(text);
    const parsed = JSON.parse(jsonString);

    // Validate structure using validator
    const validatedData = validateQuestionsResponse(parsed);

    const responseData: QuestionsResponse = {
      questions: validatedData.questions,
      remarks: validatedData.remarks,
    };

    // Save to Firestore
    await saveQuestionsToFirestore(projectId, userId, validatedData.questions, validatedData.remarks);

    logger.info('Questions generated and saved', {
      projectId,
      questionCount: validatedData.questions.length,
    });

    return responseData;
  } catch (error) {
    logger.error('Error generating questions', { error, request });
    console.log(error);
    // Fallback to mock on error
    const mockQuestions = getMockQuestions();
    await saveQuestionsToFirestore(
      projectId,
      userId,
      mockQuestions.questions,
      mockQuestions.remarks
    );
    return mockQuestions;
  }
}

async function saveQuestionsToFirestore(
  projectId: string,
  userId: string,
  questions: Question[],
  remarks: { viability: string; complexity: string; recommendation: string }
): Promise<void> {
  try {
    const db = getFirestore();
    const projectRef = db.collection('projects').doc(projectId);
    const userRef = db.collection('users').doc(userId);
    await projectRef.set(
      {
        questions: questions.map(question => ({
          ...question,
          createdAt: new Date(),
        })),
        remarks,
        userRef,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    logger.info('Questions and remarks saved to project document', {
      projectId,
      count: questions.length,
    });
  } catch (error) {
    logger.error('Failed to save questions to Firestore', { error, projectId });
    // Don't throw - allow response to continue even if Firestore write fails
  }
}

function getMockQuestions(): QuestionsResponse {
  return {
    questions: [
      {
        id: 'q1',
        question: 'What is your experience level?',
        options: ['Beginner', 'Intermediate', 'Advanced'],
        allowCustom: false,
      },
      {
        id: 'q2',
        question: 'What is your team size?',
        options: ['Solo developer', 'Small team (2-5)', 'Large team (6+)'],
        allowCustom: false,
      },
      {
        id: 'q3',
        question: 'What is your primary goal?',
        options: ['Learning', 'Building a product', 'Portfolio project'],
        allowCustom: true,
      },
      {
        id: 'q4',
        question: 'What tools or frameworks are you familiar with?',
        options: ['React', 'Vue', 'Angular', 'None'],
        allowCustom: true,
      },
      {
        id: 'q5',
        question: 'What are your main constraints?',
        options: ['Time', 'Budget', 'Resources', 'None'],
        allowCustom: true,
      },
    ],
    remarks: {
      viability: 'High',
      complexity: 'Medium',
      recommendation: 'Proceed',
    },
  };
}
