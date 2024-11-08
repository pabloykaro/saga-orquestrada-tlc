import { Order } from "@domain/entities/order";

export abstract class OrderRepository {
  abstract findById(orderId: string): Promise<Order | null>;
  abstract findOneInOpen(customerId: string): Promise<boolean>;
  abstract create(input: Order): Promise<void>;
  abstract save(input: Order): Promise<void>;
}
