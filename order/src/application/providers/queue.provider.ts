export type QueueTypes = "reserveCreditCommand" | "reserveCreditResponse";

export type QueueBody = {
  reserveCreditCommand: { orderId: string; customerId: string; amount: number };
  reserveCreditResponse: {
    kind: "RESERVED" | "NON_RESERVED";
    orderId: string;
    customerId: string;
  };
};

export abstract class QueueProvider {
  abstract connect(): Promise<void>;
  abstract consumer(queue: QueueTypes, callback: Function): Promise<void>;
  abstract publish<T extends QueueTypes>(
    queue: QueueTypes,
    body: QueueBody[T],
  ): Promise<void>;
}
