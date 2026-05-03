import { VQLUQ } from "./vql";
export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VQLUQ, fetchOptions?: FetchOptions) => VQLResult;
export interface VQLHooks {
    onStart?: (query: VQLUQ, hookContext: any) => void;
    onEnd?: (query: VQLUQ, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VQLUQ, error: unknown, result?: any, hookContext?: any) => void;
}
export interface Config {
    transport?: VQLTransport;
    fetchImplementation: typeof fetch;
    hooks?: VQLHooks;
    url?: string;
    body?: Record<string, any>;
    headers?: Record<string, any>;
    hookContext?: any;
}
export interface FetchOptions {
    signal?: AbortSignal;
    headers?: Record<string, any>;
    body?: Record<string, any>;
}
export declare const VConfig: Config;
export declare function fetchVQL<T = any>(query: VQLUQ<T>, vars?: any, hookContext?: any, fetchOptions?: FetchOptions): Promise<T>;
export declare function defTransport(query: VQLUQ, fetchOptions?: FetchOptions): Promise<any>;
export declare const V: <T = any>(strings: TemplateStringsArray, ...values: any[]) => Promise<T>;
