import { Message } from 'primereact/message';

/**
 * ErrorMessage - Componente reutilizable para mostrar errores
 * 
 * Muestra mensajes de error con estilo consistente usando PrimeReact.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo muestra mensajes de error
 * - Reusability: Componente genérico reutilizable en toda la app
 * - DRY: Evita duplicar código de manejo de errores visual
 * 
 * @param message - Mensaje de error a mostrar
 * @param title - Título opcional del error
 * @param onRetry - Callback opcional para reintentar la operación
 * 
 * @example
 * <ErrorMessage message="Failed to load products" />
 * <ErrorMessage 
 *   title="Connection Error"
 *   message="Could not connect to server" 
 *   onRetry={handleRetry}
 * />
 */
interface ErrorMessageProps {
    message: string;
    title?: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    title,
    onRetry
}) => {
    return (
        <div className="mb-4 sm:mb-6" role="alert" aria-live="assertive">
            <Message
                severity="error"
                text={
                    <div className="flex flex-col gap-2">
                        {title && (
                            <span className="font-semibold text-sm sm:text-base">{title}</span>
                        )}
                        <span className="text-sm sm:text-base">{message}</span>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="mt-2 text-xs sm:text-sm underline hover:no-underline"
                                aria-label={`Retry: ${title || message}`}
                            >
                                Try again
                            </button>
                        )}
                    </div>
                }
                className="w-full"
            />
        </div>
    );
};
