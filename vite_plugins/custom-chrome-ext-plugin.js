import {
  renameSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

import { popupOutputPath } from "./outputPaths";

export const chromeExtPlugin = {
  name: "custom-chrome-extention-plugin",
  closeBundle() {
    const absPath = resolve(__dirname, "../");
    console.log("Abs path: ", absPath);

    const outputDir = resolve(absPath, "dist");
    const assetsDir = resolve(outputDir, "assets");

    // Rename index.html to popup.html
    const oldFile = resolve(outputDir, "index.html");
    const newFile = resolve(outputDir, "popup.html");

    if (existsSync(oldFile)) {
      renameSync(oldFile, newFile);
      console.log("1. Renamed index.html to popup.html");
    } else {
      console.log("Old file: ", oldFile);
      console.log("New file: ", newFile);
      console.error("index.html not found, renaming skipped.");
      return;
    }

    // Rename index-*.js to popup.js (remove hash)
    const jsFiles = readdirSync(assetsDir).filter(
      (file) => file.startsWith("index-") && file.endsWith(".js")
    );
    if (jsFiles.length > 0) {
      const oldJsFile = resolve(assetsDir, jsFiles[0]);
      const newJsFile = resolve(assetsDir, "popup.js"); // Removing hash completely
      renameSync(oldJsFile, newJsFile);
      console.log(`2. Renamed ${jsFiles[0]} to popup.js`);
    } else {
      console.error("index-*.js not found, renaming skipped.");
    }

    // Rename index-*.css to popup.css (remove hash)
    const cssFiles = readdirSync(assetsDir).filter(
      (file) => file.startsWith("index-") && file.endsWith(".css")
    );
    if (cssFiles.length > 0) {
      const oldCssFile = resolve(assetsDir, cssFiles[0]);
      const newCssFile = resolve(assetsDir, "popup.css"); // Removing hash completely
      renameSync(oldCssFile, newCssFile);
      console.log(`3. Renamed ${cssFiles[0]} to popup.css`);
    } else {
      console.error("index-*.css not found, renaming skipped.");
    }

    // Update HTML file to reference the new filenames
    const htmlFile = resolve(outputDir, "popup.html");
    let htmlContent = readFileSync(htmlFile, "utf-8");

    // Chrome Extentions want "./path" not "/path" as Vite uses
    htmlContent = htmlContent
      .replace(/\/assets\/index-.*\.js/g, "./assets/popup.js")
      .replace(/\/assets\/index-.*\.css/g, "./assets/popup.css");

    writeFileSync(htmlFile, htmlContent, "utf-8");
    console.log("Updated HTML file to reference popup.js and popup.css");

    // Copy contents to extension/popup directory
    const extensionPopupDir = popupOutputPath;
    if (!existsSync(extensionPopupDir)) {
      mkdirSync(extensionPopupDir, { recursive: true });
    }

    readdirSync(outputDir).forEach((file) => {
      const srcPath = resolve(outputDir, file);
      const destPath = resolve(extensionPopupDir, file);

      if (file !== "assets") {
        copyFileSync(srcPath, destPath);
      } else {
        // Copy entire assets folder
        if (!existsSync(destPath)) {
          mkdirSync(destPath);
        }
        readdirSync(srcPath).forEach((assetFile) => {
          copyFileSync(
            resolve(srcPath, assetFile),
            resolve(destPath, assetFile)
          );
        });
      }
    });

    console.log(
      "Copied contents of dist directory to extension/popup directory"
    );
  },
};
