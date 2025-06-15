import { VqlQueryRaw } from "./vql";

export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VqlQueryRaw) => VQLResult;
export type VQLHooks = {
    onStart?: (query: VqlQueryRaw) => void;
    onEnd?: (query: VqlQueryRaw, durationMs: number, result: any) => void;
    onError?: (query: VqlQueryRaw, error: unknown) => void;
};

let transport: VQLTransport = defaultFetchTransport;
let hooks: VQLHooks = {};
let defaultFetchUrl = "/VQL";

export function initVQLClient(config: {
    transport?: VQLTransport,
    hooks?: VQLHooks,
    defaultFetchUrl?: string
}) {
    if (config.transport) transport = config.transport;
    if (config.hooks) hooks = config.hooks;
    if (config.defaultFetchUrl) defaultFetchUrl = config.defaultFetchUrl;
}

export async function fetchVQL<T = any>(query: VqlQueryRaw): Promise<T> {
    const start = Date.now();
    try {
        hooks.onStart?.(query);

        const res = await transport(query);

        const duration = Date.now() - start;
        hooks.onEnd?.(query, duration, res);

        if (res?.err) {
            const error = new Error(res.err);
            hooks.onError?.(query, error);
            throw error;
        }

        if (res.result !== undefined) return res.result;
        return res;
    } catch (e) {
        hooks.onError?.(query, e);
        throw e;
    }
}

export function resetVQLClient() {
    transport = defaultFetchTransport;
    hooks = {};
}

export async function defaultFetchTransport(query: VqlQueryRaw): Promise<any> {
    const res = await fetch(defaultFetchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });

    if (!res.ok) throw new Error(`VQL request failed: ${res.status}`);
    return await res.json();
}

// Export global for CDN use
if (typeof window !== "undefined") {
    (window as any).VQLClient = {
        fetchVQL,
        initVQLClient,
        resetVQLClient,
        defaultFetchTransport
    };
}