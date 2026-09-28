import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => {
        const borderColors = {
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#2563eb'
        };

        return (
          <div 
            key={toast.id} 
            className="toast"
            style={{ borderLeftColor: borderColors[toast.type] || '#10b981' }}
          >
            {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400" />}
            {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-400" />}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
