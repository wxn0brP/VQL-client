# @wxn0brp/vql-client

Minimalistic, pluggable client for **VQL** query execution.

Supports:

- ✅ ESM (`import`)
- ✅ CJS (`require`)
- ✅ CDN / `<script>` (`VQLClient`)
- ✅ Fully typed with TypeScript
- ✅ Custom transport layers and lifecycle hooks

## 📦 Installation

### NPM

```bash
npm install @wxn0brp/vql-client
```

```ts
import { fetchVQL, initVQLClient, resetVQLClient } from "@wxn0brp/vql-client";

const result = await fetchVQL("db1 user! s._id = xyz");
```

### CDN

```html
<script src="/dist/vql-client.min.js"></script>
<script>
  VQLClient.fetchVQL("db1 user! s._id = xyz").then(console.log);
</script>
```

You can also serve `vql-client.min.js` from your own CDN or static server.

## 🧠 Usage

### `fetchVQL<T = any>(query: string | object): Promise<T>`

Executes a VQL query and returns the result (unwrapped from `{ result }`, unless an error is present).

### `initVQLClient(config: { transport?: fn, hooks?: {...} })`

Customize client behavior.

#### Example – custom transport and hooks:

```ts
initVQLClient({
  transport: async (query) => {
    return await fetch("/VQL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    }).then(res => res.json());
  },
  hooks: {
    onStart: (q) => console.log("VQL start", q),
    onEnd: (q, ms, r) => console.log("VQL end", ms + "ms", r),
    onError: (q, e) => console.error("VQL error", e)
  }
});
```

### `resetVQLClient()`

Reset transport and hooks to default.

## ✈️ Default Transport

```ts
defaultFetchTransport(query): Promise<any>
```

Sends:

```
POST /VQL
Content-Type: application/json
Body: { query }
```

Returns:

```
{
  result: any,
  err?: string
}
```

Use `initVQLClient({ transport })` to override with WebSocket, RPC, etc.

## 📁 Output Files

```
dist/
├── index.js               # ESM build (import)
├── index.d.ts             # TypeScript types
├── vql-client.cjs         # CommonJS build (require)
├── vql-client.min.js      # Global (CDN, window.VQLClient)
```

## 🧾 Typings in Browser

You can manually copy `index.d.ts` to your local project or declare global types:

```ts
declare const VQLClient: {
  fetchVQL<T = any>(query: string | object): Promise<T>;
  initVQLClient(config: {
    transport?: (query: string | object) => Promise<any>,
    hooks?: {
      onStart?: (query: string | object) => void,
      onEnd?: (query: string | object, ms: number, result: any) => void,
      onError?: (query: string | object, error: unknown) => void
    }
  }): void;
  resetVQLClient(): void;
  defaultFetchTransport(query: string | object): Promise<any>;
};
```

## 🧪 Example

```ts
const result = await fetchVQL("api getUser! s._id = abc123");
console.log(result.name);
```

## 📜 License

MIT © wxn0brP
