# Lume String Translation Plan

This document outlines the steps required to integrate Bento's string translation (i18n) infrastructure into the Lume charting library (`packages/lume`). As Lume is purely data-driven, the scope of string translation is limited to the fallback UI text (e.g., "No data").

**Scope:** String translations ONLY (excludes number and date formatting).

## 🤖 Tasks for the LLM

The LLM should execute the following steps to implement the code changes.

### 1. Add Dependencies
- [ ] **File:** `packages/lume/lib/package.json`
- [ ] **Action:** Add `@adyen/bento-vue-i18n-demi` to the `dependencies` (or `devDependencies` depending on monorepo standards). Use the workspace protocol: `"@adyen/bento-vue-i18n-demi": "workspace:*"`.

### 2. Create the Translation Catalog
- [ ] **File:** Create `packages/lume/lib/src/messages.json`
- [ ] **Action:** Initialize the file with the baseline `noData` string for the supported locales.
```json
{
  "de-DE": { "noData": "No data" },
  "en-GB": { "noData": "No data" },
  "en-US": { "noData": "No data" },
  "es-419": { "noData": "No data" },
  "es-ES": { "noData": "No data" },
  "fr-FR": { "noData": "No data" },
  "it-IT": { "noData": "No data" },
  "ja-JP": { "noData": "No data" },
  "pt-BR": { "noData": "No data" },
  "zh-CN": { "noData": "No data" }
}
```
*(Note: Smartling will replace the English fallbacks with actual translations later.)*

### 3. Update the Global Constants
- [ ] **File:** `packages/lume/lib/src/utils/constants.ts`
- [ ] **Action:** Remove or deprecate the hardcoded `export const NO_DATA = 'No data';` to ensure it is no longer used to render UI text.

### 4. Implement `useI18n` in Tooltips
- [ ] **File:** `packages/lume/lib/src/composables/tooltip.ts`
- [ ] **Action:** 
  - Import `useI18n` from `@adyen/bento-vue-i18n-demi`.
  - Import `messages` from `../messages.json`.
  - Inside the `useTooltipItems` composable, initialize the translation hook: `const { t } = useI18n({ messages });`
  - Replace the fallback `NO_DATA` reference with `t('noData')` within the `getTooltipItems` computed property.

### 5. Implement `useI18n` in Line Null Values
- [ ] **File:** `packages/lume/lib/src/composables/line-null-values.ts`
- [ ] **Action:**
  - Import `useI18n` from `@adyen/bento-vue-i18n-demi`.
  - Import `messages` from `../messages.json`.
  - Initialize `const { t } = useI18n({ messages });` where appropriate.
  - Replace instances of `NO_DATA` with `t('noData')`.

### 6. Register Lume in the Workspace Translation Config
- [ ] **File:** `.i18nrc` (Workspace Root)
- [ ] **Action:** Add `"packages/lume/lib/src/messages.json"` to the `translationSourcePaths` array. Keep the array sorted alphabetically if it currently is.

---

## 👤 Tasks for the Human

The following steps require human intervention or external CI/CD systems and should not be attempted by the LLM.

- [ ] **Verify Component Rendering:** Spin up the storybook (`pnpm run storybook` in `packages/lume/vue3` or `vue2`) and verify that charts with empty data or missing line segments render the fallback text without throwing Vue reactivity or import errors.
- [ ] **Run Translation Collection Script:** From the workspace root, run the translation collection script (e.g., `pnpm run collect-translation-files` or similar) to ensure the `.i18nrc` configuration successfully parses Lume's new `messages.json` file.
- [ ] **Trigger Smartling Sync:** Push the branch and trigger the CI pipeline (`translations-upload.yml` / `translations-download.yml`) to upload the keys to Smartling so the localization team can provide native translations for "No data".
- [ ] **Code Review & Merge:** Review the PR to ensure the dual Vue 2/Vue 3 compatibility provided by `bento-vue-i18n-demi` works smoothly inside the Lume core package.