import { VQLUQ } from "./vql";

export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VQLUQ, fetchOptions?: FetchOptions) => VQLResult;
export interface VQLHooks {
    onStart?: (query: VQLUQ, hookContext: any) => void;
    onEnd?: (query: VQLUQ, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VQLUQ, error: unknown, result?: any, hookContext?: any) => void;
};

export interface Config {
    transport?: VQLTransport;
    fetchImplementation: typeof fetch;
    hooks?: VQLHooks;
    url?: string;
    /** default transport body */
    body?: Record<string, any>;
    /** default transport headers */
    headers?: Record<string, any>;
    /** default transport context */
    hookContext?: any;
}

export interface FetchOptions {
    signal?: AbortSignal;
    headers?: Record<string, any>;
    body?: Record<string, any>;
}

export const VConfig: Config = {
    transport: defTransport,
    fetchImplementation: (input, init) => fetch(input, init),
    hooks: {},
    url: "/VQL"
}

export async function fetchVQL<T = any>(query: VQLUQ<T>, vars: any = {}, hookContext: any = {}, fetchOptions: FetchOptions = {}): Promise<T> {
    const { transport, hooks } = VConfig;
    const start = Date.now();
    try {
        hookContext = Object.assign({}, VConfig.hookContext, vars, hookContext);
        hooks.onStart?.(query, hookContext);

        if (typeof query === "string" && Object.keys(vars).length) {
            query = {
                query: query,
                var: vars
            };
        }

        const res = await transport(query, fetchOptions);

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

export async function defTransport(query: VQLUQ, fetchOptions?: FetchOptions): Promise<any> {
    const headers = Object.assign(
        {
            "Content-Type": "application/json"
        },
        VConfig.headers,
        fetchOptions.headers
    )

    const body = Object.assign(
        {},
        VConfig.body,
        fetchOptions.body,
        {
            query
        }
    )

    const queryConfig: RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    }

    if (fetchOptions.signal) queryConfig.signal = fetchOptions.signal;

    const res = await VConfig.fetchImplementation(VConfig.url, queryConfig);

    if (!res.ok) throw new Error(`VQL request failed: ${res.status}`);
    return await res.json();
}

export const V = async <T = any>(
    strings: TemplateStringsArray,
    ...values: any[]
): Promise<T> => {
    const query = strings
        .map((str, i) => str.trim() + (values[i] !== undefined ? values[i] : ""))
        .join(" ");

    return fetchVQL<T>(query);
};

// Export global for CDN use
if (typeof window !== "undefined") {
    (window as any).VQLClient = {
        fetchVQL,
        defTransport,
        VQL: V,
        cfg: VConfig
    };
}