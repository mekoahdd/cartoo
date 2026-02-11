import { create } from 'zustand';
import { Logger } from '@/Shared/Infrastructure/Logger';
import { GetAllProductsUseCase } from '../UseCases/Get/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '../UseCases/Get/GetProductByIdUseCase';

/**
 * ProductStore - Estado global de productos usando Zustand
 * 
 * Maneja el estado global de productos en la aplicación.
 * Almacena datos PLANOS (no entidades) para que React pueda observar cambios.
 * 
 * Principios aplicados:
 * - Single Source of Truth: Un único lugar para el estado de productos
 * - Immutability: Nunca modifica el estado directamente, siempre usa set()
 * - Separation of Concerns: Solo maneja estado, delega lógica a casos de uso
 * 
 * Patron de estado:
 * - products: datos del listado
 * - selectedProduct: producto actualmente seleccionado (para detalle)
 * - isLoading: indica si hay una operación en curso
 * - error: almacena mensajes de error
 * 
 * @example
 * const { products, isLoading, fetchProducts } = useProductStore();
 * 
 * useEffect(() => {
 *   fetchProducts();
 * }, []);
 */
interface ProductPlain {
    id: number;
    title: string;
    price: number;
    description?: string;
    images?: string[];
    category?: {
        id: number;
        name: string;
        image: string;
    };
}

interface ProductState {
    // Estado
    products: ProductPlain[];
    selectedProduct: ProductPlain | null;
    isLoading: boolean;
    error: string | null;

    // Acciones
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<void>;
    clearError: () => void;
    clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
    // Estado inicial
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null,

    /**
     * Obtiene todos los productos
     * Ejecuta el caso de uso y actualiza el estado
     */
    fetchProducts: async () => {
        set({ isLoading: true, error: null });

        try {
            const useCase = new GetAllProductsUseCase();
            const products = await useCase.execute();

            // Convertir entidades a objetos planos para el store
            const plainProducts = products.map(p => p.toPlainObject());

            set({
                products: plainProducts,
                isLoading: false
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch products';

            set({
                error: errorMessage,
                isLoading: false,
                products: []
            });

            Logger.error('Error fetching products', error);
        }
    },

    /**
     * Obtiene un producto específico por ID
     * Ejecuta el caso de uso y actualiza selectedProduct
     */
    fetchProductById: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
            const useCase = new GetProductByIdUseCase();
            const product = await useCase.execute(id);

            set({
                selectedProduct: product.toPlainObject(),
                isLoading: false
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : `Failed to fetch product with ID ${id}`;

            set({
                error: errorMessage,
                isLoading: false,
                selectedProduct: null
            });

            Logger.error(`Error fetching product ${id}`, error);
        }
    },

    /**
     * Limpia el error del estado
     */
    clearError: () => {
        set({ error: null });
    },

    /**
     * Limpia el producto seleccionado
     * Útil al salir de la pantalla de detalle
     */
    clearSelectedProduct: () => {
        set({ selectedProduct: null });
    },
}));
