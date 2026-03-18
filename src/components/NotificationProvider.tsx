import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl min-w-[300px] max-w-[400px] ${
                n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              <div className="flex-shrink-0">
                {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {n.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {n.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                {n.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-sm font-bold leading-tight">
                {n.message}
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="flex-shrink-0 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
