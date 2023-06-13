import { existsSync } from 'fs';
import { appendFile, mkdir, readFile, rm, writeFile } from 'fs/promises';
import glob from 'glob';
import { compile } from 'sass';

const COMPONENT_STYLE_COMMENT = '\n/** Lume component styles */\n';

const VARIABLES_IMPORT_REGEX = /@use '@\/styles\/variables'/g;
const VARIABLES_RELATIVE_IMPORT = `@use '../variables'`;

const sassCompilerOptions = {
  style: 'compressed',
};

const getComponentSassFiles = () =>
  glob.sync('**/*.scss', {
    cwd: '../lib/src/components',
  });

const getFilename = (path) => {
  const splitPath = path.split('/');
  return splitPath.at(-1).replace(/styles/g, splitPath.at(-2));
};

async function run() {
  console.log('[lume] Running postbuild script...');

  try {
    // Compile main.scss to CSS
    const mainCompileResult = compile(
      '../lib/src/styles/main.scss',
      sassCompilerOptions
    );
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
      const filename = getFilename(file);

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
