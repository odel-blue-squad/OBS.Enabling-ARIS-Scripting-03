import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

var ncp = require("node-clipboardy");
const isProduction = process.env.NODE_ENV === "production";
export default {
  input: "src/index.js",
  output: {
    file: "build/EXPORT_TO_ARIS.js",
    format: "iife",
  },
  plugins: [
    resolve(),

    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/env",
          {
            targets: { browsers: ["ie < 8"] },
            useBuiltIns: "usage",
            corejs: {
              version: 3,
              proposals: true,
            },
          },
        ],
      ],
    }),
    isProduction && terser(),
    {
      name: "post-build",
      generateBundle(_options, bundles) {
        const file = Object.keys(bundles)[0];
        const bundleContents = bundles[file].code;
        ncp.write(bundleContents);
      },
    },
  ],
};
