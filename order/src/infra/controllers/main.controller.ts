import {
  CreateOrderInput,
  CreateOrderUseCase,
} from "@application/usecases/create-order.uc";
import { HttpServer } from "@infra/http/http.server";

export class MainController {
  constructor(
    private readonly httpServer: HttpServer,
    private readonly createOrderUseCase: CreateOrderUseCase
  ) {
    this.httpServer.createRoute(
      "/orders",
      "post",
      async (params: any, body: any) => {
        const payload = {
          customerId: body.customer_id,
          amount: body.amount,
          productName: body.product_name,
        } as CreateOrderInput;
        return await this.createOrderUseCase.execute(payload);
      }
    );
  }
}
