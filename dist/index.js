;
export const VConfig = {
    transport: defTransport,
    fetchImplementation: (input, init) => fetch(input, init),
    hooks: {},
    url: "/VQL"
};
export async function fetchVQL(query, vars = {}, hookContext = {}, fetchOptions = {}) {
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
        if (res.result !== undefined)
            return res.result;
        return res;
    }
    catch (e) {
        hooks.onError?.(query, e, null, hookContext);
        throw e;
    }
}
export async function defTransport(query, fetchOptions) {
    const headers = Object.assign({
        "Content-Type": "application/json"
    }, VConfig.headers, fetchOptions.headers);
    const body = Object.assign({}, VConfig.body, fetchOptions.body, {
        query
    });
    const queryConfig = {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    };
    if (fetchOptions.signal)
        queryConfig.signal = fetchOptions.signal;
    const res = await VConfig.fetchImplementation(VConfig.url, queryConfig);
    if (!res.ok)
        throw new Error(`VQL request failed: ${res.status}`);
    return await res.json();
}
export const V = async (strings, ...values) => {
    const query = strings
        .map((str, i) => str.trim() + (values[i] !== undefined ? values[i] : ""))
        .join(" ");
    return fetchVQL(query);
};
if (typeof window !== "undefined") {
    window.VQLClient = {
        fetchVQL,
        defTransport,
        VQL: V,
        cfg: VConfig
    };
}
