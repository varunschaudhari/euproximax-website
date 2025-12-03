import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void
    showSuccess: (message: string) => void
    showError: (message: string) => void
    showInfo: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => removeToast(id), 3500)
    }, [removeToast])

    const value = useMemo<ToastContextValue>(() => ({
        showToast,
        showSuccess: (message: string) => showToast(message, 'success'),
        showError: (message: string) => showToast(message, 'error'),
        showInfo: (message: string) => showToast(message, 'info'),
    }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed right-4 top-4 z-[9999] flex flex-col gap-3">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`min-w-[240px] rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-transform ${toast.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : toast.type === 'error'
                                ? 'border-rose-200 bg-rose-50 text-rose-700'
                                : 'border-blue-200 bg-blue-50 text-blue-700'
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

