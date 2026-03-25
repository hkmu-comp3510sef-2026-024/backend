import { Copy, CopyStatus } from '../../../domain/entities/Copy.js';

export interface UpdateCopyStatusData {
  copyId: string;
  newStatus: CopyStatus;
  operatorId: string;
}

export interface IUpdateCopyStatusUseCase {
  execute(data: UpdateCopyStatusData): Promise<Copy>;
}
