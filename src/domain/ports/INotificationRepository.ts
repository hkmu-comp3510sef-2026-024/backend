// src/domain/ports/INotificationRepository.ts
import { Notification } from '../entities/Notification.js';

export interface INotificationRepository {
  create(data: {
    userId: string;
    type: string;
    title: string;
    content: string;
    reservationId?: string;
  }): Promise<Notification>;
  findByUserId(userId: string, skip?: number, take?: number): Promise<Notification[]>;
  markAsRead(id: string): Promise<void>;
}
