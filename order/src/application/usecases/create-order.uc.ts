import { QueueProvider } from "@application/providers/queue.provider";
import { OrderRepository } from "@application/repositories/order.repository";
import { Order } from "@domain/entities/order";
import { Logger } from "@shared/logger";

export interface CreateOrderInput {
  customerId: string;
  productName: string;
  amount: number;
}

export interface CreateOrderOutput {
  status: "created";
}

export class CreateOrderUseCase {
  private readonly logger = new Logger(CreateOrderUseCase.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly queue: QueueProvider,
  ) {}
  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const hasPendingOrder = await this.orderRepository.findOneInOpen(
      input.customerId,
    );
    if (hasPendingOrder) {
      this.logger.log(`customerId=${input.customerId} hasPendingOrder=true`);
      throw new Error("CUSTOMER ALREADY HAS AN OPEN ORDER");
    }
    const orderEntity = Order.create({
      customerId: input.customerId,
      productName: input.productName,
      amount: input.amount,
    });
    await this.orderRepository.create(orderEntity);
    await this.queue.publish("reserveCreditCommand", {
      orderId: orderEntity.orderId,
      customerId: orderEntity.customerId,
      amount: orderEntity.amount,
    });
    this.logger.log(
      `customerId=${orderEntity.customerId} orderId=${orderEntity.orderId} amount=${orderEntity.amount}`,
    );
    return {
      status: "created",
    };
  }
}
