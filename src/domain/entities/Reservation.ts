// src/domain/entities/Reservation.ts
export type ReservationStatus =
  | 'QUEUED'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  status: ReservationStatus;
  queuePosition?: number;
  pickupDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}
