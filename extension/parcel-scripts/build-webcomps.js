import { exec } from "child_process";
import { basename, join } from "path";
import { mkdirSync, readdir, stat } from "fs";

// Define the source and output directories
const srcDir = "extension/content/web-components";
const distDir = "extension/dist/content/web-components";
console.log("Source directory: ", srcDir);

// Function to bundle a single file using Parcel
function bundleComponent(componentPath) {
  console.log("Bundling component: ", componentPath);

  const componentName = basename(componentPath, ".ts");
  const outputDir = join(distDir, componentName);

  // Ensure the output directory exists
  mkdirSync(outputDir, { recursive: true });

  // Parcel build command for the current component
  const parcelCommand = `parcel build ${componentPath} --dist-dir ${outputDir} --no-source-maps`;

  // Execute the Parcel command
  exec(parcelCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error bundling ${componentPath}: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Parcel stderr for ${componentPath}: ${stderr}`);
    }
    console.log(`Bundled ${componentPath} to ${outputDir}`);
  });
}

// Function to recursively read .ts files in a directory
function readTsFiles(dir) {
  readdir(dir, (err, items) => {
    if (err) {
      console.error(`Error reading directory ${dir}: ${err.message}`);
      return;
    }

    items.forEach((item) => {
      const itemPath = join(dir, item);

      // Check if the item is a directory or a file
      stat(itemPath, (err, stats) => {
        if (err) {
          console.error(`Error reading stats of ${itemPath}: ${err.message}`);
          return;
        }

        if (stats.isDirectory()) {
          // Recursively read subdirectory
          readTsFiles(itemPath);
        } else if (item.endsWith(".ts")) {
          // Bundle the TypeScript file
          bundleComponent(itemPath);
          console.log("[SUCCESS] - Web Component built successfully");
        }
      });
    });
  });
}

// Start reading from the source directory
console.log("Reading source directory...");
readTsFiles(srcDir);
