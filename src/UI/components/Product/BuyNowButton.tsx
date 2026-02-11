import { Button } from 'primereact/button';

interface BuyNowButtonProps {
    onClick?: () => void;
    className?: string;
}

/**
 * BuyNowButton - Componente para acción de compra inmediata
 * Props:
 * - onClick: () => void
 * - className?: string
 */
export const BuyNowButton = ({ onClick, className }: BuyNowButtonProps) => (
    <Button
        label="Buy Now"
        icon="pi pi-credit-card"
        className={className || 'flex-1'}
        onClick={onClick}
        aria-label="Buy this product now"
    />
);
