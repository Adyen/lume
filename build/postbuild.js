import { existsSync } from 'fs';
import { appendFile, mkdir, readFile, rm, writeFile } from 'fs/promises';
import glob from 'glob';
import sass from 'sass';

import { resolve } from './util.js';

const COMPONENT_STYLE_COMMENT = '\n/** Lume component styles */\n';

const FILE_NAME_REGEX = /(charts|core|groups)\/|\/styles/g;

const VARIABLES_IMPORT_REGEX = /@use '@\/styles\/variables'/g;
const VARIABLES_RELATIVE_IMPORT = `@use '../variables'`;

const sassCompilerOptions = {
  style: 'compressed',
};

const getComponentSassFiles = () =>
  glob.sync('**/*.scss', {
    cwd: '../lib/src/components',
  });

async function run() {
  console.log('[lume] Running postbuild script...');

  try {
    // Compile main.scss to CSS
    const mainCompileResult = sass.compile(
      // resolve('src/styles/main.scss'),
      '../lib/src/styles/main.scss',
      sassCompilerOptions
    );
    // await writeFile(resolve('dist/styles/main.css'), mainCompileResult.css);
    await writeFile('dist/styles/main.css', mainCompileResult.css);

    // Append component styles to main.css
    await appendFile('dist/styles/main.css', COMPONENT_STYLE_COMMENT);
    await appendFile('dist/styles/main.css', await readFile('dist/style.css'));

    // Copy component styles into dist/scss/components and add @forward rules to main.scss
    // Make sure components directory is there
    if (!existsSync('dist/scss/components')) {
      await mkdir('dist/scss/components', { recursive: true });
    }

    await appendFile('dist/scss/main.scss', COMPONENT_STYLE_COMMENT);

    getComponentSassFiles().forEach(async (file) => {
      // Get new filename. Example: core/lume-axis/styles.scss -> lume-axis.scss
      const filename = file.replace(FILE_NAME_REGEX, '');

      // Read data and replace @use rules with relative path
      const data = await readFile(`../lib/src/components/${file}`, 'utf8');
      const replaced = data.replace(
        VARIABLES_IMPORT_REGEX,
        VARIABLES_RELATIVE_IMPORT
      );

      // Write the new file
      await writeFile(`dist/scss/components/${filename}`, replaced, 'utf-8');
      // Append @forward rule to main.scss
      await appendFile(
        'dist/scss/main.scss',
        `\n@forward 'components/${filename}';`
      );
    });

    // Remove font.scss (shouldn't be used in production)
    await rm('dist/scss/font.scss', { force: true });

    // Remove font.js (empty, leftover from webpack)
    await rm('dist/styles/font.js', { force: true });

    // Remove style.css (no use)
    await rm('dist/style.css', { force: true });
  } catch (error) {
    console.error('[lume]', error);
  }

  console.log('[lume] Postbuild script successful!');
}

run();
