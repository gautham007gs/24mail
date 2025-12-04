import { createContext, useContext, ReactNode } from "react";

type NotificationContextType = {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Notification | undefined;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Disabled notification feature - no UI prompts
  const permission: NotificationPermission = "default";
  const isSupported = false;

  const requestPermission = async () => {
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    return undefined;
  };

  return (
    <NotificationContext.Provider value={{ permission, isSupported, requestPermission, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
