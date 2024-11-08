import { Order, OrderStatus } from "@domain/entities/order";
import { Order as RawOrder } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class OrderMapper {
  static toDomain(input: RawOrder) {
    return Order.restore({
      orderId: input.id,
      customerId: input.customer_id,
      productName: input.product_name,
      amount: new Decimal(input.amount).toNumber(),
      status: input.status as OrderStatus,
      createdAt: input.created_at,
      rejectedAt: input.rejected_at,
      approvedAt: input.approved_at,
    }) as Order;
  }
  static toPersistence(input: Order) {
    return {
      id: input.orderId,
      customer_id: input.customerId,
      product_name: input.productName,
      amount: new Decimal(input.amount),
      status: input.status,
      created_at: input.createdAt,
      rejected_at: input.rejectedAt,
      approved_at: input.approvedAt,
    } as RawOrder;
  }
}
