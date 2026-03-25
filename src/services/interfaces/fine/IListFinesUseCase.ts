import { Fine, FineStatus } from '../../../domain/entities/Fine.js';

export interface ListFinesQuery {
  status?: FineStatus;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface ListFinesResult {
  items: Fine[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IListFinesUseCase {
  listFines(query: ListFinesQuery): Promise<ListFinesResult>;
}
