import { Product } from '../models/product.model';
import { Sponsorship } from '../models/sponsorship.model';

export const getBrandProducts = async (businessId: string) => {
  return Product.find({ businessId, isActive: true });
};

export const getBrandSponsorships = async (businessId: string) => {
  // Sponsorships linked to this business's products
  return Sponsorship.find({}).populate({ path: 'productId', match: { businessId } });
};
