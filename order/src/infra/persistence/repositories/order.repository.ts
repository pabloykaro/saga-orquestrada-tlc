import { Order as rawOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaPersistence } from "../prisma.persistence";
import { Order, OrderStatus } from "@domain/entities/order";
import { OrderRepository } from "@application/repositories/order.repository";
import { OrderMapper } from "../mappers/order.mapper";

export class DbOrderRepository implements OrderRepository {
  private repository;
  constructor(private readonly prismaPersistence: PrismaPersistence) {
    this.repository = this.prismaPersistence.getDb("order");
  }

  async findById(orderId: string): Promise<Order | null> {
    const orderDb = await this.repository.findFirst({
      where: {
        id: orderId,
      },
    });
    if (!orderDb) return null;
    return OrderMapper.toDomain(orderDb);
  }

  async findOneInOpen(customerId: string): Promise<boolean> {
    const orderDb = await this.repository.findFirst({
      where: {
        customer_id: customerId,
        status: OrderStatus.PENDING,
      },
    });
    if (!orderDb) return false;
    return true;
  }

  async create(input: Order): Promise<void> {
    const {
      customerId,
      productName,
      amount,
      status,
      orderId,
      createdAt,
      rejectedAt,
      approvedAt,
    } = input;
    const payload = {
      id: orderId,
      customer_id: customerId,
      amount: new Decimal(amount),
      product_name: productName,
      status,
      created_at: createdAt,
      rejected_at: rejectedAt,
      approved_at: approvedAt,
    } as rawOrder;
    await this.repository.create({ data: payload });
  }

  async save(input: Order): Promise<void> {
    const {
      customerId,
      productName,
      amount,
      status,
      orderId,
      createdAt,
      rejectedAt,
      approvedAt,
    } = input;
    const payload = {
      id: orderId,
      customer_id: customerId,
      amount: new Decimal(amount),
      product_name: productName,
      status,
      created_at: createdAt,
      rejected_at: rejectedAt,
      approved_at: approvedAt,
    } as rawOrder;
    await this.repository.update({
      data: payload,
      where: {
        id: payload.id,
      },
    });
  }
}
