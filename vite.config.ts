import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const root = import.meta.dirname;

/**
 * Minimal HTML partial includes: replaces `<!--@include:name-->` with the
 * contents of `src/partials/name.html`. Keeps markup that must live in raw
 * HTML (e.g. the anti-FOUC loader, which needs to paint before any module
 * script runs) in a single source file instead of duplicated per page.
 */
function htmlIncludes(): Plugin {
  const includePattern = /<!--\s*@include:([\w-]+)\s*-->/g;

  return {
    name: 'html-includes',
    transformIndexHtml(html) {
      return html.replace(includePattern, (_match, name: string) =>
        readFileSync(resolve(root, `src/partials/${name}.html`), 'utf-8')
      );
    },
  };
}

export default defineConfig({
  plugins: [htmlIncludes()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        about: resolve(root, 'about.html'),
        loveStories: resolve(root, 'love-stories.html'),
        films: resolve(root, 'films.html'),
        investment: resolve(root, 'investment.html'),
        contact: resolve(root, 'contact.html'),
      },
    },
  },
});
