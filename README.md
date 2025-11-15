# @wxn0brp/vql-client

Minimalistic, pluggable client for **VQL** query execution.

Supports:

- ESM (`import`)
- CDN / `<script>` (`VQLClient`)
- Fully typed with TypeScript
- Custom transport layers and lifecycle hooks

## DOCS

[API Reference](https://wxn0brp.github.io/VQL-client/)

## Usage

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

## Usage

### `fetchVQL<T = any>(query: string | object, vars?: Object, hookContext?: Object): Promise<T>`

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
  onStart: (query, ctx) => console.log("VQL start", query),
  onEnd: (q, time, res, ctx) => console.log("VQL end", time + "ms", res),
  onError: (q, e, ctx) => console.error("VQL error", e)
}
```

## Default Transport

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

## License

MIT wxn0brP

## Contributing

Contributions are welcome!