import express from "express";
import dotenv from "dotenv";
import { RabbitMQProvider } from "@infra/providers/rabbitmq.provider";
import { ExpressHttpServer } from "@infra/http/http.server";
import { MainController } from "@infra/controllers/main.controller";
import { CreateOrderUseCase } from "@application/usecases/create-order.uc";
import { DbOrderRepository } from "@infra/persistence/repositories/order.repository";
import { PrismaPersistence } from "@infra/persistence/prisma.persistence";
import { QueueController } from "@infra/controllers/queue.controller";
import { ApproveOrderUseCase } from "@application/usecases/approve-order.uc";
import { RejectOrderUseCase } from "@application/usecases/reject-order.uc";

dotenv.config();

async function bootstrap() {
  const expressHttpServer = new ExpressHttpServer();

  const prismaPersistence = new PrismaPersistence();
  await prismaPersistence.connect();

  const rabbitMQProvider = new RabbitMQProvider();
  await rabbitMQProvider.connect();

  const orderRepository = new DbOrderRepository(prismaPersistence);

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    rabbitMQProvider
  );

  const approveOrderUseCase = new ApproveOrderUseCase(orderRepository);
  const rejectOrderUseCase = new RejectOrderUseCase(orderRepository);

  new MainController(expressHttpServer, createOrderUseCase);
  new QueueController(
    rabbitMQProvider,
    approveOrderUseCase,
    rejectOrderUseCase
  );

  const port = Number(process.env.PORT) || 3001;
  expressHttpServer.listen(port);
}

bootstrap();
