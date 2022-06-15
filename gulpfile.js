// @ts-check

const esbuild = require("esbuild");
const gulp = require("gulp");
const sass = require("sass");
const fs = require("fs/promises");
const callbackGlob = require("glob");
const { promisify } = require("util");
const DevServer = require("http-server");

const glob = promisify(callbackGlob);

const build = gulp.series(clean, gulp.parallel(buildTs, buildSass));

async function clean() {
  const targetFiles = await glob("public/**/*.*(js|css|map)");
  const removers = targetFiles.map((targetFile) => fs.rm(targetFile));
  return Promise.all(removers);
}

async function buildTs() {
  const /** @type {esbuild.BuildOptions} */ options = {
      bundle: true,
      target: ["chrome80", "firefox80", "safari12"],
      sourcemap: true,
    };

  const builders = [
    esbuild.build({
      ...options,
      entryPoints: ["src/index.ts"],
      outfile: "public/index.js",
    }),
    esbuild.build({
      ...options,
      entryPoints: ["src/admin.ts"],
      outfile: "public/admin.js",
    }),
  ];
  return Promise.all(builders);
}

async function buildSass() {
  const result = await sass.compileAsync("src/styles.scss", {
    style: "compressed",
  });

  const writers = [fs.writeFile("public/styles.css", result.css)];
  return Promise.all(writers);
}

async function watch() {
  const /** @type {gulp.WatchOptions} */ opts = {
      ignoreInitial: false,
    };

  const devServer = DevServer.createServer({
    root: "public",
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
  build,
  clean,
  default: build,
};
