import { readdir, readFile } from 'node:fs/promises';
import { dirname, posix, relative, resolve } from 'node:path';
import * as sass from 'sass';
import type { Plugin, ResolvedConfig } from 'vite';

const COMPONENT_STYLE_COMMENT = '\n/** Lume component styles */\n';
const VARIABLES_IMPORT_REGEX = /@use '@\/styles\/variables'/g;
const VARIABLES_RELATIVE_IMPORT = `@use '../variables'`;
const FONT_URL_REGEX = /url\((['"]?)([^)'"]+\.(woff2?))\1\)/g;

const FONT_MIME_TYPES: Record<string, string> = {
  woff: 'font/woff',
  woff2: 'font/woff2',
};

async function collectFiles(
  dir: string,
  extension?: string
): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, extension)));
    } else if (!extension || entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function getComponentStyleFilename(relativePath: string): string {
  const parts = relativePath.split('/');
  const filename = parts.at(-1)!;
  const parentDir = parts.at(-2)!;
  return filename.replace(/styles/g, parentDir);
}

async function inlineFontUrls(
  css: string,
  fontScssDir: string
): Promise<string> {
  const matches = [...css.matchAll(FONT_URL_REGEX)];
  let result = css;

  for (const match of matches) {
    const [fullMatch, , relativeUrl, ext] = match;
    const fontPath = resolve(fontScssDir, relativeUrl);
    const base64 = (await readFile(fontPath)).toString('base64');
    const mimeType = FONT_MIME_TYPES[ext];
    result = result.replace(
      fullMatch,
      `url(data:${mimeType};base64,${base64})`
    );
  }

  return result;
}

export function lumeStylesPlugin(libSrcDir: string): Plugin {
  let resolvedConfig: ResolvedConfig;

  return {
    name: 'lume-styles',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      resolvedConfig = config;
    },
    async generateBundle(_options, bundle) {
      if (!resolvedConfig.build.lib) {
        return;
      }

      const stylesDir = resolve(libSrcDir, 'styles');
      const componentsDir = resolve(libSrcDir, 'components');

      // Extract Vite's compiled component CSS and remove the stray root CSS file.
      let componentCss = '';
      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type === 'asset' && fileName.endsWith('.css')) {
          componentCss =
            typeof output.source === 'string'
              ? output.source
              : Buffer.from(output.source).toString('utf8');
          delete bundle[fileName];
          break;
        }
      }

      if (!componentCss) {
        throw new Error(
          '[lume-styles] Expected Vite to emit component CSS before lume-styles generateBundle.'
        );
      }

      // 1. Compile global Sass + append component styles -> dist/styles/main.css
      const mainScssPath = resolve(stylesDir, 'main.scss');
      const mainCompiled = sass.compile(mainScssPath, { style: 'compressed' });
      this.emitFile({
        type: 'asset',
        fileName: 'styles/main.css',
        source: `${mainCompiled.css}${COMPONENT_STYLE_COMMENT}${componentCss}`,
      });

      // 2. Compile Inter font Sass with base64-inlined woff/woff2 -> dist/styles/font.css
      const fontScssPath = resolve(stylesDir, 'font.scss');
      const fontCompiled = sass.compile(fontScssPath, { style: 'compressed' });
      const inlinedFontCss = await inlineFontUrls(
        fontCompiled.css,
        dirname(fontScssPath)
      );
      this.emitFile({
        type: 'asset',
        fileName: 'styles/font.css',
        source: inlinedFontCss,
      });

      // 3. Stage Sass sources under dist/scss/ (excluding font.scss) + component Sass files
      const styleFiles = await collectFiles(stylesDir, '.scss');
      let mainScssSource = '';

      for (const filePath of styleFiles) {
        const rel = relative(stylesDir, filePath).split('\\').join('/');
        if (rel === 'font.scss') {
          continue;
        }
        const content = await readFile(filePath, 'utf8');
        if (rel === 'main.scss') {
          mainScssSource = content;
          continue;
        }
        this.emitFile({
          type: 'asset',
          fileName: posix.join('scss', rel),
          source: content,
        });
      }

      const componentStyleFiles = await collectFiles(componentsDir, '.scss');
      const componentForwards: string[] = [];

      for (const filePath of componentStyleFiles) {
        const rel = relative(componentsDir, filePath).split('\\').join('/');
        const filename = getComponentStyleFilename(rel);
        const content = await readFile(filePath, 'utf8');
        const rewritten = content.replace(
          VARIABLES_IMPORT_REGEX,
          VARIABLES_RELATIVE_IMPORT
        );

        this.emitFile({
          type: 'asset',
          fileName: posix.join('scss', 'components', filename),
          source: rewritten,
        });
        componentForwards.push(`@forward 'components/${filename}';`);
      }

      componentForwards.sort();
      const finalMainScss = `${mainScssSource}${COMPONENT_STYLE_COMMENT}\n${componentForwards.join(
        '\n'
      )}`;
      this.emitFile({
        type: 'asset',
        fileName: 'scss/main.scss',
        source: finalMainScss,
      });
    },
  };
}
