import { env } from './env';

export const aiConfig = {
  geminiApiKey: env.geminiApiKey,
  model: 'gemini-2.5-flash',
};

export function isAiAvailable(): boolean {
  return !!aiConfig.geminiApiKey;
}
