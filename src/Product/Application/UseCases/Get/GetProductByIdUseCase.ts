import { ServiceProvider } from '@/Shared/Infrastructure/ServiceProvider';
import { SERVICE_KEYS } from '@/Shared/Constants/ServiceKeys';
import type { ProductRepositoryContract } from '@/Product/Domain/Contracts/ProductRepositoryContract';
import type { Product } from '@/Product/Domain/Product';
import { ProductNotFoundException } from '@/Product/Domain/Exceptions/ProductNotFoundException';

/**
 * GetProductByIdUseCase - Caso de uso para obtener un producto específico
 * 
 * Orquesta la lógica de obtener un producto por su ID.
 * Aplica reglas de negocio: si no existe, lanza excepción específica.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo obtiene un producto por ID
 * - Dependency Inversion: Depende del contrato, no de la implementación
 * - Fail Fast: Valida y lanza excepciones inmediatamente si hay problemas
 * 
 * @example
 * const useCase = new GetProductByIdUseCase();
 * const product = await useCase.execute(42);
 */
export class GetProductByIdUseCase {
    private productRepository: ProductRepositoryContract;

    constructor() {
        this.productRepository = ServiceProvider.resolve<ProductRepositoryContract>(
            SERVICE_KEYS.PRODUCT_REPOSITORY
        );
    }

    /**
     * Ejecuta el caso de uso
     * @param id - ID del producto a buscar
     * @returns Promise con el producto encontrado
     * @throws ProductNotFoundException si el producto no existe
     * @throws ProductFetchException si hay error al obtener el producto
     */
    async execute(id: number): Promise<Product> {
        // Validación de entrada
        if (id <= 0) {
            throw new Error('Product ID must be greater than zero');
        }

        const product = await this.productRepository.findById(id);

        // Regla de negocio: si no existe, es un error
        if (!product) {
            throw new ProductNotFoundException(id);
        }

        return product;
    }
}
