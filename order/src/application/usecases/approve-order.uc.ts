import { OrderRepository } from "@application/repositories/order.repository";
import { OrderStatus } from "@domain/entities/order";
import { Logger } from "@shared/logger";

export interface ApproveOrderInput {
  orderId: string;
  customerId: string;
}
export type ApproveOrderOutput = Promise<void>;

export class ApproveOrderUseCase {
  private readonly logger: Logger = new Logger(ApproveOrderUseCase.name);
  constructor(private readonly orderRepository: OrderRepository) {}
  async execute(input: ApproveOrderInput) {
    const { orderId, customerId } = input;

    const orderDb = await this.orderRepository.findById(orderId);
    if (!orderDb) {
      this.logger.log(
        `signal=[ORDER_NOT_FOUND] orderId=${orderId} receivedCustomerId=${customerId}`
      );
      throw new Error("ORDER DOES NOT EXIST");
    }
    if (orderDb.status === OrderStatus.APPROVED) {
      this.logger.log(
        `signal=[ORDER_ALREADY_APPROVED] orderId=${orderId} customerId=${orderDb.customerId} receivedCustomerId=${customerId}`
      );
    }
    if (customerId !== orderDb.customerId) {
      this.logger.log(
        `signal=[CUSTOMER_DIFFERENT] orderId=${orderId} initialCustomerId=${orderDb.customerId} receivedCustomerId=${customerId}`
      );
      throw new Error("CUSTOMER DIFFERENT FROM ORDER ORIGIN");
    }

    orderDb.approve();
    await this.orderRepository.save(orderDb);
    this.logger.log(
      `signal=[APPROVED_ORDER] orderId=${orderId} customerId=${orderDb.customerId} orderValue=${orderDb.amount}`
    );
  }
}
