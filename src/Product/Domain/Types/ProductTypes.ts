/**
 * Product Domain Types
 * 
 * Centralized type definitions for Product entity
 * Used across all layers to ensure type consistency
 */

export interface ProductCategory {
    id: number;
    name: string;
    image: string;
}

export interface ProductData {
    id: number;
    title: string;
    price: number;
    description?: string;
    images?: string[];
    category?: ProductCategory;
}
