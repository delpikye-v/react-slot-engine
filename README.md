# 🔌 react-slot-engine-z

[![NPM](https://img.shields.io/npm/v/react-slot-engine-z.svg)](https://www.npmjs.com/package/react-slot-engine-z) ![Downloads](https://img.shields.io/npm/dt/react-slot-engine-z.svg)

<a href="https://codesandbox.io/p/sandbox/9sqx24" target="_blank">LIVE EXAMPLE</a>

---

**Lightweight** slot & plugin engine for dynamic React UI composition.  

Build extensible layouts, plugin-driven interfaces, and isolated feature injection —  
without prop drilling, global stores, or tight coupling.

> Composable UI architecture with deterministic slot rendering.

---

## Why react-slot-engine-z?

- 🧩 Slot-based UI composition
- 🧠 Scoped engines (nested providers)
- 🔌 Structured plugin lifecycle
- 🎯 Priority-based rendering
- ⏳ Async / lazy slot support (Suspense-ready)
- 🚫 No global store
- 🚫 No prop drilling
- 📦 Tiny, predictable runtime

---

## Mental Model

```bash
plugin / feature
        ↓
engine.register(slot, render, options)
        ↓
slot registry (priority sorted)
        ↓
<Slot name="..." />
        ↓
rendered output
```

- Slots are named injection points.
- Multiple entries can target the same slot.
- Higher priority renders first.
- Nearest engine wins (nested providers supported).

---

## Installation

```bash
npm install react-slot-engine-z
```

---

## Basic Usage

### 1️⃣ Create Engine

```ts
import { createSlotEngine } from "react-slot-engine-z"

export const engine = createSlotEngine()
```

---

### 2️⃣ Register Slot Content

```ts
engine.register("header", () => <h1>User Header</h1>)

engine.register(
  "header",
  () => <h1>Admin Header</h1>,
  { priority: 100 }
)
```

Higher priority entries render first.

---

### 3️⃣ Provide Engine

```tsx
import { SlotProvider } from "react-slot-engine-z"

<SlotProvider engine={engine}>
  <App />
</SlotProvider>
```

---

### 4️⃣ Declare Slots in Layout

```tsx
import { Slot } from "react-slot-engine-z"

function Layout() {
  return (
    <>
      <header>
        <Slot
          name="header"
          fallback={<h1>Default Header</h1>}
        />
      </header>

      <main>
        <Slot name="content" />
      </main>

      <footer>
        <Slot name="footer" />
      </footer>
    </>
  )
}
```

---

## Plugin System

Structured lifecycle for feature injection.

- Plugin receives engine
- Returns optional cleanup
- Supports async slots automatically via `React.lazy`

```ts
import React from "react"
import { SlotPlugin, applySlotPlugins } from "react-slot-engine-z"

const AdminPlugin: SlotPlugin = {
  name: "admin",
  setup(engine) {
    return engine.register(
      "header",
      React.lazy(() => import("./AdminHeader")),
      {
        priority: 100,
        async: true
      }
    )
  }
}

applySlotPlugins(engine, [AdminPlugin])
```

Async slots render with `React.Suspense`.

---

## Nested Engines

```tsx
<SlotProvider engine={createSlotEngine()}>
  <Layout />

  <SlotProvider>
    <Layout />
  </SlotProvider>
</SlotProvider>
```

### Behavior

- Nearest engine wins
- Falls back to parent engine if slot not found
- Enables page-level overrides
- Useful for role-based UI or micro-frontends

---

## Slot Options

```ts
engine.register(name, render, {
  priority?: number
  async?: boolean
})
```

| Option   | Description               |
|----------|---------------------------|
| priority | Higher renders first.     |
| async    | Enables Suspense wrapping |

---

## When To Use

- Extensible layout systems
- Plugin-driven dashboards
- Feature isolation
- Role-based rendering
- Micro-frontend composition
- Design systems with injection points

---

## When NOT To Use

- If you need global app state
- If you need reducer-based architecture
- If your UI is static and non-extensible

---

## Philosophy

```txt
Slots are explicit injection points.
Plugins are explicit registrations.
Rendering order is deterministic.

No magic.
```

---

## License

MIT