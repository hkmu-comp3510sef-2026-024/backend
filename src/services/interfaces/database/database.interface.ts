// Database interface - abstracts database operations
// Used by consumers (like index.ts) without knowing the concrete implementation

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}
