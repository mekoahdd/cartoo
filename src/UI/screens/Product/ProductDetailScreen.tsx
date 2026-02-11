import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/Product/Application/Stores/ProductStore';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/UI/components/Common';
import { BackButton } from '@/UI/components/Common/BackButton';
import { ProductCarousel } from '@/UI/components/Product/ProductCarousel';
import { BuyNowButton } from '@/UI/components/Product/BuyNowButton';
import { AddToCartButton } from '@/UI/components/Product/AddToCartButton';
import { ProductInfoColumn } from '@/UI/components/Product/ProductInfoColumn';

/**
 * ProductDetailScreen - Pantalla de detalle de producto
 * 
 * Componente inteligente que:
 * 1. Obtiene el ID del producto desde la URL
 * 2. Carga los datos del producto específico
 * 3. Muestra información detallada del producto
 * 4. Permite navegar de regreso al listado
 * 
 * Principios aplicados:
 * - Smart Component: Maneja lógica y estado
 * - Single Responsibility: Solo controla la vista de detalle
 * - Separation of Concerns: No contiene lógica de negocio
 * 
 * @example
 * <ProductDetailScreen />
 */
export const ProductDetailScreen = () => {
    
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { selectedProduct, isLoading, error, fetchProductById, clearSelectedProduct } = useProductStore();

    // Cargar producto al montar o cuando cambia el ID
    useEffect(() => {
        if (id) {
            fetchProductById(Number(id));
        }

        // Limpiar producto seleccionado al desmontar
        return () => {
            clearSelectedProduct();
        };
    }, [id, fetchProductById, clearSelectedProduct]);

    /**
     * Navega de regreso al listado
     */
    const handleGoBack = () => {
        navigate('/');
    };

    // ...existing code...

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton onClick={handleGoBack} />
                </div>

                {/* Loading State */}
                {isLoading && (
                    <LoadingSpinner message="Loading product details..." />
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <ErrorMessage
                        title="Failed to load product"
                        message={error}
                        onRetry={() => id && fetchProductById(Number(id))}
                    />
                )}

                {/* Product Detail */}
                {!isLoading && !error && selectedProduct && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
                            {/* Images Column */}
                            <div>
                                <ProductCarousel 
                                    images={selectedProduct.images ?? []} 
                                    productTitle={selectedProduct.title}
                                />
                            </div>

                            {/* Info Column */}
                            <div className="flex flex-col">
                                <ProductInfoColumn product={selectedProduct} />
                                {/* Actions */}
                                <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <AddToCartButton className="flex-1 w-full" />
                                        <BuyNowButton className="flex-1 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Not Found State */}
                {!isLoading && !error && !selectedProduct && (
                    <EmptyState
                        title="Product not found"
                        message="The product you're looking for doesn't exist or has been removed."
                        icon="pi pi-exclamation-circle"
                        action={<BackButton onClick={handleGoBack} />}
                    />
                )}
            </div>
        </div>
    );
};