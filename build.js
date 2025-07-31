import esbuild from "esbuild";

esbuild.build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    sourcemap: false,
    target: "es2017",
    format: "iife",
    globalName: "VQLClient",
    minify: true,
    outfile: "dist/min.js",
});