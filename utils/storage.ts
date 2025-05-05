const isBrowser = typeof window !== 'undefined';
enum STORAGE_KEYS {
  INVITATION_TOKEN = 'invitationToken',
}

export const storage = {
  STORAGE_KEYS,
  set: (key: string, value: unknown): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`localStorage.set error: ${error}`);
    }
  },

  get: <T = unknown>(key: string): T | null => {
    if (!isBrowser) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`localStorage.get error: ${error}`);
      return null;
    }
  },

  remove: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage.remove error: ${error}`);
    }
  },

  clear: (): void => {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`localStorage.clear error: ${error}`);
    }
  },
};
