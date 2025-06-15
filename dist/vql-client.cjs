var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  defaultFetchTransport: () => defaultFetchTransport,
  fetchVQL: () => fetchVQL,
  initVQLClient: () => initVQLClient,
  resetVQLClient: () => resetVQLClient
});
module.exports = __toCommonJS(index_exports);
var transport = defaultFetchTransport;
var hooks = {};
var defaultFetchUrl = "/VQL";
function initVQLClient(config) {
  if (config.transport) transport = config.transport;
  if (config.hooks) hooks = config.hooks;
  if (config.defaultFetchUrl) defaultFetchUrl = config.defaultFetchUrl;
}
async function fetchVQL(query) {
  var _a, _b, _c, _d;
  const start = Date.now();
  try {
    (_a = hooks.onStart) == null ? void 0 : _a.call(hooks, query);
    const res = await transport(query);
    const duration = Date.now() - start;
    (_b = hooks.onEnd) == null ? void 0 : _b.call(hooks, query, duration, res);
    if (res == null ? void 0 : res.err) {
      const error = new Error(res.err);
      (_c = hooks.onError) == null ? void 0 : _c.call(hooks, query, error);
      throw error;
    }
    if (res.result !== void 0) return res.result;
    return res;
  } catch (e) {
    (_d = hooks.onError) == null ? void 0 : _d.call(hooks, query, e);
    throw e;
  }
}
function resetVQLClient() {
  transport = defaultFetchTransport;
  hooks = {};
}
async function defaultFetchTransport(query) {
  const res = await fetch(defaultFetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error(`VQL request failed: ${res.status}`);
  return await res.json();
}
if (typeof window !== "undefined") {
  window.VQLClient = {
    fetchVQL,
    initVQLClient,
    resetVQLClient,
    defaultFetchTransport
  };
}
