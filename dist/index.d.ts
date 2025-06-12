export type VQLQuery = string | object;
export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VQLQuery) => VQLResult;
export type VQLHooks = {
    onStart?: (query: VQLQuery) => void;
    onEnd?: (query: VQLQuery, durationMs: number, result: any) => void;
    onError?: (query: VQLQuery, error: unknown) => void;
};
export declare function initVQLClient(config: {
    transport?: VQLTransport;
    hooks?: VQLHooks;
    defaultFetchUrl?: string;
}): void;
export declare function fetchVQL<T = any>(query: VQLQuery): Promise<T>;
export declare function resetVQLClient(): void;
export declare function defaultFetchTransport(query: VQLQuery): Promise<any>;
