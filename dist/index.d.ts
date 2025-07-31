import { VqlQueryRaw } from "./vql";
export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VqlQueryRaw) => VQLResult;
export interface VQLHooks {
    onStart?: (query: VqlQueryRaw, hookContext: any) => void;
    onEnd?: (query: VqlQueryRaw, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VqlQueryRaw, error: unknown, result?: any, hookContext?: any) => void;
}
export interface Config {
    transport?: VQLTransport;
    hooks?: VQLHooks;
    url?: string;
}
export declare const VConfig: Config;
export declare function fetchVQL<T = any>(query: VqlQueryRaw<T>, hookContext?: any): Promise<T>;
export declare function defTransport(query: VqlQueryRaw): Promise<any>;
