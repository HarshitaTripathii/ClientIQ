import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { useEffect } from "react";

function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const Icon = toast.type === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div className={`toast ${toast.type}`} role="status">
      <Icon size={19} /><span>{toast.message}</span>
      <button onClick={onClose} aria-label="Dismiss message"><X size={16} /></button>
    </div>
  );
}

export default Toast;
