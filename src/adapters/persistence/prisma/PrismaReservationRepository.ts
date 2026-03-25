// src/adapters/persistence/prisma/PrismaReservationRepository.ts
import { PrismaClient } from '@prisma/client';
import { IReservationRepository } from '../../../domain/ports/IReservationRepository.js';
import { Reservation, ReservationStatus } from '../../../domain/entities/Reservation.js';

export class PrismaReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { userId: string; bookId: string }): Promise<Reservation> {
    const result = await this.prisma.reservation.create({ data });
    return {
      ...result,
      status: result.status as ReservationStatus,
      queuePosition: result.queuePosition ?? undefined,
      pickupDeadline: result.pickupDeadline ?? undefined,
    } as Reservation;
  }

  async findById(id: string): Promise<Reservation | null> {
    const result = await this.prisma.reservation.findUnique({ where: { id } });
    if (!result) return null;
    return {
      ...result,
      status: result.status as ReservationStatus,
      queuePosition: result.queuePosition ?? undefined,
      pickupDeadline: result.pickupDeadline ?? undefined,
    } as Reservation;
  }

  async findReadyByUserId(userId: string): Promise<Reservation | null> {
    const result = await this.prisma.reservation.findFirst({
      where: { userId, status: 'READY_FOR_PICKUP' },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as ReservationStatus,
      queuePosition: result.queuePosition ?? undefined,
      pickupDeadline: result.pickupDeadline ?? undefined,
    } as Reservation;
  }

  async findQueuedByBookId(bookId: string): Promise<Reservation | null> {
    const result = await this.prisma.reservation.findFirst({
      where: { bookId, status: 'QUEUED' },
      orderBy: { createdAt: 'asc' },
    });
    if (!result) return null;
    return {
      ...result,
      status: result.status as ReservationStatus,
      queuePosition: result.queuePosition ?? undefined,
      pickupDeadline: result.pickupDeadline ?? undefined,
    } as Reservation;
  }

  async update(
    id: string,
    data: Partial<{ status: ReservationStatus; pickupDeadline: Date }>,
  ): Promise<Reservation> {
    const result = await this.prisma.reservation.update({ where: { id }, data });
    return {
      ...result,
      status: result.status as ReservationStatus,
      queuePosition: result.queuePosition ?? undefined,
      pickupDeadline: result.pickupDeadline ?? undefined,
    } as Reservation;
  }
}
