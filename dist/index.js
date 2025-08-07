;
export const VConfig = {
    transport: defTransport,
    hooks: {},
    url: "/VQL"
};
export async function fetchVQL(query, hookContext = {}) {
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
        if (res.result !== undefined)
            return res.result;
        return res;
    }
    catch (e) {
        hooks.onError?.(query, e, null, hookContext);
        throw e;
    }
}
export async function defTransport(query) {
    const res = await fetch(VConfig.url, {
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
        defTransport,
        cfg: VConfig
    };
}
