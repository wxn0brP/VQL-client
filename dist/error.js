export const VQLErrorCodes = {
    QUERY_PARSE: "VQL_QUERY_PARSE",
    QUERY_VALIDATION: "VQL_QUERY_VALIDATION",
    DB_NOT_FOUND: "VQL_DB_NOT_FOUND",
    PERMISSION_DENIED: "VQL_PERMISSION_DENIED",
    RELATION_INVALID: "VQL_RELATION_INVALID",
    CONFIG_INVALID: "VQL_CONFIG_INVALID",
    OPERATION_NOT_FOUND: "VQL_OPERATION_NOT_FOUND",
    HANDLER_MISSING: "VQL_HANDLER_MISSING",
    INTERNAL: "VQL_INTERNAL",
};
export class VQLError extends Error {
    code;
    statusCode;
    suggestion;
    context;
    raw;
    constructor(payload) {
        super(payload.msg ?? payload.message ?? "Unknown VQL error");
        this.name = "VQLError";
        this.code = payload.code;
        this.statusCode = payload.c ?? 500;
        this.suggestion = payload.suggestion;
        this.context = payload.context;
        this.raw = payload;
    }
}
export function isVQLError(e) {
    return e instanceof VQLError;
}
export function isVQLErrorCode(e, code) {
    return e instanceof VQLError && e.code === code;
}
