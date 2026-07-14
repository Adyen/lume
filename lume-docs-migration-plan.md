# Migration Plan: Automating Lume Component Documentation to Storybook MDX

This plan outlines the steps required to automate the migration of Lume's component documentation from static `README.md` files to interactive Storybook `.docs.mdx` files. It is structured so that an automated LLM/agent can execute it, while specifying the necessary manual verification steps for a human.

---

## Part 1: Automated Agent Migration Steps

An LLM agent can execute this part autonomously by writing and running the migration script, followed by Storybook config modifications.

### Step 1: Update Storybook Configurations
The agent must enable document rendering and include `.mdx` files in the Storybook story globs for both Vue 2 and Vue 3 wrappers.

#### 1.1 Vue 2 Storybook Config (`packages/lume/vue2/.storybook/main.ts`)
*   **Locate file**: `packages/lume/vue2/.storybook/main.ts`
*   **Modify `addons`**:
    *   Change `{ name: '@storybook/addon-essentials', options: { docs: false } }` to `'@storybook/addon-essentials'` (or set `docs: true`).
*   **Modify `stories`**:
    *   Update the glob patterns to match `.docs.mdx` files:
        ```typescript
        stories: [
          '../../lib/src/components/charts/**/*.@(stories|docs).@(ts|mdx)',
          '../../lib/src/components/core/**/*.@(stories|docs).@(ts|mdx)',
          '../../lib/src/playground/**/*.stories.@(ts)',
        ],
        ```

#### 1.2 Vue 3 Storybook Config (`packages/lume/vue3/.storybook/main.ts`)
*   **Locate file**: `packages/lume/vue3/.storybook/main.ts`
*   **Modify `addons`**:
    *   Change `{ name: '@storybook/addon-essentials', options: { docs: false } }` to `'@storybook/addon-essentials'`.
*   **Modify `stories`**:
    *   Update the glob patterns to match `.docs.mdx` files:
        ```typescript
        stories: [
          '../../lib/src/components/charts/**/*.@(stories|docs).@(ts|mdx)',
          '../../lib/src/components/core/**/*.@(stories|docs).@(ts|mdx)',
          '../../lib/src/playground/**/*.stories.@(ts)',
        ],
        ```

---

### Step 2: Run the Documentation Migration Script
The agent should create and run a migration script (e.g., `build/migrate-lume-docs.ts`) to automatically translate `README.md` files into Storybook `.docs.mdx` format.

#### Migration Script Specification (`build/migrate-lume-docs.ts`)
```typescript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LUME_COMPONENTS_DIR = path.resolve(__dirname, '../packages/lume/lib/src/components');

// Recursively find files matching a name in a directory
function findFiles(dir: string, fileName: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findFiles(filePath, fileName, fileList);
    } else if (file === fileName) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function runMigration() {
  console.log('Starting Lume documentation migration...');
  const readmes = findFiles(LUME_COMPONENTS_DIR, 'README.md');

  for (const readmePath of readmes) {
    const dir = path.dirname(readmePath);
    const componentDirName = path.basename(dir);

    // Skip utility/top-level READMEs
    if (['components', 'core', 'charts', 'groups'].includes(componentDirName)) {
      continue;
    }

    const parentDir = path.basename(path.dirname(dir));
    const isSubcomponent = parentDir === 'components';

    // Determine component name from directory
    const componentName = componentDirName;
    const storiesPath = path.join(dir, `${componentName}.stories.ts`);
    const mdxPath = path.join(dir, `${componentName}.docs.mdx`);

    const rawReadmeContent = fs.readFileSync(readmePath, 'utf-8');
    
    // Strip original top-level title (e.g., "# My Component") to prevent duplicate headers in MDX
    const cleanedReadmeContent = rawReadmeContent
      .replace(/^#\s+.+$/m, '')
      .trim();

    // Check if a companion stories file exists in the same directory
    if (fs.existsSync(storiesPath)) {
      const storiesContent = fs.readFileSync(storiesPath, 'utf-8');
      
      // Parse exported story names to find the primary story (Default, or first export)
      const storyMatches = [...storiesContent.matchAll(/export\s+const\s+(\w+)(:\s*\w+)?\s*=\s*{/g)];
      const exportedStories = storyMatches.map((m) => m[1]);
      
      const primaryStory = exportedStories.includes('Default') 
        ? 'Default' 
        : (exportedStories[0] || 'Default');

      const storyImportName = capitalize(kebabToCamel(componentName)) + 'Stories';

      // Assemble MDX with Storybook live preview linking to CSF story
      const mdxContent = `import { Canvas, Meta, Story } from '@storybook/blocks';
import * as ${storyImportName} from './${componentName}.stories';

<Meta of={${storyImportName}} />

# ${capitalize(componentName.replace(/-/g, ' '))}

<Canvas withSource="closed">
    <Story of={${storyImportName}.${primaryStory}} />
</Canvas>

${cleanedReadmeContent}
`;

      fs.writeFileSync(mdxPath, mdxContent);
      console.log(`[SUCCESS] Generated linked docs: ${mdxPath}`);
      
      // Remove original README
      fs.unlinkSync(readmePath);
    } else {
      // Standalone/unlinked documentation for subcomponents/helpers
      const category = dir.includes('/charts/') ? 'Charts' : (dir.includes('/core/') ? 'Core' : 'Groups');
      const readableTitle = capitalize(componentName.replace(/-/g, ' '));

      let mdxContent = '';
      if (isSubcomponent) {
        // If it's a subcomponent, nest it clearly under parent category
        const parentComponentDir = path.basename(path.dirname(path.dirname(dir)));
        const formattedParent = capitalize(parentComponentDir.replace(/-/g, ' '));
        mdxContent = `import { Meta } from '@storybook/blocks';

<Meta title="${category}/${formattedParent}/Subcomponents/${readableTitle}" />

# ${readableTitle}

${cleanedReadmeContent}
`;
      } else {
        mdxContent = `import { Meta } from '@storybook/blocks';

<Meta title="${category}/${readableTitle}" />

# ${readableTitle}

${cleanedReadmeContent}
`;
      }

      fs.writeFileSync(mdxPath, mdxContent);
      console.log(`[SUCCESS] Generated standalone docs: ${mdxPath}`);
      
      // Remove original README
      fs.unlinkSync(readmePath);
    }
  }
  
  console.log('Migration completed successfully!');
}

runMigration();
```

---

### Step 3: Run the Script and Validate
The agent must execute the script and run a sanity check build:
1.  **Execute script**: `pnpm ts-node build/migrate-lume-docs.ts` (or `pnpm tsx build/migrate-lume-docs.ts`).
2.  **Verify compilation**: Run TypeScript verification checks on Lume to ensure no compile errors are introduced.

---

## Part 2: Human Verification & Manual Steps

Once the automated script runs, a developer must perform manual verification and formatting adjustments.

### 1. Verification of the Live Storybook Environment
*   **Action**: Start the Storybook development server inside Lume Vue3 and Vue2:
    *   `pnpm --filter @adyen/lume-vue3 storybook`
    *   `pnpm --filter @adyen/lume-vue2 storybook`
*   **Verification Check**:
    *   Open Storybook in the browser.
    *   Navigate through the components inside **Charts**, **Core**, and **Groups**.
    *   Verify that each component now has a **Docs** tab alongside its story canvas.
    *   Confirm that the live playground renders correctly at the top of the docs page under `<Canvas>`.

### 2. Manual Grouping and Organization Refinements
*   **Check nested subcomponents**: Some components (like `lume-tooltip`) have multiple small helper subcomponents (`lume-tooltip-title`, `lume-tooltip-summary`, `lume-tooltip-item`) that the automation script turns into standalone docs.
*   **Human decision**:
    *   Review whether to keep them as separate list items in the Storybook menu or copy their simplified Markdown contents directly into `lume-tooltip.docs.mdx` under a `## Subcomponents` section. (Consolidation is generally preferred for a cleaner UI).

### 3. Syntax Verification inside MDX
*   **MDX Code Block issues**: Plain Markdown allows writing arbitrary HTML code snippets inside code fences (e.g. ` ```html `). Occasionally, the MDX compiler in Storybook 7+ might strictly parse tags inside standard markdown code blocks or try to evaluate JSX/HTML expressions in descriptions.
*   **Human Check**: Look for any rendering or parser errors in the Storybook dev console and fix any unmatched HTML tags in the converted documentation files.

### 4. Upgrade to Dynamic ArgTables / Controls (Optional)
*   The original README files have hardcoded HTML/Markdown tables for props and events.
*   **Action**: If the Storybook parser correctly picks up Vue's component typescript types, consider replacing static tables with:
    ```mdx
    ## API Reference

    <Controls />
    ```
    This turns static documentation tables into fully-interactive control panels.
