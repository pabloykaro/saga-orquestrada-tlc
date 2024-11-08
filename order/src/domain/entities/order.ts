import { randomUUID } from "crypto";

export enum OrderStatus {
  "PENDING" = "PENDING",
  "APPROVED" = "APPROVED",
  "REJECTED" = "REJECTED",
}

export interface OrderProperties {
  orderId: string;
  customerId: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  rejectedAt: Date | null;
  approvedAt: Date | null;
}

export class Order {
  private constructor(private readonly props: OrderProperties) {}
  static create(input: {
    customerId: string;
    productName: string;
    amount: number;
  }) {
    const { customerId, productName, amount } = input;
    if (amount <= 1) throw new Error("ORDER WITH EXCEEDED MINIMUM");
    return new Order({
      orderId: randomUUID(),
      customerId,
      productName,
      amount,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      rejectedAt: null,
      approvedAt: null,
    });
  }
  static restore(input: {
    orderId: string;
    customerId: string;
    productName: string;
    amount: number;
    status: OrderStatus;
    createdAt: Date;
    rejectedAt: Date | null;
    approvedAt: Date | null;
  }) {
    const {
      orderId,
      customerId,
      productName,
      amount,
      status,
      createdAt,
      rejectedAt,
      approvedAt,
    } = input;
    return new Order({
      orderId,
      customerId,
      productName,
      amount,
      status,
      createdAt,
      rejectedAt,
      approvedAt,
    });
  }

  approve() {
    if (this.status !== OrderStatus.PENDING)
      throw new Error("ITS NOT ALLOWED TO CHANGE STATUS");
    this.props.status = OrderStatus.APPROVED;
    this.props.approvedAt = new Date();
  }

  reject() {
    if (this.status !== OrderStatus.PENDING)
      throw new Error("ITS NOT ALLOWED TO CHANGE STATUS");
    this.props.status = OrderStatus.REJECTED;
    this.props.rejectedAt = new Date();
  }

  get orderId() {
    return this.props.orderId;
  }

  get customerId() {
    return this.props.customerId;
  }

  get productName() {
    return this.props.productName;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get rejectedAt() {
    return this.props.rejectedAt;
  }

  get approvedAt() {
    return this.props.approvedAt;
  }
}
