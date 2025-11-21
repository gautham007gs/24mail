// Cache utility functions for localStorage and session management
export const cacheUtils = {
  // Theme caching (already implemented in theme-provider.tsx)
  getTheme: () => localStorage.getItem("tempmail-theme"),
  setTheme: (theme: string) => localStorage.setItem("tempmail-theme", theme),

  // Email persistence across page refreshes
  getCurrentEmail: () => localStorage.getItem("tempmail_current_email"),
  setCurrentEmail: (email: string) => localStorage.setItem("tempmail_current_email", email),
  clearCurrentEmail: () => localStorage.removeItem("tempmail_current_email"),

  // User preferences
  getNotificationPreference: () => localStorage.getItem("tempmail-notifications") === "true",
  setNotificationPreference: (enabled: boolean) => localStorage.setItem("tempmail-notifications", String(enabled)),

  // Session management
  getSessionId: () => sessionStorage.getItem("tempmail-session-id"),
  setSessionId: (id: string) => sessionStorage.setItem("tempmail-session-id", id),

  // API cache with TTL
  setCache: (key: string, data: unknown, ttlMs: number = 5000) => {
    const cacheData = {
      data,
      expiresAt: Date.now() + ttlMs
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  },

  getCache: (key: string) => {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    try {
      const { data, expiresAt } = JSON.parse(cached);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  // Clear all app caches
  clearAllCaches: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("cache_") || key.startsWith("tempmail")) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Auto-clear expired caches on app load
if (typeof window !== "undefined") {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("cache_")) {
      const cached = localStorage.getItem(key);
      if (cached) {
        try {
          const { expiresAt } = JSON.parse(cached);
          if (Date.now() > expiresAt) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  });
}
