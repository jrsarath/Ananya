export declare const TRANSACTION_TYPES: readonly ["Receipt", "Issue", "Transfer", "Adjustment", "Return", "Consumption", "Production"];
export declare const TransactionType: {
    readonly Receipt: "Receipt";
    readonly Issue: "Issue";
    readonly Transfer: "Transfer";
    readonly Adjustment: "Adjustment";
    readonly Return: "Return";
    readonly Consumption: "Consumption";
    readonly Production: "Production";
};
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
//# sourceMappingURL=transaction-types.d.ts.map