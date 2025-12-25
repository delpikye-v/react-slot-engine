## 🧩 react-slot-engine-z

[![NPM](https://img.shields.io/npm/v/react-slot-engine-z.svg)](https://www.npmjs.com/package/react-slot-engine-z)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Downloads](https://img.shields.io/npm/dt/react-slot-engine-z.svg)

---

A lightweight slot & plugin engine for composing React UIs dynamically.
Enable plugin-driven UI, layout extensibility, and feature isolation — no prop drilling, no heavy context, no tight coupling.

<a href="https://codesandbox.io/p/sandbox/9sqx24" target="_blank">LIVE EXAMPLE</a>

---

### ✨ Why react-slot-engine-z?

- Slot-based UI composition

- Scoped engines (nested providers)

- Plugin-driven architecture

- Priority-based rendering

- Async / lazy slot support

- No global store, no prop drilling

- React 17+

---

### 📦 Installation
```ts
npm install react-slot-engine-z
```
  
---

### 🚀 Basic Usage

##### 1️⃣ Create a Slot Engine
```ts
// require
import { createSlotEngine } from "react-slot-engine-z"

export const engine = createSlotEngine()
```

##### 2️⃣ Register Slot Content

```ts
engine.register("header", () => <h1>User Header</h1>)

engine.register(
  "header",
  () => <h1>Admin Header</h1>,
  { priority: 100 } // higher priority renders first
)
```

- Higher priority entries are rendered first.

##### 3️⃣ Provide the Engine
```ts
import { SlotProvider } from "react-slot-engine-z"

<SlotProvider engine={engine}>
  <App />
</SlotProvider>
```

##### 4️⃣ Declare Slots in Layout
```ts
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

### 🔌 Plugin System

- Slot Engine supports a structured plugin lifecycle.
- Async slots automatically render with React.Suspense.

```ts
import React from "react"
import { SlotPlugin, applySlotPlugins } from "react-slot-engine-z"

const AdminPlugin: SlotPlugin = {
  name: "admin",
  setup(engine) {
    return engine.register(
      "header",
      React.lazy(() => import("./AdminHeader")),
      { priority: 100, async: true }
    )
  },
}

// Apply plugin
applySlotPlugins(engine, [AdminPlugin])
```

--- 

### 🧩 Nested Engine Example

```ts
<SlotProvider engine={rootEngine}>
  <Layout />

  <SlotProvider>
    <Layout />
  </SlotProvider>
</SlotProvider>
```

- Nearest engine wins, fallback to parent if slot missing

- Useful for page-level or role-based overrides

---

### 🧠 When Should You Use This?

- Extensible layouts

- Plugin-based UI systems

- Feature isolation

- Role / environment-based UI

- Micro-frontend friendly composition

---

### 📜 License

MIT