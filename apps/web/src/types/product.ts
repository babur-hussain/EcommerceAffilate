export interface BackendProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand?: string;
  image: string;
  images: string[];
  rating?: number;
  ratingCount?: number;
  isActive: boolean;
  isSponsored: boolean;
  sponsoredScore?: number;
  popularityScore?: number;
  createdAt?: string;
  updatedAt?: string;
}
