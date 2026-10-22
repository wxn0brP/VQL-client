import { afterEach, describe, expect, it } from "bun:test";
import {
	V,
	VConfig,
	VQLError,
	VQLErrorCodes,
	defTransport,
	fetchVQL,
	isVQLError,
	isVQLErrorCode,
} from "../src";

const originalConfig = {
	...VConfig,
};

afterEach(() => {
	Object.assign(VConfig, originalConfig);
});

describe("VQLError", () => {
	it("maps a wire payload", () => {
		const raw = {
			err: true,
			msg: 'Database "shop" not found',
			c: 400,
			code: VQLErrorCodes.DB_NOT_FOUND,
			suggestion: "Check the database name",
			context: {
				db: "shop",
			},
		};
		const err = new VQLError(raw as any);

		expect(err).toBeInstanceOf(Error);
		expect(err.name).toBe("VQLError");
		expect(err.message).toBe('Database "shop" not found');
		expect(err.code).toBe(VQLErrorCodes.DB_NOT_FOUND);
		expect(err.statusCode).toBe(400);
		expect(err.suggestion).toBe("Check the database name");
		expect(err.context).toEqual({
			db: "shop",
		});
		expect(err.raw).toBe(raw as any);
	});

	it("falls back to message and status 500", () => {
		const err = new VQLError({
			message: "Something failed",
		});

		expect(err.message).toBe("Something failed");
		expect(err.statusCode).toBe(500);
		expect(err.code).toBeUndefined();
	});

	it("uses a generic message for empty payloads", () => {
		const err = new VQLError({});

		expect(err.message).toBe("Unknown VQL error");
	});

	it("isVQLError accepts client VQL errors only", () => {
		expect(isVQLError(new VQLError({}))).toBe(true);
		expect(isVQLError(new Error("plain"))).toBe(false);
		expect(
			isVQLError({
				err: true,
				code: VQLErrorCodes.INTERNAL,
			}),
		).toBe(false);
	});

	it("isVQLErrorCode narrows by code", () => {
		const err = new VQLError({
			c: 403,
			code: VQLErrorCodes.PERMISSION_DENIED,
		});

		expect(isVQLErrorCode(err, VQLErrorCodes.PERMISSION_DENIED)).toBe(true);
		expect(isVQLErrorCode(err, VQLErrorCodes.DB_NOT_FOUND)).toBe(false);
		expect(
			isVQLErrorCode(new Error("plain"), VQLErrorCodes.PERMISSION_DENIED),
		).toBe(false);
	});
});

describe("fetchVQL", () => {
	it("unwraps result and runs hooks", async () => {
		const seen: any = {
			start: [],
			end: [],
			error: [],
		};
		VConfig.hooks = {
			onStart: (query, ctx) =>
				seen.start.push([
					query,
					ctx,
				]),
			onEnd: (query, duration, result, ctx) =>
				seen.end.push([
					query,
					duration,
					result,
					ctx,
				]),
			onError: (...args) => seen.error.push(args),
		};
		VConfig.transport = async () => ({
			err: false,
			result: {
				ok: true,
			},
		});

		const result = await fetchVQL("db users");

		expect(result).toEqual({
			ok: true,
		});
		expect(seen.start).toHaveLength(1);
		expect(seen.end).toHaveLength(1);
		expect(seen.end[0][1]).toBeNumber();
		expect(seen.end[0][2]).toEqual({
			err: false,
			result: {
				ok: true,
			},
		});
		expect(seen.error).toHaveLength(0);
	});

	it("returns the raw response when result is absent", async () => {
		VConfig.transport = async () => ({
			value: 42,
		});

		expect(await fetchVQL("db users")).toEqual({
			value: 42,
		});
	});

	it("wraps string queries with vars", async () => {
		let received: any;
		VConfig.transport = async query => {
			received = query;
			return {
				result: [],
			};
		};

		await fetchVQL("db users s._id=$id", {
			id: 1,
		});

		expect(received).toEqual({
			query: "db users s._id=$id",
			var: {
				id: 1,
			},
		});
	});

	it("keeps string queries without vars", async () => {
		let received: any;
		VConfig.transport = async query => {
			received = query;
			return {
				result: [],
			};
		};

		await fetchVQL("db users");

		expect(received).toBe("db users");
	});

	it("merges hook context", async () => {
		let ctx: any;
		VConfig.hookContext = {
			requestId: "r1",
		};
		VConfig.transport = async () => ({
			result: null,
		});
		VConfig.hooks = {
			onStart: (_query, hookContext) => {
				ctx = hookContext;
			},
		};

		await fetchVQL(
			"db users",
			{
				id: 1,
			},
			{
				user: "u1",
			},
		);

		expect(ctx).toEqual({
			requestId: "r1",
			id: 1,
			user: "u1",
		});
	});

	it("forwards fetch options to the transport", async () => {
		const signal = new AbortController().signal;
		const fetchOptions = {
			signal,
		};
		let received: any;
		VConfig.transport = async (_query, options) => {
			received = options;
			return {
				result: null,
			};
		};

		await fetchVQL("db users", {}, {}, fetchOptions);

		expect(received).toBe(fetchOptions);
	});

	it("throws VQLError for an error payload", async () => {
		const payload = {
			err: true,
			msg: "denied",
			c: 403,
			code: VQLErrorCodes.PERMISSION_DENIED,
			suggestion: "login",
			context: {
				reason: "no user",
			},
		};
		VConfig.transport = async () => payload;

		const error = (await fetchVQL("db users").catch(e => e)) as VQLError;

		expect(error).toBeInstanceOf(VQLError);
		expect(error.message).toBe("denied");
		expect(error.statusCode).toBe(403);
		expect(error.code).toBe(VQLErrorCodes.PERMISSION_DENIED);
		expect(error.suggestion).toBe("login");
		expect(error.context).toEqual({
			reason: "no user",
		});
		expect(error.raw).toBe(payload as any);
	});

	it("reports an error payload once", async () => {
		let calls = 0;
		let lastError: unknown;
		let lastResult: unknown;
		VConfig.hooks = {
			onError: (_query, error, result) => {
				calls++;
				lastError = error;
				lastResult = result;
			},
		};
		const payload = {
			err: true,
			msg: "boom",
			c: 500,
			code: VQLErrorCodes.INTERNAL,
		};
		VConfig.transport = async () => payload;

		await fetchVQL("db users").catch(() => {});

		expect(calls).toBe(1);
		expect(lastError).toBeInstanceOf(VQLError);
		expect(lastResult).toBe(payload);
	});

	it("rethrows transport errors once", async () => {
		const networkError = new Error("network down");
		let calls = 0;
		let lastError: unknown;
		VConfig.hooks = {
			onError: (_query, error) => {
				calls++;
				lastError = error;
			},
		};
		VConfig.transport = async () => {
			throw networkError;
		};

		const error = await fetchVQL("db users").catch(e => e);

		expect(error).toBe(networkError);
		expect(calls).toBe(1);
		expect(lastError).toBe(networkError);
	});

	it("prefers the error payload over a result", async () => {
		VConfig.transport = async () => ({
			err: true,
			msg: "failed",
			result: {
				partial: true,
			},
		});

		const error = await fetchVQL("db users").catch(e => e);

		expect(error).toBeInstanceOf(VQLError);
		expect((error as VQLError).message).toBe("failed");
	});

	it("builds a query from a tagged template", async () => {
		let received: any;
		VConfig.transport = async query => {
			received = query;
			return {
				result: null,
			};
		};

		await V`db find users s._id = ${1}`;

		expect(received).toContain("db find users s._id =1");
	});
});

describe("defTransport", () => {
	it("sends the merged request and returns the payload", async () => {
		let url: any;
		let init: any;
		VConfig.url = "/custom";
		VConfig.headers = {
			"X-Default": "d",
		};
		VConfig.body = {
			defaultBody: true,
		};
		VConfig.fetchImplementation = async (input, requestInit) => {
			url = input;
			init = requestInit;
			return new Response(
				JSON.stringify({
					err: false,
					result: [
						1,
					],
				}),
				{
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		};

		const data = await defTransport("db users" as any, {
			headers: {
				"X-Custom": "c",
				"X-Default": "override",
			},
			body: {
				customBody: true,
			},
		});

		expect(url).toBe("/custom");
		expect(init.method).toBe("POST");
		expect(init.headers).toEqual({
			"Content-Type": "application/json",
			"X-Default": "override",
			"X-Custom": "c",
		});
		expect(JSON.parse(init.body)).toEqual({
			defaultBody: true,
			customBody: true,
			query: "db users",
		});
		expect(data).toEqual({
			err: false,
			result: [
				1,
			],
		});
	});

	it("passes the abort signal", async () => {
		const controller = new AbortController();
		let init: any;
		VConfig.fetchImplementation = async (_input, requestInit) => {
			init = requestInit;
			return new Response(
				JSON.stringify({
					result: null,
				}),
				{
					status: 200,
				},
			);
		};

		await defTransport("db users" as any, {
			signal: controller.signal,
		});

		expect(init.signal).toBe(controller.signal);
	});

	it("throws VQLError for an error payload", async () => {
		VConfig.fetchImplementation = async () =>
			new Response(
				JSON.stringify({
					err: true,
					msg: "denied",
					c: 403,
					code: VQLErrorCodes.PERMISSION_DENIED,
					suggestion: "login",
					context: {
						reason: "no user",
					},
				}),
				{
					status: 403,
				},
			);

		const error = (await defTransport("db users" as any).catch(
			e => e,
		)) as VQLError;

		expect(error).toBeInstanceOf(VQLError);
		expect(error.message).toBe("denied");
		expect(error.statusCode).toBe(403);
		expect(error.code).toBe(VQLErrorCodes.PERMISSION_DENIED);
		expect(error.suggestion).toBe("login");
		expect(error.context).toEqual({
			reason: "no user",
		});
	});

	it("throws VQLError for an HTTP failure without payload", async () => {
		VConfig.fetchImplementation = async () =>
			new Response(null, {
				status: 502,
			});

		const error = (await defTransport("db users" as any).catch(
			e => e,
		)) as VQLError;

		expect(error).toBeInstanceOf(VQLError);
		expect(error.message).toBe("VQL request failed: 502");
		expect(error.statusCode).toBe(502);
		expect(error.code).toBeUndefined();
	});

	it("surfaces server errors through fetchVQL", async () => {
		let calls = 0;
		VConfig.hooks = {
			onError: () => {
				calls++;
			},
		};
		VConfig.fetchImplementation = async () =>
			new Response(
				JSON.stringify({
					err: true,
					msg: "boom",
					c: 500,
					code: VQLErrorCodes.INTERNAL,
				}),
				{
					status: 500,
				},
			);

		const error = await fetchVQL("db users").catch(e => e);

		expect(error).toBeInstanceOf(VQLError);
		expect((error as VQLError).code).toBe(VQLErrorCodes.INTERNAL);
		expect(calls).toBe(1);
	});
});
