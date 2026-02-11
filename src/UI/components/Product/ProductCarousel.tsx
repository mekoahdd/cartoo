import { Carousel } from 'primereact/carousel';
import { ImagePlaceholder } from '@/UI/components/Common/ImagePlaceholder';
import noImagePlaceholder from '@/assets/no-image.webp';

interface ProductCarouselProps {
    images: string[];
    productTitle?: string;
}

/**
 * ProductCarousel - Componente para mostrar imágenes de producto
 * Props:
 * - images: string[]
 * - productTitle: string (optional) - Used for accessible alt text
 */
export const ProductCarousel = ({ images, productTitle = 'Product' }: ProductCarouselProps) => {
    if (!images || images.length === 0) {
        return <ImagePlaceholder />;
    }

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        if (target && target.src !== noImagePlaceholder) {
            target.src = noImagePlaceholder;
        }
    };

    const imageTemplate = (image: string, index: number) => (
        <div className="flex justify-center items-center">
            <img
                src={image}
                alt={`${productTitle} - Image ${index + 1} of ${images.length}`}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
                onError={handleImageError}
                loading="lazy"
            />
        </div>
    );

    return (
        <Carousel
            value={images}
            itemTemplate={(image: string, options) => imageTemplate(image, options.index)}
            numVisible={1}
            numScroll={1}
            showIndicators
            showNavigators
            className="custom-carousel"
            aria-label={`${productTitle} image carousel`}
        />
    );
};
