// @ts-check

const esbuild = require("esbuild");
const gulp = require("gulp");
const sass = require("sass");
const fs = require("fs/promises");
const DevServer = require("http-server");

const build = gulp.parallel(buildTs, buildSass);

async function buildTs() {
  const /** @type {esbuild.BuildOptions} */ options = {
      bundle: true,
      target: ["chrome50", "firefox50", "safari10"],
      sourcemap: true,
    };

  const builders = [
    esbuild.build({
      ...options,
      entryPoints: ["src/index.ts"],
      outfile: "dist/index.js",
    }),
    esbuild.build({
      ...options,
      entryPoints: ["src/admin.ts"],
      outfile: "dist/admin.js",
    }),
  ];
  return Promise.all(builders);
}

async function buildSass() {
  const result = await sass.compileAsync("src/styles.scss", {
    style: "compressed",
  });

  const writers = [fs.writeFile("dist/styles.css", result.css)];
  return Promise.all(writers);
}

async function watch() {
  const /** @type {gulp.WatchOptions} */ opts = {
      ignoreInitial: false,
    };

  const devServer = DevServer.createServer({
    root: "dist",
  });
  await new Promise((resolve) => {
    devServer.listen(8080, () => {
      console.log("dev server on http://localhost:8080");
      resolve(null);
    });
  });

  gulp.watch("src/**/*.ts", opts, buildTs);
  gulp.watch("src/**/*.scss", opts, buildSass);
}

module.exports = {
  buildTs,
  buildSass,
  watch,
  default: build,
};
