import { ChatSession } from '@google/generative-ai';
import { getGeminiClient } from '../../config/gemini';
import { logger } from '../../utils/logger';

interface ChatInstance {
  session: ChatSession;
  projectId: string;
  userId: string;
  createdAt: Date;
  lastReferenced: Date;
}

class ChatManager {
  private chats: Map<string, ChatInstance> = new Map();
  private readonly CHAT_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    // Clean up expired chats every 10 minutes
    setInterval(() => this.cleanupExpiredChats(), 10 * 60 * 1000);
  }

  createChat(projectId: string, userId: string): ChatSession {
    const model = getGeminiClient().getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const session = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
      },
    });

    this.chats.set(projectId, {
      session,
      projectId,
      userId,
      createdAt: new Date(),
      lastReferenced: new Date(),
    });

    logger.info('Chat session created', { projectId, userId });
    return session;
  }

  getChat(projectId: string): ChatSession | null {
    const chatInstance = this.chats.get(projectId);
    if (!chatInstance) {
      return null;
    }

    // Check if chat has expired based on last reference
    const now = new Date();
    if (now.getTime() - chatInstance.lastReferenced.getTime() > this.CHAT_TIMEOUT) {
      this.chats.delete(projectId);
      logger.info('Chat session expired and removed', { projectId });
      return null;
    }

    // Update last referenced timestamp
    chatInstance.lastReferenced = now;

    return chatInstance.session;
  }

  removeChat(projectId: string): void {
    this.chats.delete(projectId);
    logger.info('Chat session removed', { projectId });
  }

  private cleanupExpiredChats(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [projectId, chatInstance] of this.chats.entries()) {
      if (now.getTime() - chatInstance.lastReferenced.getTime() > this.CHAT_TIMEOUT) {
        this.chats.delete(projectId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info('Cleaned up expired chat sessions', { count: cleanedCount });
    }
  }

  getChatCount(): number {
    return this.chats.size;
  }
}

export const chatManager = new ChatManager();
