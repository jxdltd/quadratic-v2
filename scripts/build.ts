await Bun.build({
  entrypoints: ["./server.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  minify: true,
});

await Bun.build({
  entrypoints: ["./react/index.tsx"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  splitting: true,
  external: ["react", "react-dom"],
  banner: '"use client";',
  minify: true,
});
