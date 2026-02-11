import { ProgressSpinner } from 'primereact/progressspinner';

/**
 * LoadingSpinner - Componente reutilizable de carga
 * 
 * Muestra un spinner animado durante operaciones asíncronas.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo muestra estado de carga
 * - Reusability: Componente genérico reutilizable en toda la app
 * - DRY: Evita duplicar código de loading
 * 
 * @param message - Mensaje opcional a mostrar debajo del spinner
 * 
 * @example
 * <LoadingSpinner />
 * <LoadingSpinner message="Loading products..." />
 */
interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Loading...'
}) => {
    return (
        <div 
            className="flex flex-col justify-center items-center py-12"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <ProgressSpinner
                style={{ width: '50px', height: '50px' }}
                strokeWidth="4"
                animationDuration="1s"
                aria-label={message}
            />
            {message && (
                <p className="mt-4 text-gray-600 text-sm">
                    {message}
                </p>
            )}
        </div>
    );
};
