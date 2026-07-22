import type { CreateInventoryTransactionProps } from "./inventory-transaction.types";
import { InventoryTransaction } from "./inventory-transaction";

export function createInventoryTransaction(
  props: CreateInventoryTransactionProps,
): InventoryTransaction {
  return InventoryTransaction.create(props);
}
