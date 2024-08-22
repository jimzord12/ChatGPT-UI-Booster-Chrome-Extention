import { resolve } from "path";

const absPath = resolve(__dirname, "../");
const popupOutputPath = resolve(absPath, "extension/dist/popup");

export { popupOutputPath };
