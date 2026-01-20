import { isAiAvailable } from '../../config/gemini';
import { validatePlanResponse } from './validators';
import { PlanRequest, PlanResponse } from '../../types/planner';
import { logger } from '../../utils/logger';
import { getFirestore } from '../../config/firebase';
import { chatManager } from './chatManager';
import { getPrompt } from './promptFactory';
import extractJsonBlock from './jsonExtractor';

export async function generatePlan(request: PlanRequest, userId: string): Promise<PlanResponse> {
  if (!isAiAvailable()) {
    logger.warn('Gemini API key not available, returning mock plan');
    const mockPlan = getMockPlan();
    await savePlanToFirestore(request.projectId, userId, mockPlan);
    return mockPlan;
  }

  try {
    // Get existing chat session
    const chatSession = chatManager.getChat(request.projectId);
    if (!chatSession) {
      throw new Error('No active chat session found. Please generate questions first.');
    }

    const planPrompt = getPrompt('PLAN', request);

    const result = await chatSession.sendMessage(planPrompt);
    const response = await result.response;
    const text = response.text();
    logger.info('Raw response from AI:', { text });
    // Parse JSON from response
    const jsonString = extractJsonBlock(text);
    const parsed = JSON.parse(jsonString);

    // Validate structure
    const plan = validatePlanResponse(parsed);

    // Save to Firestore
    await savePlanToFirestore(request.projectId, userId, plan);

    return plan;
  } catch (error) {
    logger.error('Error generating plan', { error, request });
    console.log(error);
    // Fallback to mock on error
    const mockPlan = getMockPlan();
    await savePlanToFirestore(request.projectId, userId, mockPlan);
    return mockPlan;
  }
}
/*
async function getQuestionsFromFirestore(projectId: string): Promise<Question[]> {
  try {
    const db = getFirestore();
    const projectDoc = await db.collection('projects').doc(projectId).get();

    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }

    const data = projectDoc.data();
    return data?.questions || [];
  } catch (error) {
    logger.error('Failed to get questions from Firestore', { error, projectId });
    return [];
  }
}

function buildAnswersContext(questions: Question[], answers: Record<string, string>): string {
  return Object.entries(answers)
    .map(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return `${questionId}: ${answer}`;

      // Check if answer is one of the options
      const optionIndex = question.options.indexOf(answer);
      if (optionIndex !== -1) {
        return `${questionId}: Option ${optionIndex + 1}`;
      }

      // Custom answer
      return `${questionId}: Custom - ${answer}`;
    })
    .join('\n');
}
*/
async function savePlanToFirestore(
  projectId: string,
  userId: string,
  plan: PlanResponse
): Promise<void> {
  try {
    console.log(userId);
    const db = getFirestore();
    const projectRef = db.collection('projects').doc(projectId);

    await projectRef.set(
      {
        plan,
        planGeneratedAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );

    logger.info('Plan saved to project document', { projectId });
  } catch (error) {
    logger.error('Failed to save plan to Firestore', { error, projectId });
  }
}

function getMockPlan(): PlanResponse {
  return {
    metadata: {
      domain: 'tech',
      platform: 'web',
      skillLevel: 'Intermediate',
      estimated_effort: 'Medium',
      budget_profile: 'Low',
      assumptions: ['User has basic programming knowledge', 'Development environment is set up'],
      risk_assessment: [
        {
          risk: 'Technical complexity',
          impact: 'Medium',
          mitigation: 'Start with simpler features first',
        },
      ],
    },
    overview: {
      summary_points: [
        'A comprehensive web application project',
        'Built with modern technologies',
        'Suitable for intermediate developers',
      ],
      primary_goal: 'Build a functional web application',
      success_criteria: [
        'Deployed application with core features working',
        'User authentication implemented',
      ],
      user_personas: [
        {
          role: 'End User',
          primary_need: 'Access core application features',
        },
      ],
    },
    architecture_design: {
      system_pattern: 'Monolith',
      data_flow_description: 'Client-server architecture with REST API',
      diagram_reference: 'Standard web application flow',
      key_entities: [
        {
          name: 'User',
          attributes: ['id', 'email', 'name'],
          relationships: 'Has many projects',
        },
      ],
    },
    tech_stack: [
      {
        layer: 'frontend',
        technology: 'React',
        variant: 'Create React App',
        usage_area: 'User interface',
        decision_factors: {
          why_recommended: ['Popular', 'Well-documented'],
          learning_value: 'High',
          complexity_level: 'Medium',
          scalability_ceiling: 'Suitable for most applications',
        },
        core_packages: [
          {
            name: 'react-router',
            purpose: 'Routing',
            criticality: 'Essential',
          },
        ],
        pros: ['Large ecosystem', 'Strong community'],
        cons: ['Steep learning curve'],
        alternatives: [
          {
            technology: 'Vue.js',
            when_to_choose: 'Simpler projects',
            tradeoff: 'Smaller ecosystem',
          },
        ],
      },
    ],
    infrastructure_and_devops: {
      hosting_provider: 'Vercel',
      ci_cd_pipeline: 'GitHub Actions',
      monitoring_strategy: 'Basic logging',
      security_measures: ['HTTPS', 'Authentication'],
    },
    roadmap: [
      {
        phase_id: 'phase-1',
        title: 'Project Setup',
        intent: 'Initialize development environment',
        estimated_duration: 'Short',
        deliverables: ['Working development setup'],
        milestone_gate: 'Environment configured',
      },
      {
        phase_id: 'phase-2',
        title: 'Core Development',
        intent: 'Implement main features',
        estimated_duration: 'Medium',
        deliverables: ['Functional application'],
        milestone_gate: 'Core features working',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        phase_id: 'phase-1',
        title: 'Set up development environment',
        description: 'Install Node.js, create project structure',
        technical_notes: 'Use latest LTS version',
        difficulty: '2',
        dependencies: [],
        checkable: true,
        verification_step: 'Run npm start successfully',
      },
      {
        id: 'task-2',
        phase_id: 'phase-2',
        title: 'Implement core functionality',
        description: 'Build the main features',
        technical_notes: 'Follow component-based architecture',
        difficulty: '3',
        dependencies: ['task-1'],
        checkable: true,
        verification_step: 'Features work as expected',
      },
    ],
    next_actions: [
      'Set up development environment',
      'Create project repository',
      'Start with basic project structure',
    ],
    future_backlog: [
      {
        feature: 'Advanced analytics',
        reason_for_delay: 'Not critical for MVP',
      },
    ],
  };
}
