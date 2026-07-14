# Ananya Design System

## Product Identity

Ananya is the internal operations system for 48 Studios.

It is designed for managing physical inventory, procurement,
projects, manufacturing, assets, and operational workflows.

Ananya is not a generic ERP dashboard.

## Design Principles

### Operational First

The interface should optimize for completing real physical tasks.

Examples:

- Find a component
- Locate stock
- Receive stock
- Move stock
- Consume stock

Prefer direct actions over navigating administrative screens.

### Search First

Inventory discovery begins with search.

Users may search using:

- Item code
- Item name
- Component value
- Package
- Manufacturer part number
- Alias
- Specification

### Physical Context Matters

Always show human-readable physical locations.

Prefer:

Office › SMD Storage › Drawer 2 › C3 › Container 1 › Tray 1

Avoid showing only:

OFF-SMD-D02-C03-K01-T01

The canonical code may be secondary metadata.

### Dense but Calm

Ananya is an operational tool.

Prefer:

- High information density
- Clear hierarchy
- Minimal decorative UI
- Strong typography
- Predictable spacing
- Fast scanning

Avoid:

- Marketing-style layouts
- Excessive cards
- Giant headings
- Decorative gradients
- Glassmorphism
- Excessive animations

### Actions Should Be Obvious

Primary inventory actions:

- Receive
- Move
- Consume
- Adjust

Actions should be available near the inventory context.

## Inventory Browser

The Inventory Browser is the primary daily interface.

Each item result should communicate:

1. Item identity
2. Current quantity
3. Important taxonomy/specifications
4. Physical location
5. Immediate actions

## Visual Direction

Ananya should feel like a modern engineering operations tool.

References in spirit:

- Linear
- GitHub
- Vercel dashboard
- Modern warehouse tooling
- Engineering consoles

Do not directly clone any reference product.

## Responsive Behaviour

Desktop is the primary interface.

Mobile should remain operational for:

- Searching inventory
- Locating components
- Receiving stock
- Moving stock
- Barcode/QR workflows

## Accessibility

- Keyboard navigation is required.
- Search must be keyboard accessible.
- Do not communicate state using colour alone.
- Interactive controls require visible focus states.