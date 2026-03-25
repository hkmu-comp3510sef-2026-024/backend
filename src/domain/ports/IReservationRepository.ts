// src/domain/ports/IReservationRepository.ts
import { Reservation } from '../entities/Reservation.js';

export interface IReservationRepository {
  create(data: { userId: string; bookId: string }): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findReadyByUserId(userId: string): Promise<Reservation | null>;
  findQueuedByBookId(bookId: string): Promise<Reservation | null>;
  update(id: string, data: Partial<{ status: string; pickupDeadline: Date }>): Promise<Reservation>;
}
