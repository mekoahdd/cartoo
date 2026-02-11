import { Button } from 'primereact/button';

interface AddToCartButtonProps {
    onClick?: () => void;
    className?: string;
}

/**
 * AddToCartButton - Componente para agregar producto al carrito
 * Props:
 * - onClick: () => void
 * - className?: string
 */
export const AddToCartButton = ({ onClick, className }: AddToCartButtonProps) => (
    <Button
        label="Add to Cart"
        icon="pi pi-shopping-cart"
        className={className || 'flex-1'}
        severity="success"
        onClick={onClick}
        aria-label="Add product to shopping cart"
    />
);
