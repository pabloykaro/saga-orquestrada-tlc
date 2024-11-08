import {
  QueueBody,
  QueueProvider,
  QueueTypes,
} from "@application/providers/queue.provider";
import amqp from "amqplib";

export class RabbitMQProvider implements QueueProvider {
  private connection: any;
  private channels: Map<"consumerChannel" | "publishChannel", any>;

  constructor() {
    this.channels = new Map();
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
    this.channels.set("consumerChannel", this.connection.createChannel());
    this.channels.set("publishChannel", this.connection.createChannel());
  }

  async consumer(queue: QueueTypes, callback: Function): Promise<void> {
    const getChannel = await this.channels.get("consumerChannel");
    getChannel.assertQueue(queue, { durable: true });
    getChannel.consume(queue, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      try {
        await callback(input);
        getChannel.ack(msg);
      } catch (err) {
        console.log(`Error at QueueService:consumer`, err);
      }
    });
  }

  async publish<T extends QueueTypes>(
    queue: QueueTypes,
    body: QueueBody[T]
  ): Promise<void> {
    const getChannel = await this.channels.get("publishChannel");
    await getChannel.assertQueue(queue, { durable: true });
    getChannel.sendToQueue(queue, Buffer.from(JSON.stringify(body)));
  }
}
