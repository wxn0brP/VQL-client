import { VqlQueryRaw } from "./vql.js";
export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VqlQueryRaw) => VQLResult;
export type VQLHooks = {
    onStart?: (query: VqlQueryRaw, hookContext: any) => void;
    onEnd?: (query: VqlQueryRaw, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VqlQueryRaw, error: unknown, result?: any, hookContext?: any) => void;
};
export declare function initVQLClient(config: {
    transport?: VQLTransport;
    hooks?: VQLHooks;
    defaultFetchUrl?: string;
}): void;
export declare function fetchVQL<T = any>(query: VqlQueryRaw, hookContext?: any): Promise<T>;
export declare function resetVQLClient(): void;
export declare function defaultFetchTransport(query: VqlQueryRaw): Promise<any>;
