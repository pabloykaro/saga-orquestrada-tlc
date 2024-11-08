import { PrismaClient } from "@prisma/client";

export type PrismaModels = Omit<PrismaClient, `$${string}`>;

export class PrismaPersistence {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }

  async connect() {
    await this.client.$connect();
  }

  getDb<T extends keyof PrismaModels>(db: T) {
    return this.client[db];
  }
}
