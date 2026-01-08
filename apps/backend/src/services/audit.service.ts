import { AuditLog } from '../models/auditLog.model';

interface LogActionInput {
  userId?: string;
  role?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
}

export const logAction = async ({ userId, role, action, entityType, entityId, metadata }: LogActionInput) => {
  try {
    await AuditLog.create({ userId, role, action, entityType, entityId, metadata });
  } catch (err) {
    // Do not block main flow on logging failure
  }
};
