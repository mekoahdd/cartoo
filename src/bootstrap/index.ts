import { ServiceProvider } from '@/Shared/Infrastructure/ServiceProvider';
import { GraphQLService } from '@/Product/Infrastructure/Services/GraphQLService';
import { ProductRepository } from '@/Product/Infrastructure/Repositories/ProductRepository';
import { SERVICE_KEYS } from '@/Shared/Constants/ServiceKeys';
import type { ProductRepositoryContract } from '@/Product/Domain/Contracts/ProductRepositoryContract';

/**
 * Bootstrap - Inicialización de la aplicación
 * 
 * Este módulo se encarga de:
 * 1. Registrar todas las dependencias en el ServiceProvider
 * 2. Configurar servicios globales
 * 3. Inicializar la aplicación
 * 
 * Principios aplicados:
 * - Dependency Injection: Las implementaciones se registran aquí de forma centralizada
 * - Separation of Concerns: La configuración está separada de la lógica
 * - Single Source of Truth: Un único lugar para configurar dependencias
 * 
 * Flujo:
 * 1. Se crea la instancia de GraphQLService con la URL del API
 * 2. Se crea ProductRepository pasándole el GraphQLService
 * 3. Se registra ProductRepository en el ServiceProvider con su key
 * 4. Los casos de uso resolverán ProductRepository usando ServiceProvider.resolve()
 * 
 * @example
 * // En main.tsx:
 * import { initializeApp } from './bootstrap';
 * initializeApp();
 */

const GRAPHQL_API_URL = process.env.VITE_GRAPHQL_API_URL;

/**
 * Validates that required environment variables are present
 */
function validateEnvironment(): void {
    if (!GRAPHQL_API_URL) {
        throw new Error(
            'Missing required environment variable: VITE_GRAPHQL_API_URL. ' +
            'Please check your .env file.'
        );
    }
}

/**
 * Registra todos los servicios y dependencias de la aplicación
 */
export function registerDependencies(): void {
    // Validate environment first
    validateEnvironment();

    // 1. Crear instancia del servicio GraphQL
    const graphQLService = new GraphQLService(GRAPHQL_API_URL!);

    // 2. Crear instancia del repositorio de productos
    const productRepository = new ProductRepository(graphQLService);

    // 3. Registrar el repositorio en el ServiceProvider usando constantes
    ServiceProvider.register<ProductRepositoryContract>(
        SERVICE_KEYS.PRODUCT_REPOSITORY,
        productRepository
    );

    console.log('✅ Dependencies registered successfully');
}

/**
 * Inicializa la aplicación
 * Llama a todas las funciones de inicialización necesarias
 */
export function initializeApp(): void {
    console.log('🚀 Initializing application...');

    try {
        // Registrar dependencias
        registerDependencies();

        // Aquí podrías agregar más inicializaciones:
        // - Configurar error tracking (Sentry)
        // - Inicializar analytics
        // - Configurar i18n
        // - etc.

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize application:', error);
        throw error;
    }
}

/**
 * Limpia todas las dependencias
 * Útil para testing
 */
export function cleanupDependencies(): void {
    ServiceProvider.clear();
    console.log('🧹 Dependencies cleared');
}
