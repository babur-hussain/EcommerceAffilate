import { Notification } from '../models/notification.model';

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
