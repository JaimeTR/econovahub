'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message?: string) => void;
  confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({} as any);

let nextId = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmState, setConfirmState] = useState<{ message: string; resolve: (v: boolean) => void } | null>(null);

  const notify = useCallback((type: NotificationType, title: string, message?: string) => {
    const id = nextId++;
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise(resolve => setConfirmState({ message, resolve }));
  }, []);

  const icons: Record<NotificationType, string> = {
    success: '✓',
    error: '✕',
    info: 'i',
    warning: '!',
  };

  const colors: Record<NotificationType, string> = {
    success: 'bg-green-50 border-green-300 text-green-700',
    error: 'bg-red-50 border-red-300 text-red-600',
    info: 'bg-rose-soft/40 border-rose-elegant/30 text-rose-elegant',
    warning: 'bg-amber-50 border-amber-300 text-amber-600',
  };

  const iconColors: Record<NotificationType, string> = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    info: 'bg-rose-elegant',
    warning: 'bg-amber-400',
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}

      {confirmState && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-soft/30 p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <p className="text-sm text-text-dark font-medium mb-6">{confirmState.message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { confirmState.resolve(false); setConfirmState(null); }}
                className="px-4 py-2 rounded-xl border border-rose-soft/50 text-sm text-text-gray hover:bg-rose-soft/20 transition-all">
                Cancelar
              </button>
              <button onClick={() => { confirmState.resolve(true); setConfirmState(null); }}
                className="px-4 py-2 rounded-xl bg-rose-elegant text-white text-sm font-semibold hover:bg-rose-elegant/90 transition-all">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div key={n.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in ${colors[n.type]}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 ${iconColors[n.type]}`}>
              {icons[n.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{n.title}</p>
              {n.message && <p className="text-xs opacity-80 mt-0.5">{n.message}</p>}
            </div>
            <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
              className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}