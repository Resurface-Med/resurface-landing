// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  build: {
    // Inline page CSS into the HTML so a missed /_astro/*.css fetch
    // (or a mid-deploy hash mismatch) cannot leave the site unstyled.
    inlineStylesheets: "always",
  },
});
