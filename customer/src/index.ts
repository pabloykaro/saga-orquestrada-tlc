import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import amqp from "amqplib";
import { DecimalOperations } from "./shared/decimal-operations.shared";

dotenv.config();
const prismaPersistence = new PrismaClient();
export interface ReserveCreditInput {
  kind: "RESERVED" | "NON_RESERVED";
  orderId: string;
  customerId: string;
}

async function bootstrap() {
  const queueConnection = await amqp.connect("amqp://localhost");
  const getChannel = await queueConnection.createChannel();
  const queueName = "reserveCreditCommand";
  getChannel.assertQueue(queueName, { durable: true });
  getChannel.consume(queueName, async (msg: any) => {
    const payload = JSON.parse(msg.content.toString());
    const orderId = payload.orderId;
    const customerId = payload.customerId;
    const orderValue = payload.amount;
    const creditDetails = await canReserveCredit(customerId, orderValue);
    if (!creditDetails) {
      // Nesse caso as retentativas na fila poderia ter um limite e que se ultrapassar enviasse para uma DLQ e checar.
      return;
    }
    if (creditDetails.canReserve) {
      const { decreasedBalance } = await makeReserveCredit(
        customerId,
        creditDetails.currentBalance,
        orderValue,
      );
      console.log(
        `[reservedCreditLimit] orderId=${orderId} customerId=${customerId} currentBalance=${creditDetails.currentBalance} orderValue=${orderValue} decreasedBalance=${decreasedBalance}`,
      );
      await makeEvent({
        kind: "RESERVED",
        orderId,
        customerId,
      });
      getChannel.ack(msg);
      return;
    }
    console.log(
      `[exceededCreditLimit] orderId=${orderId} customerId=${customerId} orderValue=${orderValue} > currentBalance=${creditDetails.currentBalance}`,
    );
    await makeEvent({
      kind: "NON_RESERVED",
      orderId,
      customerId,
    });
    getChannel.ack(msg);
  });

  async function canReserveCredit(customerId: string, orderValue: number) {
    const customerDb = await prismaPersistence.customer.findFirst({
      where: { id: customerId },
    });
    if (!customerDb) return null;
    const currentBalance = DecimalOperations.convertDecimalToNumber(
      customerDb.balance,
    );
    if (currentBalance >= orderValue) {
      return {
        canReserve: true,
        currentBalance,
      };
    }
    return {
      canReserve: false,
      currentBalance,
    };
  }

  async function makeReserveCredit(
    customerId: string,
    currentBalance: number,
    orderValue: number,
  ) {
    const decreasedBalance = currentBalance - orderValue;
    await prismaPersistence.customer.update({
      data: {
        balance: decreasedBalance,
      },
      where: { id: customerId },
    });
    return { decreasedBalance };
  }

  async function makeEvent(input: ReserveCreditInput) {
    const { kind, orderId, customerId } = input;
    await getChannel.assertQueue("reservedCreditLimit", { durable: true });
    getChannel.sendToQueue(
      "reserveCreditResponse",
      Buffer.from(
        JSON.stringify({
          kind,
          orderId,
          customerId,
        }),
      ),
    );
  }
}

bootstrap();
