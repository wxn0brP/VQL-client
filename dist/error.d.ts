export declare const VQLErrorCodes: {
    readonly QUERY_PARSE: "VQL_QUERY_PARSE";
    readonly QUERY_VALIDATION: "VQL_QUERY_VALIDATION";
    readonly DB_NOT_FOUND: "VQL_DB_NOT_FOUND";
    readonly PERMISSION_DENIED: "VQL_PERMISSION_DENIED";
    readonly RELATION_INVALID: "VQL_RELATION_INVALID";
    readonly CONFIG_INVALID: "VQL_CONFIG_INVALID";
    readonly OPERATION_NOT_FOUND: "VQL_OPERATION_NOT_FOUND";
    readonly HANDLER_MISSING: "VQL_HANDLER_MISSING";
    readonly INTERNAL: "VQL_INTERNAL";
};
export type VQLCode = (typeof VQLErrorCodes)[keyof typeof VQLErrorCodes];
export interface VQLErrorResponse {
    err?: true;
    msg?: string;
    message?: string;
    c?: number;
    code?: string;
    suggestion?: string;
    context?: Record<string, unknown>;
}
export declare class VQLError extends Error {
    code?: VQLCode;
    statusCode: number;
    suggestion?: string;
    context?: Record<string, unknown>;
    raw: VQLErrorResponse;
    constructor(payload: VQLErrorResponse);
}
export declare function isVQLError(e: unknown): e is VQLError;
export declare function isVQLErrorCode<K extends VQLCode>(e: unknown, code: K): e is VQLError & {
    code: K;
};
