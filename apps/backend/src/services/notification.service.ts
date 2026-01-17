import { Notification } from '../models/notification.model';
import { Product } from '../models/product.model';
import { Business } from '../models/business.model';
import { admin } from '../config/firebaseAdmin';

export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string
) => {
  return Notification.create({ userId, type, title, message });
};

export const markAsRead = async (notificationId: string) => {
  return Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

// Placeholder: integrate email provider later
export const sendEmailNotification = async (
  _type: string,
  _payload: Record<string, unknown>
) => {
  return;
};

export const notifySellers = async (order: any) => {
  try {
    console.log(`🔔 [NotifySellers] Starting notification process for Order ${order._id}`);

    // Use items from the created order to be safe
    const orderItems = order.items || [];
    const productIds = orderItems.map((i: any) => i.productId);

    console.log(`🔔 [NotifySellers] Product IDs:`, productIds);

    const orderedProducts = await Product.find({ _id: { $in: productIds } }).select('businessId');
    console.log(`🔔 [NotifySellers] Found ${orderedProducts.length} products`);

    const businessIds = [...new Set(orderedProducts.map((p) => p.businessId?.toString()).filter(Boolean))];
    console.log(`🔔 [NotifySellers] Business IDs:`, businessIds);

    if (businessIds.length === 0) {
      console.log("🔔 [NotifySellers] No businesses found to notify.");
      return;
    }

    const businesses = await Business.find({ _id: { $in: businessIds } }).select('firebaseUid');
    console.log(`🔔 [NotifySellers] Found ${businesses.length} business records`, businesses.map(b => b._id));

    if (businesses.length > 0) {
      const batch = admin.firestore().batch();
      let count = 0;
      businesses.forEach((biz) => {
        if (biz.firebaseUid) {
          const ref = admin.firestore().collection('seller_notifications').doc();
          console.log(`🔔 [NotifySellers] Queueing notification for Seller UID: ${biz.firebaseUid}`);
          batch.set(ref, {
            sellerUid: biz.firebaseUid,
            orderId: order._id.toString(),
            status: 'unread',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            title: 'New Order Received!',
            message: `You have received a new order with ID: ${order._id}`,
          });
          count++;
        } else {
          console.warn(`🔔 [NotifySellers] Business ${biz._id} has missing firebaseUid`);
        }
      });
      await batch.commit();
      console.log(`🔔 [NotifySellers] Successfully sent ${count} notifications.`);
    }
  } catch (err) {
    console.error('❌ [NotifySellers] Failed to notify sellers:', err);
  }
};
