import { ServiceProvider } from '@/Shared/Infrastructure/ServiceProvider';
import { SERVICE_KEYS } from '@/Shared/Constants/ServiceKeys';
import type { ProductRepositoryContract } from '@/Product/Domain/Contracts/ProductRepositoryContract';
import type { Product } from '@/Product/Domain/Product';

/**
 * GetAllProductsUseCase - Caso de uso para obtener todos los productos
 * 
 * Orquesta la lógica de obtener todos los productos del sistema.
 * Utiliza inversión de dependencias: resuelve el repositorio desde ServiceProvider
 * en lugar de instanciarlo directamente.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo se encarga de obtener todos los productos
 * - Dependency Inversion: Depende de la abstracción (contrato), no de la implementación
 * - Separation of Concerns: No sabe DE DÓNDE vienen los datos (GraphQL, REST, etc.)
 * 
 * @example
 * const useCase = new GetAllProductsUseCase();
 * const products = await useCase.execute();
 */
export class GetAllProductsUseCase {
    private productRepository: ProductRepositoryContract;

    constructor() {
        // Resuelve la dependencia desde el ServiceProvider usando constantes
        this.productRepository = ServiceProvider.resolve<ProductRepositoryContract>(
            SERVICE_KEYS.PRODUCT_REPOSITORY
        );
    }

    /**
     * Ejecuta el caso de uso
     * @returns Promise con array de productos
     * @throws ProductFetchException si hay error al obtener los productos
     */
    async execute(): Promise<Product[]> {
        try {
            const products = await this.productRepository.findAll();
            return products;
        } catch (error) {
            // Re-lanza el error para que el controller lo maneje
            throw error;
        }
    }
}
