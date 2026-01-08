const CDN_BASE = process.env.IMAGE_CDN_BASE_URL;

type ImageSize = 'thumbnail' | 'medium' | 'large';

export const getOptimizedImage = (url: string | undefined, size: ImageSize): string | undefined => {
  if (!url) return url;
  if (!CDN_BASE) return url;

  const encoded = encodeURIComponent(url);
  return `${CDN_BASE}/proxy?url=${encoded}&size=${size}`;
};

export const resolvePrimaryImage = (product: {
  primaryImage?: string;
  image?: string;
  images?: string[];
}): string | undefined => {
  if (product.primaryImage) return product.primaryImage;
  if (product.image) return product.image;
  if (product.images && product.images.length > 0) return product.images[0];
  return undefined;
};

export const buildOptimizedVariants = (primaryImage?: string) => ({
  thumbnail: getOptimizedImage(primaryImage, 'thumbnail'),
  medium: getOptimizedImage(primaryImage, 'medium'),
  large: getOptimizedImage(primaryImage, 'large'),
});
