import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

// .pathname でURLオブジェクトから直接パスの文字列（/Users/.../src）を取り出す
const srcPath = new URL("./src", import.meta.url).pathname;

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
});
