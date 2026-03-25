// src/domain/entities/Notification.ts
export type NotificationType =
  | 'DUE_REMINDER'
  | 'OVERDUE_REMINDER'
  | 'RESERVATION_READY'
  | 'RESERVATION_EXPIRED'
  | 'SYSTEM_ANNOUNCEMENT';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  reservationId?: string;
  createdAt: Date;
}
