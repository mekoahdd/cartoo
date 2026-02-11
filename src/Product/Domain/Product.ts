import { ProductData, ProductCategory } from './Types/ProductTypes';

/**
 * Product - Entidad del dominio
 * 
 * Representa un producto en el sistema. Contiene únicamente lógica de negocio
 * pura y no depende de ninguna capa externa (UI, Infrastructure).
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo maneja la lógica de un producto
 * - Inmutabilidad: Los datos no se modifican después de la creación
 * - Validación en constructor: Garantiza que no existan productos inválidos
 */
export class Product {
    private readonly _id: number;
    private readonly _title: string;
    private readonly _price: number;
    private readonly _description?: string;
    private readonly _images?: string[];
    private readonly _category?: ProductCategory;

    constructor(data: ProductData) {
        this._id = data.id;
        this._title = data.title;
        this._price = data.price;
        this._description = data.description;
        this._images = data.images;
        this._category = data.category;

        this.validate();
    }

    /**
     * Validación de reglas de negocio
     * Garantiza la integridad de la entidad
     */
    private validate(): void {
        if (this._id <= 0) {
            throw new Error('Product ID must be greater than zero');
        }

        if (!this._title || this._title.trim().length === 0) {
            throw new Error('Product title cannot be empty');
        }

        if (this._price < 0) {
            throw new Error('Product price cannot be negative');
        }
    }

    // Getters - Solo lectura (inmutabilidad)
    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get price(): number {
        return this._price;
    }

    get description(): string | undefined {
        return this._description;
    }

    get images(): string[] | undefined {
        return this._images;
    }

    get category() {
        return this._category;
    }

    /**
     * Formatea el precio como moneda
     * Lógica de negocio encapsulada en la entidad
     */
    getFormattedPrice(currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(this._price);
    }

    /**
     * Convierte la entidad a un objeto plano
     * Útil para serialización (API, Store)
     */
    toPlainObject() {
        return {
            id: this._id,
            title: this._title,
            price: this._price,
            description: this._description,
            images: this._images,
            category: this._category,
        };
    }
}
