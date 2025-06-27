"use client"
import { useState, useEffect, createContext, useContext } from "react"

// Contexto
const ToastContext = createContext(undefined)

// Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Hook para usar o toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Componente de Toast individual
const ToastItem = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100)
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 50)

    if (toast.duration) {
      // Barra de progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (toast.duration / 50)
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 50)

      // Timer para remover o toast
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)

      return () => {
        clearTimeout(timer)
        clearInterval(progressInterval)
      }
    }
  }, [toast, onRemove])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(toast.id)
    }, 300) // Tempo da animação de saída
  }

  // Definir cores e estilos com base no tipo
  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-green-600",
          border: "border-green-400",
          icon: "text-green-100",
          text: "text-white",
          progress: "bg-green-300",
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-500 to-red-600",
          border: "border-red-400",
          icon: "text-red-100",
          text: "text-white",
          progress: "bg-red-300",
        }
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-orange-500",
          border: "border-amber-400",
          icon: "text-amber-100",
          text: "text-white",
          progress: "bg-amber-300",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-blue-500 to-blue-600",
          border: "border-blue-400",
          icon: "text-blue-100",
          text: "text-white",
          progress: "bg-blue-300",
        }
    }
  }

  const getIcon = () => {
    const styles = getToastStyles()
    switch (toast.type) {
      case "success":
        return (
          <div className={`p-2 rounded-full bg-white/20 ${styles.icon}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )
      case "error":
        return (
          <div className={`p-2 rounded-full bg-white/20 ${styles.icon}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        )
      case "warning":
        return (
          <div className={`p-2 rounded-full bg-white/20 ${styles.icon}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
        )
      default:
        return (
          <div className={`p-2 rounded-full bg-white/20 ${styles.icon}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
        )
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-2xl border backdrop-blur-sm transition-all duration-300 ease-out mb-3 ${
        styles.bg
      } ${styles.border} ${
        isVisible && !isLeaving
          ? "transform translate-x-0 opacity-100 scale-100"
          : isLeaving
            ? "transform translate-x-full opacity-0 scale-95"
            : "transform translate-x-full opacity-0 scale-95"
      }`}
      role="alert"
    >
      {/* Barra de progresso */}
      {toast.duration && (
        <div className="absolute top-0 left-0 h-1 bg-white/30 w-full">
          <div
            className={`h-full transition-all duration-75 ease-linear ${styles.progress}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Conteúdo do toast */}
      <div className="flex items-center p-4 pt-5">
        {/* Ícone */}
        <div className="flex-shrink-0 mr-3">{getIcon()}</div>

        {/* Mensagem */}
        <div className={`flex-1 ${styles.text}`}>
          <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
        </div>

        {/* Botão de fechar */}
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-3 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
          aria-label="Fechar notificação"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}

// Container para todos os toasts
const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[10000] w-80 max-w-sm">
      <div className="space-y-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  )
}
