// src/adapters/persistence/prisma/PrismaNotificationRepository.ts
import { PrismaClient } from '@prisma/client';
import { INotificationRepository } from '../../../domain/ports/INotificationRepository.js';
import { Notification, NotificationType } from '../../../domain/entities/Notification.js';

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    content: string;
    reservationId?: string;
  }): Promise<Notification> {
    const result = await this.prisma.notification.create({
      data: {
        ...data,
        type: data.type as any, // Cast to Prisma enum
      },
    });
    return {
      ...result,
      type: result.type as NotificationType,
      reservationId: result.reservationId ?? undefined,
      readAt: result.readAt ?? undefined,
    } as Notification;
  }

  async findByUserId(userId: string, skip?: number, take?: number): Promise<Notification[]> {
    const results = await this.prisma.notification.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return results.map(r => ({
      ...r,
      type: r.type as NotificationType,
      reservationId: r.reservationId ?? undefined,
      readAt: r.readAt ?? undefined,
    })) as Notification[];
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
