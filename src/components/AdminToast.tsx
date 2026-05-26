import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useEffect } from 'react';

import '../styles/adminToast.css';

export type AdminToastType = 'success' | 'info' | 'error';

type AdminToastProps = {
  message: string;
  type?: AdminToastType;
  onClose: () => void;
};

function AdminToast({ message, type = 'success', onClose }: AdminToastProps) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeout = window.setTimeout(onClose, 3200);

    return () => window.clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const Icon = type === 'error' ? XCircle : type === 'info' ? Info : CheckCircle2;

  return (
    <div className={`admin-toast admin-toast-${type}`} role="status" aria-live="polite">
      <span>
        <Icon size={20} strokeWidth={2.5} />
      </span>

      <p>{message}</p>

      <button type="button" onClick={onClose} aria-label="Cerrar notificación">
        x
      </button>
    </div>
  );
}

export default AdminToast;
