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
} as const;

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

export class VQLError extends Error {
	code?: VQLCode;
	statusCode: number;
	suggestion?: string;
	context?: Record<string, unknown>;
	raw: VQLErrorResponse;

	constructor(payload: VQLErrorResponse) {
		super(payload.msg ?? payload.message ?? "Unknown VQL error");
		this.name = "VQLError";
		this.code = payload.code as VQLCode | undefined;
		this.statusCode = payload.c ?? 500;
		this.suggestion = payload.suggestion;
		this.context = payload.context;
		this.raw = payload;
	}
}

export function isVQLError(e: unknown): e is VQLError {
	return e instanceof VQLError;
}

export function isVQLErrorCode<K extends VQLCode>(
	e: unknown,
	code: K,
): e is VQLError & {
	code: K;
} {
	return e instanceof VQLError && e.code === code;
}
