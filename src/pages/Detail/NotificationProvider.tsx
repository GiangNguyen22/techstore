import React, { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "error" | "info";

interface NotificationContextType {
  message: string | null;
  type: NotificationType | null;
  showMessage: (msg: string, type?: NotificationType) => void;
  clearMessage: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<NotificationType | null>(null);

  const showMessage = (msg: string, msgType: NotificationType = "info") => {
    setMessage(msg);
    setType(msgType);
    setTimeout(() => {
      setMessage(null);
      setType(null);
    }, 2000); 
  };

  const clearMessage = () => {
    setMessage(null);
    setType(null);
  };

  return (
    <NotificationContext.Provider value={{ message, type, showMessage, clearMessage }}>
      {children}
      {message && (
        <div
          onClick={clearMessage}
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            borderRadius: 8,
            color: "#fff",
            backgroundColor:
              type === "success" ? "green" :
              type === "error" ? "red" : "blue",
            cursor: "pointer",
            zIndex: 9999,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
          }}
        >
          {message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
