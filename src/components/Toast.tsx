import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  };

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up`}>
      <div className={`${colors[type]} px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px] max-w-[90vw]`}>
        {icons[type]}
        <span className="flex-1 font-medium text-sm">{message}</span>
        <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
