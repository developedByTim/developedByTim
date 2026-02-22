import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    host: true,          // ← or explicitly '0.0.0.0'
    // port: 4321        // optional – Railway ignores this anyway
  },
  integrations: [react(), tailwind()]
});