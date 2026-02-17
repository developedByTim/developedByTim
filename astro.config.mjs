import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';

export default defineConfig({
  output: 'server', // enable dynamic routes
  adapter: node(),  // Node adapter required for SSR
  integrations: [react(), tailwind()],
  server: {
    host: true, // required for Railway to bind to 0.0.0.0
    port: Number(process.env.PORT) || 3000
  }
});