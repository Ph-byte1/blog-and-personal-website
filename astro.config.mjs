import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkEmoji from 'remark-emoji';
import tailwindcss from "@tailwindcss/vite";

import expressiveCode from "astro-expressive-code";

import cloudflare from '@astrojs/cloudflare';

const site =
  process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "https://flipthedata.site";

export default defineConfig({
  site,

  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark-dimmed'],
      // Bind the active theme to the same `.dark` class that the site uses
      // for its own light/dark mode toggle instead of using the browser media query.
      themeCssRoot: 'html',
      themeCssSelector: (theme) => (theme.type === 'dark' ? '.dark' : '.light'),
      useDarkModeMediaQuery: false,
      shiki: {
        langAlias: {
          env: 'dotenv',
        },
      },
      styleOverrides: {
        borderRadius: '0.5rem',
        codeFontFamily:
          "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        codeFontSize: '0.875rem',
        frames: {
          shadowColor: 'transparent',
        },
      },
    }), mdx({
    remarkPlugins: [remarkEmoji],
  }),
  ],

  markdown: {
    remarkPlugins: [remarkEmoji],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});