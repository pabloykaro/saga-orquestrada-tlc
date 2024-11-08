import {
  QueueBody,
  QueueProvider,
} from "@application/providers/queue.provider";
import { ApproveOrderUseCase } from "@application/usecases/approve-order.uc";
import { RejectOrderUseCase } from "@application/usecases/reject-order.uc";
import { Logger } from "@shared/logger";

export class QueueController {
  private readonly logger = new Logger(QueueController.name);
  constructor(
    private readonly queueProvider: QueueProvider,
    private readonly approveOrderUseCase: ApproveOrderUseCase,
    private readonly rejectOrderUseCase: RejectOrderUseCase,
  ) {
    this.queueProvider.consumer(
      "reserveCreditResponse",
      async (body: QueueBody["reserveCreditResponse"]) => {
        switch (body.kind) {
          case "RESERVED":
            await this.approveOrderUseCase.execute({
              orderId: body.orderId,
              customerId: body.customerId,
            });
            break;
          case "NON_RESERVED":
            await this.rejectOrderUseCase.execute({
              orderId: body.orderId,
              customerId: body.customerId,
            });
            break;
          default:
            this.logger.log(`payload=${JSON.stringify(body)}`);
        }
      },
    );
  }
}
