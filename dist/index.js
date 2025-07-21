let transport = defaultFetchTransport;
let hooks = {};
let defaultFetchUrl = "/VQL";
export function initVQLClient(config) {
    if (config.transport)
        transport = config.transport;
    if (config.hooks)
        hooks = config.hooks;
    if (config.defaultFetchUrl)
        defaultFetchUrl = config.defaultFetchUrl;
}
export async function fetchVQL(query, hookContext = {}) {
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
        if (res.result !== undefined)
            return res.result;
        return res;
    }
    catch (e) {
        hooks.onError?.(query, e, null, hookContext);
        throw e;
    }
}
export function resetVQLClient() {
    transport = defaultFetchTransport;
    hooks = {};
}
export async function defaultFetchTransport(query) {
    const res = await fetch(defaultFetchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });
    if (!res.ok)
        throw new Error(`VQL request failed: ${res.status}`);
    return await res.json();
}
if (typeof window !== "undefined") {
    window.VQLClient = {
        fetchVQL,
        initVQLClient,
        resetVQLClient,
        defaultFetchTransport
    };
}
