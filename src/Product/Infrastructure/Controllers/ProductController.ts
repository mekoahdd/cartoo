import { GetAllProductsUseCase } from '@/Product/Application/UseCases/Get/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '@/Product/Application/UseCases/Get/GetProductByIdUseCase';
import { Logger } from '@/Shared/Infrastructure/Logger';
import type { Product } from '@/Product/Domain/Product';

/**
 * ProductController - Controlador de infraestructura
 * 
 * Orquesta los casos de uso relacionados con productos.
 * Proporciona un punto de entrada unificado para operaciones de productos.
 * Maneja errores de forma centralizada.
 * 
 * Principios aplicados:
 * - Facade Pattern: Simplifica el acceso a múltiples casos de uso
 * - Single Responsibility: Solo coordina casos de uso, no contiene lógica de negocio
 * - Error Handling: Centraliza el manejo de errores
 * 
 * Nota: En aplicaciones más complejas, el controller podría:
 * - Combinar múltiples casos de uso
 * - Aplicar transformaciones específicas de la UI
 * - Manejar caché a nivel de controller
 * - Implementar retry logic
 * 
 * @example
 * const controller = new ProductController();
 * const products = await controller.getAllProducts();
 */
export class ProductController {
    private getAllProductsUseCase: GetAllProductsUseCase;
    private getProductByIdUseCase: GetProductByIdUseCase;

    constructor(
        getAllProductsUseCase?: GetAllProductsUseCase,
        getProductByIdUseCase?: GetProductByIdUseCase
    ) {
        this.getAllProductsUseCase = getAllProductsUseCase || new GetAllProductsUseCase();
        this.getProductByIdUseCase = getProductByIdUseCase || new GetProductByIdUseCase();
    }

    /**
     * Obtiene todos los productos
     * @returns Promise con array de productos
     * @throws ProductFetchException si hay error
     */
    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.getAllProductsUseCase.execute();
        } catch (error) {
            Logger.error('Error getting all products', error);
            throw error; // Re-lanza para que el store lo maneje
        }
    }

    /**
     * Obtiene un producto por su ID
     * @param id - ID del producto
     * @returns Promise con el producto
     * @throws ProductNotFoundException si no existe
     * @throws ProductFetchException si hay error
     */
    async getProductById(id: number): Promise<Product> {
        try {
            return await this.getProductByIdUseCase.execute(id);
        } catch (error) {
            Logger.error(`Error getting product with ID ${id}`, error);
            throw error;
        }
    }
}
