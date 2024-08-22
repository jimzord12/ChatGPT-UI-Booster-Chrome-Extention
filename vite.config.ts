import { defineConfig } from "vite";
import { chromeExtPlugin } from "./vite_plugins/custom-chrome-ext-plugin";

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      // Rollup options here if needed
      
    },
  },
  plugins: [chromeExtPlugin],
});
