import { Decimal } from "@prisma/client/runtime/library";

export function convertDecimalToNumber(value: Decimal) {
  return new Decimal(value).toNumber();
}

export const DecimalOperations = {
  convertDecimalToNumber,
};
