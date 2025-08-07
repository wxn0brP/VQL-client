import { VQLUQ } from "./vql";
export type VQLResult<T = any> = Promise<T>;
export type VQLTransport = (query: VQLUQ) => VQLResult;
export interface VQLHooks {
    onStart?: (query: VQLUQ, hookContext: any) => void;
    onEnd?: (query: VQLUQ, durationMs: number, result: any, hookContext: any) => void;
    onError?: (query: VQLUQ, error: unknown, result?: any, hookContext?: any) => void;
}
export interface Config {
    transport?: VQLTransport;
    hooks?: VQLHooks;
    url?: string;
}
export declare const VConfig: Config;
export declare function fetchVQL<T = any>(query: VQLUQ<T>, hookContext?: any): Promise<T>;
export declare function defTransport(query: VQLUQ): Promise<any>;
