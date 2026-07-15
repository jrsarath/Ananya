# RFC-0006: Units of Measure

**Status:** Accepted

**Author:** Ananya Contributors

**Created:** 2026-07-15

---

# Summary

This RFC defines how quantities are measured throughout the inventory domain.

Every Component is measured using a single Base Unit of Measure.

All inventory transactions are recorded in the Component's Base Unit to ensure consistency, deterministic calculations, and simplified inventory management.

---

# Motivation

Inventory systems frequently deal with multiple representations of the same quantity.

Examples:

- Resistors purchased by Reel but consumed by Piece.
- Wire purchased by Roll but consumed by Meter.
- Solder paste purchased by Jar but consumed by Gram.

Without a consistent measurement model, inventory calculations become ambiguous and difficult to audit.

---

# Principles

## One Base Unit

Every Component has exactly one Base Unit of Measure.

Inventory is always recorded using this Base Unit.

Examples:

- Piece
- Meter
- Gram
- Liter

---

## Inventory Uses Base Units

Inventory quantities are never stored using purchasing or packaging units.

Examples:

```
Purchase

1 Reel

↓

Inventory

5000 Pieces
```

```
Purchase

1 Roll

↓

Inventory

100 Meters
```

---

## Business Documents May Use Other Units

Business documents may use alternate units.

Examples include:

- Purchase Orders
- Quotations
- Supplier Catalogues

Before inventory is recorded, quantities are converted into the Base Unit.

---

## Deterministic Conversion

Conversions must always produce the same result.

Conversion rules are part of the Component definition.

---

# Unit Categories

Examples of supported units include:

## Count

- Piece
- Pair
- Box
- Pack

---

## Length

- Millimeter
- Centimeter
- Meter

---

## Weight

- Gram
- Kilogram

---

## Volume

- Milliliter
- Liter

Future RFCs may introduce additional unit categories.

---

# Conversion

A Component may define alternate units.

Example:

```
ESP32

Base Unit

Piece

Purchase Unit

Tray

Conversion

1 Tray = 100 Pieces
```

Conversions always map to the Base Unit.

---

# Precision

Quantities may be either:

- Whole Numbers
- Decimal Numbers

The allowed precision depends on the Component.

Examples:

```
Resistor

Whole Numbers
```

```
Wire

Decimal Quantities
```

---

# Rounding

Inventory calculations must never introduce hidden rounding.

Conversions should preserve precision.

If rounding is required, it must follow explicit business rules defined by future RFCs.

---

# Design Principles

## Consistency

Every inventory calculation uses Base Units.

---

## Simplicity

Inventory calculations should not depend on purchasing units.

---

## Extensibility

New units may be introduced without changing inventory behaviour.

---

# Alternatives Considered

## Multiple Base Units

Allowing Components to maintain inventory using multiple units was rejected because it complicates inventory calculations and reconciliation.

---

## Purchasing Units as Inventory Units

Recording inventory in supplier units was rejected because suppliers may package identical Components differently.

---

# Trade-offs

## Advantages

- Consistent inventory calculations
- Simple transaction model
- Easier reporting
- Deterministic conversions

---

## Disadvantages

- Requires conversion during purchasing.
- Conversion rules must be maintained.

---

# Consequences

Future modules should convert all incoming quantities into the Component's Base Unit before creating Inventory Transactions.

Inventory calculations should never depend on supplier packaging or document-specific units.

---

# Future Extensions

Future RFCs may define:

- Unit Conversion Tables
- Packaging Units
- Supplier-specific Units
- Precision Rules
- Measurement Validation

---

# Non-Goals

This RFC does not define:

- Conversion implementation
- Purchasing workflows
- Database schema
- APIs
- User interfaces

These concerns are implementation details.