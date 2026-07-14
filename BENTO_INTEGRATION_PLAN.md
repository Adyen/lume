# Full Integration Plan: Bento Design Tokens in Lume

This plan outlines the steps required to replace Lume's local spacing, border, typography, and color configurations with Bento's design tokens without any local fallbacks.

---

## Part 1: Human Action Items (Prerequisites in Bento)

Because Lume has specific chart-related needs (ultra-small text, granular neutral shades, and extensive categorical/sequential chart palettes) that do not exist in the public Bento design tokens, a human must perform the following additions in the `@adyen/bento-design-tokens` package:

### Step 1.1: Add `xs` Typography Definitions and Aliases
Bento's public scale begins at `12px` (level `100`), but Lume uses `10px` for chart ticks.
1. In `/tokens/bento/base/definitions/_font.yaml`, add the `"050"` scale value for both `size` and `line-height`:
   ```yaml
   font:
     size:
       "050":
         value: "10px"
   line-height:
     "050":
       value: "16px"
   ```
2. In `/tokens/bento/base/aliases/text.yaml`, create public aliases mapping `050` to CSS custom properties:
   ```yaml
   font-size-xs:
     value: "{font.size.050}"
   line-height-xs:
     value: "{line-height.050}"
   ```

### Step 1.2: Add Missing Neutral/Grey Aliases
Lume requires specific shades of dark grey that are private in Bento (e.g., `color.grey.2200`).
1. In `/tokens/bento/base/aliases/color.yaml`, add a specific public alias for the missing chart neutral shade:
   ```yaml
   chart:
     neutral:
       80:
         value: "{color.grey.2200}"
   ```

### Step 1.3: Add Chart Color Palettes (Categorical & Sequential)
Lume requires 5 custom chart palettes (Skyblue, Royalblue, Violet, Darkteal, Gold) with 10 shades each (10-100).
1. **Create Definitions:** In `/tokens/bento/base/definitions/chart-colors.yaml`, define the raw hex values for:
   - `chart.skyblue.10` through `chart.skyblue.100`
   - `chart.royalblue.10` through `chart.royalblue.100`
   - `chart.violet.10` through `chart.violet.100`
   - `chart.darkteal.10` through `chart.darkteal.100`
   - `chart.gold.10` through `chart.gold.100`
2. **Create Aliases:** In `/tokens/bento/base/aliases/color.yaml` (or a dedicated `chart.yaml` alias file), expose these as public aliases so they generate variables like `--b-color-chart-skyblue-10`.

### Step 1.4: Build & Publish the updated Bento package
- Run the build command inside `/Users/daver/workspace/bento/packages/design-tokens`.
- Link (`pnpm link`) or publish the updated `@adyen/bento-design-tokens` package so Lume can consume the newly generated CSS custom properties.

---

## Part 2: Assistant (LLM) Action Items in Lume

*Note to LLM: Do not perform these changes until the human confirms the prerequisites in Part 1 are complete.*

### Step 2.1: Map Typography Variables
**File:** `packages/lib/src/styles/variables/_typography.scss`
Replace file contents with:
```scss
// Font family
$lume-font-family: var(--b-font-family-primary) !default;

// Size
$lume-font-size-xs: var(--b-font-size-xs) !default;       // 10px (From Step 1.1)
$lume-font-size-sm: var(--b-font-size-100) !default;      // 12px
$lume-font-size-md: var(--b-font-size-200) !default;      // 14px
$lume-font-size-lg: var(--b-font-size-500) !default;      // 20px

// Line height
$lume-line-height-xs: var(--b-line-height-xs) !default;   // 16px (From Step 1.1)
$lume-line-height-sm: var(--b-line-height-100) !default;  // 18px
$lume-line-height-md: var(--b-line-height-200) !default;  // 20px
$lume-line-height-lg: var(--b-line-height-600) !default;  // 30px

// Weight
$lume-font-weight-regular: var(--b-font-weight-400) !default;
$lume-font-weight-medium: var(--b-font-weight-500) !default;
$lume-font-weight-semi-bold: var(--b-font-weight-600) !default;
```

### Step 2.2: Map Spacing Variables
**File:** `packages/lib/src/styles/variables/_spacing.scss`
Replace file contents with:
```scss
$lume-spacing-4: var(--b-spacer-020) !default;
$lume-spacing-6: var(--b-spacer-030) !default;
$lume-spacing-8: var(--b-spacer-040) !default;
$lume-spacing-10: var(--b-spacer-050) !default;
$lume-spacing-12: var(--b-spacer-060) !default;
$lume-spacing-16: var(--b-spacer-070) !default;
$lume-spacing-24: var(--b-spacer-090) !default;
$lume-spacing-32: var(--b-spacer-100) !default;
```

### Step 2.3: Map Border & Radius Variables
**File:** `packages/lib/src/styles/_variables.scss`
Update the border and box-shadow variables to:
```scss
// Border
$lume-border-width: var(--b-border-width-s) !default;
$lume-border-style: solid !default;
$lume-border-color: var(--b-color-outline-primary) !default;
$lume-border-radius-4: var(--b-border-radius-s) !default;
$lume-border-radius-8: var(--b-border-radius-m) !default;
$lume-border: $lume-border-width $lume-border-style $lume-border-color !default;

// Box-shadow
$lume-box-shadow: var(--b-shadow-medium) !default; // Alternatively, var(--b-shadow-medium-border)
```

### Step 2.4: Map Color Variables
**File:** `packages/lib/src/styles/variables/_colors.scss`
Replace Lume's hardcoded colors with Bento CSS Custom Properties. 

*Example mapping for Neutrals & Status colors:*
```scss
// Base & Neutrals
$lume-color-white: var(--b-color-background-primary) !default; // or var(--b-color-label-on-color)
$lume-color-black: var(--b-color-label-primary) !default;

$lume-color-neutral-10: var(--b-color-background-secondary) !default;
$lume-color-neutral-20: var(--b-color-background-tertiary) !default;
$lume-color-neutral-40: var(--b-color-outline-primary) !default;
$lume-color-neutral-60: var(--b-color-label-tertiary) !default;
$lume-color-neutral-80: var(--b-color-label-secondary) !default;
$lume-color-neutral-100: var(--b-color-label-primary) !default;

// Greys
$lume-color-grey-10: var(--b-color-background-secondary) !default;
$lume-color-grey-20: var(--b-color-background-tertiary) !default;
$lume-color-grey-30: var(--b-color-outline-primary) !default;
$lume-color-grey-40: var(--b-color-background-quaternary) !default;
$lume-color-grey-50: var(--b-color-label-inverse-secondary) !default;
$lume-color-grey-60: var(--b-color-outline-tertiary) !default;
$lume-color-grey-70: var(--b-color-label-secondary) !default;
$lume-color-grey-80: var(--b-color-chart-neutral-80) !default; // From Step 1.2
$lume-color-grey-90: var(--b-color-background-always-dark-secondary) !default;
$lume-color-grey-100: var(--b-color-label-primary) !default;

$lume-color-grey-transparent: rgba(210, 218, 225, 0.7) !default; // Retain or adjust

// Status Colors
$lume-color-green: var(--b-color-decorative-green) !default;
$lume-color-orange: var(--b-color-decorative-orange) !default;
$lume-color-red: var(--b-color-decorative-red) !default;
```

*Example mapping for Chart Palettes (Once Step 1.3 is complete):*
```scss
// Sky blue
$lume-color-skyblue-10: var(--b-color-chart-skyblue-10) !default;
// ... mapping 10 through 100 for all palettes (skyblue, royalblue, violet, darkteal, gold)
```

---

## Part 3: Validation & Verification (LLM + Human)

1. **Verify Build Process:**
   - Execute the workspace compile or build script (e.g., `pnpm run build` or `npm run build` inside `packages/lib`) to verify that the updated SASS/SCSS styles compile cleanly without variable resolution errors.
2. **Verify Storybook:**
   - Run Lume's Storybook (e.g., `npm run storybook`).
   - Inspect multiple chart types (Bar, Line, Alluvial).
   - Ensure the layouts (padding, margins, gaps) align with Bento's spacing tokens.
   - Ensure tooltips have the correct border-radius, shadows, and text formatting.
   - Verify that all CSS variables resolve correctly in the browser DOM and that no fallback colors/fonts are mistakenly applied.
