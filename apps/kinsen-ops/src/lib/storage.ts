import { ChatSession } from './types';

const STORAGE_KEY = 'gemini_chat_sessions';

export const storage = {
  getSessions: (): ChatSession[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  },

  saveSession: (session: ChatSession) => {
    try {
      const sessions = storage.getSessions();
      const index = sessions.findIndex(s => s.id === session.id);
      
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.unshift(session);
      }
      
      // Sort by updatedAt desc
      sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  deleteSession: (id: string) => {
    try {
      const sessions = storage.getSessions().filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error deleting from localStorage', error);
    }
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
