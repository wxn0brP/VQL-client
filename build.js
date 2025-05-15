import esbuild from "esbuild";

const sharedConfig = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    sourcemap: false,
    target: "es2017",
};

Promise.all([
    // IIFE + minified
    esbuild.build({
        ...sharedConfig,
        format: "iife",
        globalName: "VQLClient",
        minify: true,
        outfile: "dist/vql-client.min.js",
    }),

    // CommonJS - require
    esbuild.build({
        ...sharedConfig,
        format: "cjs",
        outfile: "dist/vql-client.cjs",
    }),
])
    .then(() => {
        console.log("✅ Build complete");
    })
    .catch((e) => {
        console.error("❌ Build failed:", e);
        process.exit(1);
    });