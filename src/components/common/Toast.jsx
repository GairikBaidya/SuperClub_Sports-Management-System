import { useState, useCallback, useRef } from 'react';

const TOAST_DURATION = 4000;

let toastIdCounter = 0;

/**
 * Toast component — self-contained with its own state management.
 * Usage: import { useToast, ToastContainer } from './Toast'
 */

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ message, type = 'info', duration = TOAST_DURATION }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => removeToast(id), 300);
    }, duration);
    return id;
  }, [removeToast]);

  const toast = {
    success: (message) => addToast({ message, type: 'success' }),
    error:   (message) => addToast({ message, type: 'error' }),
    info:    (message) => addToast({ message, type: 'info' }),
    warn:    (message) => addToast({ message, type: 'warn' }),
  };

  return { toasts, toast, removeToast };
}

const TOAST_STYLES = {
  success: { bg: 'rgba(34,211,160,0.12)', border: 'rgba(34,211,160,0.25)', icon: '✅', text: '#22D3A0' },
  error:   { bg: 'rgba(200,16,46,0.12)',  border: 'rgba(200,16,46,0.25)',  icon: '❌', text: '#FF4466'  },
  info:    { bg: 'rgba(91,143,255,0.12)',  border: 'rgba(91,143,255,0.25)', icon: 'ℹ️', text: '#5B8FFF'  },
  warn:    { bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)', icon: '⚠️', text: '#F97316' },
};

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.type] || TOAST_STYLES.info;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg ${t.exiting ? 'toast-exit' : 'toast-enter'}`}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              color: style.text,
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="text-base flex-shrink-0 mt-px">{style.icon}</span>
            <p className="text-sm font-medium flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity mt-0.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
