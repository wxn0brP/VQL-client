import { VqlQueryRaw } from "./vql";

export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VqlQueryRaw) => VQLResult;
export interface VQLHooks {
    onStart?: (query: VqlQueryRaw, hookContext: any) => void;
    onEnd?: (query: VqlQueryRaw, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VqlQueryRaw, error: unknown, result?: any, hookContext?: any) => void;
};

export interface Config {
    transport?: VQLTransport,
    hooks?: VQLHooks,
    url?: string
}

export const VConfig: Config = {
    transport: defTransport,
    hooks: {},
    url: "/VQL"
}

export async function fetchVQL<T = any>(query: VqlQueryRaw<T>, hookContext: any = {}): Promise<T> {
    const { transport, hooks } = VConfig;
    const start = Date.now();
    try {
        hooks.onStart?.(query, hookContext);

        const res = await transport(query);

        const duration = Date.now() - start;
        hooks.onEnd?.(query, duration, res, hookContext);

        if (res?.err) {
            const error = new Error(res.err);
            hooks.onError?.(query, error, res, hookContext);
            throw error;
        }

        if (res.result !== undefined) return res.result;
        return res;
    } catch (e) {
        hooks.onError?.(query, e, null, hookContext);
        throw e;
    }
}

export async function defTransport(query: VqlQueryRaw): Promise<any> {
    const res = await fetch(VConfig.url, {
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
        defTransport,
        cfg: VConfig
    };
}