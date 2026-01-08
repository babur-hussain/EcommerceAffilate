import { Product } from '../models/product.model';
import { Sponsorship } from '../models/sponsorship.model';
import { Business } from '../models/business.model';
import { Brand } from '../models/brand.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

export const getPlatformMetrics = async () => {
  const [productAgg, sponsorshipAgg, businessCount, brandCount, influencerCount, orderAgg] = await Promise.all([
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalViews: { $sum: { $ifNull: ['$views', 0] } },
          totalClicks: { $sum: { $ifNull: ['$clicks', 0] } },
        },
      },
    ]),
    Sponsorship.aggregate([
      {
        $group: {
          _id: null,
          activeSponsorships: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0],
            },
          },
          totalAdSpend: {
            $sum: {
              $max: [
                {
                  $subtract: [
                    { $ifNull: ['$initialBudget', '$budget'] },
                    { $ifNull: ['$budget', 0] },
                  ],
                },
                0,
              ],
            },
          },
        },
      },
    ]),
    Business.countDocuments({}),
    Brand.countDocuments({}),
    User.countDocuments({ role: 'INFLUENCER' }),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $ifNull: ['$totalAmount', 0] } },
        },
      },
    ]),
  ]);

  const productStats = productAgg?.[0] || {};
  const sponsorshipStats = sponsorshipAgg?.[0] || {};
  const ordersStats = orderAgg?.[0] || {};

  return {
    totalBusinesses: businessCount || 0,
    totalBrands: brandCount || 0,
    totalProducts: productStats.totalProducts || 0,
    totalViews: productStats.totalViews || 0,
    totalClicks: productStats.totalClicks || 0,
    totalInfluencers: influencerCount || 0,
    totalOrders: ordersStats.totalOrders || 0,
    totalRevenue: ordersStats.totalRevenue || 0,
    activeSponsorships: sponsorshipStats.activeSponsorships || 0,
    totalAdSpend: sponsorshipStats.totalAdSpend || 0,
  };
};
