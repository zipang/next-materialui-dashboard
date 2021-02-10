// dirname.cjs

/**
 * DIRTY HACK TO AVOID READING import.meta.url
 * WHICH IS BADLY SUPPORTED BY WEBPACK
 * @see https://medium.com/@almtechhub/es-modules-and-import-meta-dirname-babel-trick-39aad026682
 * @see https://github.com/rocicorp/replicache-sdk-js/issues/151
 *
 */

console.log(`__dirname : ${__dirname}, process.cwd(): ${process.cwd()}`);
module.exports = process.env.NODE_ENV === "test" ? __dirname : process.cwd();
