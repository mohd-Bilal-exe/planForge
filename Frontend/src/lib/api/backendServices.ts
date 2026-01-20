export async function mockApi(input: string): Promise<{ data: any; error: any }> {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(input);
      resolve({ data: 'Mock data', error: null });
    }, 3000);
  });
}
import axios from 'axios';
import useZustandStore from '@/lib/store/zustand';
import { firebaseService } from '../firebase/firebaseService';

type apiParams = {
  idea: string;
  domain: string;
  platform: string;
  answers?: any;
  projectId?: string;
};

export async function getQuestions({
  idea,
  domain,
  platform,
}: apiParams): Promise<{ success: boolean; error: any; projectId?: string }> {
  const { setQuestions, user } = useZustandStore.getState();

  if (!user) {
    console.log(user);
    return { success: false, error: 'User not found' };
  }
  try {
    // 1. Create project document in Firebase
    const projectId = await firebaseService.createProjectDocument({
      userId: user.uid,
      idea,
      domain,
      platform,
    });
    console.log({
      idea,
      domain,
      platform,
      projectId,
    });
    // 2. Call backend to generate questions
    const response = await axios.post(
      'http://localhost:5000/planner/questions',
      {
        idea,
        domain,
        platform,
        projectId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    console.log(response.data);
    // 3. Update Zustand store
    setQuestions({
      projectId,
      questions: response.data.questions,
      remarks: response.data.remarks,
    });

    return { success: true, error: null, projectId };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, error };
  }
}
export async function getPlan({
  answers,
  projectId,
}: apiParams): Promise<{ success: boolean; error: any; projectId?: string }> {
  const { user } = useZustandStore.getState();

  if (!user || !projectId) {
    console.log(user);
    return { success: false, error: 'User not found ' };
  }
  try {
    // 1. Create project document in Firebase
    const projectData = await firebaseService.getProjectDocument(projectId);
    // 2. Call backend to generate questions
    const response = await axios.post(
      'http://localhost:5000/planner/plan',
      {
        idea: projectData?.idea,
        domain: projectData?.domain,
        platform: projectData?.platform,
        projectId,
        answers,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    console.log(response.data);

    return { success: true, error: null };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return { success: false, error };
  }
}
