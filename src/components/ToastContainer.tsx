import { AnimatePresence } from 'framer-motion'
import { ToastNotification } from './ToastNotification'
import { useToast } from '../hooks/useToast.tsx'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 9999 }}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            index={index}
            onDismiss={dismissToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
