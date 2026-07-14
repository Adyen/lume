# Lume Numbers and Currency Localization Plan

This document outlines the steps required to align the Lume charting library (`packages/lume`) with Bento's standards for localized number and currency formatting.

**Scope:** Number and currency formatting ONLY.

---

## 🤖 Tasks for the LLM

The LLM should execute the following steps to implement locale-aware number and currency formatting.

### 1. Introduce D3 Formatting Locale Mapping
D3 formats numbers using `d3-format` (e.g., thousands separators `,` and decimal separators `.`). By default, it is fixed to US English. To localize this dynamically:
- [ ] **File:** Create `packages/lume/lib/src/utils/d3-locales.ts`
- [ ] **Action:** Define the D3 locale specification objects for Bento's 10 locales.
  - E.g., for `de-DE`: decimal is `,`, thousands is `.`, grouping is `[3]`.
  - For `fr-FR`: decimal is `,`, thousands is `\u202f` (narrow non-breaking space), grouping is `[3]`.
```typescript
import { formatLocale } from 'd3';

export const d3LocaleSpecs: Record<string, any> = {
  'en-US': { decimal: '.', thousands: ',', grouping: [3], currency: ['$', ''] },
  'en-GB': { decimal: '.', thousands: ',', grouping: [3], currency: ['£', ''] },
  'de-DE': { decimal: ',', thousands: '.', grouping: [3], currency: ['', ' €'] },
  'es-ES': { decimal: ',', thousands: '.', grouping: [3], currency: ['', ' €'] },
  'es-419': { decimal: '.', thousands: ',', grouping: [3], currency: ['$', ''] },
  'fr-FR': { decimal: ',', thousands: '\u202f', grouping: [3], currency: ['', ' \u20ac'] },
  'it-IT': { decimal: ',', thousands: '.', grouping: [3], currency: ['', ' €'] },
  'ja-JP': { decimal: '.', thousands: ',', grouping: [3], currency: ['¥', ''] },
  'pt-BR': { decimal: ',', thousands: '.', grouping: [3], currency: ['R$', ''] },
  'zh-CN': { decimal: '.', thousands: ',', grouping: [3], currency: ['¥', ''] },
};

export function getD3LocaleFormatter(locale: string) {
  const spec = d3LocaleSpecs[locale] || d3LocaleSpecs['en-US'];
  return formatLocale(spec);
}
```

### 2. Make Lume's `useFormat` Composable Locale-Aware
- [ ] **File:** `packages/lume/lib/src/composables/format.ts`
- [ ] **Action:**
  - Import `useI18n` from `@adyen/bento-vue-i18n-demi`.
  - Import `getD3LocaleFormatter` from `@/utils/d3-locales`.
  - Inside `useFormat`, fetch the active locale: `const { locale } = useI18n();`
  - Wrap the `d3Format` compilation so it uses the dynamic D3 locale formatter rather than the global, US-English-only `d3.format`:
```typescript
// Replacement logic within useFormat:
const d3Locale = getD3LocaleFormatter(locale.value);
formatter = d3Locale.format(format) as FormatFunction;
```
  - Ensure the formatter updates reactively whenever the active `locale` changes by watching `locale`.

### 3. Add Bento-Compliant Currency Formatting Support
Bento's currency format standard requires: `[localized number][non-breaking space][ISO code]` (e.g., `"1,234.56 EUR"` / `"1.234,56 EUR"`).
- [ ] **File:** `packages/lume/lib/src/composables/format.ts`
- [ ] **Action:**
  - Update `useFormat` to support native `Intl.NumberFormat` fallback if the custom format specifier indicates a currency layout (or add a specialized option `currencyCode` to the formatter context).
  - Provide a helper function that formats currency using `Intl.NumberFormat` aligned with the standard Bento spacing logic:
```typescript
function formatCurrencyBento(value: number, locale: string, currencyCode: string): string {
  const numberFormatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formattedNumber = numberFormatter.format(value);
  return `${formattedNumber}\u00A0${currencyCode}`; // nb-space followed by ISO code
}
```

---

## 👤 Tasks for the Human

The following verification steps must be completed by a human developer.

- [ ] **Verify Axis Separation:** Open the Storybook and check chart instances with large numerical values (e.g. `10000` or `1250.5`). Switch the Storybook locale to `de-DE` and verify that Y-axis labels change from `1,250.5` to `1.250,5` (German separator style).
- [ ] **Verify Currency Layout:** Confirm that currency amounts shown in tooltips use a non-breaking space (`\u00A0`) followed by the 3-letter currency code (e.g., `123,45 EUR` for French, instead of `€123.45` or `$123.45`).
- [ ] **Run Core Unit Tests:** Run `pnpm test` (or `vitest run`) on Lume libraries to ensure the newly introduced `useI18n` imports and `formatLocale` compiler logic do not break existing charts or snapshot tests. Update/mock `useI18n` in test suites where formatting is verified.