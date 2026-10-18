# @wxn0brp/vql-client

Minimalistic, pluggable client for **VQL** query execution.

Supports:

- ESM (`import`)
- CDN / `<script>` (`VQLClient`)
- Fully typed with TypeScript
- Custom transport layers and lifecycle hooks

## Installation

```bash
npm install @wxn0brp/vql-client
```

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

### `fetchVQL<T = any>(query: string | object, vars?: Object, hookContext?: Object, fetchOptions?: FetchOptions): Promise<T>`

Executes a VQL query and returns the result (unwrapped from `{ result }`, unless an error is present).

On error, `fetchVQL` throws a `VQLError` carrying the structured payload from the VQL server.

```ts
import { fetchVQL, VQLError, VQLErrorCodes } from "@wxn0brp/vql-client";

try {
	await fetchVQL("db1 user! s._id = xyz");
} catch (e) {
	if (e instanceof VQLError) {
		console.log(e.code);        // "VQL_DB_NOT_FOUND" (typed VQLCode)
		console.log(e.statusCode);  // HTTP status, e.g. 400
		console.log(e.suggestion);  // hint from the server
		console.log(e.context);     // structured context, e.g. { db: "db1" }
		console.log(e.message);     // human-readable message

		switch (e.code) {
			case VQLErrorCodes.DB_NOT_FOUND:
				// fatal, do not retry
				break;
			case VQLErrorCodes.PERMISSION_DENIED:
				// redirect to login
				break;
		}
	}
}
```

There are also guards for ergonomic narrowing (`isVQLError`, `isVQLErrorCode`):

```ts
import { isVQLErrorCode, VQLErrorCodes } from "@wxn0brp/vql-client";

if (isVQLErrorCode(e, VQLErrorCodes.PERMISSION_DENIED)) {
	// e is narrowed to VQLError with code "VQL_PERMISSION_DENIED"
}
```

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

## About Releases

Some releases may not have associated source code commits (e.g., `0.2.8`, `0.2.7`). These releases contain type definition updates only.

The `vql.d.ts` file is not maintained in this repository. During the release process, it is fetched (via `curl`) from the main project repository and included in the published package. If only the external type definitions change, a new version is published without modifying this repository’s source code.

## License

MIT. See [LICENSE](./LICENSE)

## Contributing

Contributions are welcome!
