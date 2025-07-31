# @wxn0brp/vql-client

Minimalistic, pluggable client for **VQL** query execution.

Supports:

- ✅ ESM (`import`)
- ✅ CDN / `<script>` (`VQLClient`)
- ✅ Fully typed with TypeScript
- ✅ Custom transport layers and lifecycle hooks

## 🚀 Usage

### ESM

```ts
import { fetchVQL, VConfig } from "@wxn0brp/vql-client";

const result = await fetchVQL("db1 user! s._id = xyz");
```

### CDN

```html
<script src="https://unpkg.com/@wxn0brp/vql-client/dist/min.js"></script>
<script>
  VQLClient.fetchVQL("db1 user! s._id = xyz").then(console.log);
</script>
```

## 🧠 Usage

### `fetchVQL<T = any>(query: string | object): Promise<T>`

Executes a VQL query and returns the result (unwrapped from `{ result }`, unless an error is present).

### `VConfig`

Customize client behavior.

#### Example – custom transport and hooks:

```ts
VConfig.transport = async (query) => {
  return await fetch("/VQL", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  }).then(res => res.json());
}
VConfig.hooks = {
  onStart: (q) => console.log("VQL start", q),
  onEnd: (q, ms, r) => console.log("VQL end", ms + "ms", r),
  onError: (q, e) => console.error("VQL error", e)
}
```

## ✈️ Default Transport

```ts
defTransport(query): Promise<any>
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

## 📁 Output Files

```
dist/
├── index.js               # ESM build (import)
├── index.d.ts             # TypeScript types
├── vql-client.min.js      # Global (CDN, window.VQLClient)
```

## 📜 License

MIT wxn0brP
