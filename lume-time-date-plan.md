# Lume Time and Date Localization Plan

This document outlines the steps required to align the Lume charting library (`packages/lume`) with Bento's standards for localized time and date formatting.

**Scope:** Time and date formatting ONLY.

---

## 🤖 Tasks for the LLM

The LLM should execute the following steps to implement locale-aware time and date formatting.

### 1. Introduce D3 Time Formatting Locale Mapping
By default, D3's time formatting (such as axis tick marks for dates like "Jan", "Feb", "Monday") is fixed to US English. To localize this dynamically:
- [ ] **File:** Create `packages/lume/lib/src/utils/d3-time-locales.ts`
- [ ] **Action:** Define the `d3-time-format` locale specifications for Bento's 10 locales. This includes localized month names, short month names, day names, and short day names.
```typescript
import { timeFormatLocale } from 'd3';

export const d3TimeLocaleSpecs: Record<string, any> = {
  'en-US': {
    dateTime: '%x, %X',
    date: '%-m/%-d/%Y',
    time: '%-I:%M:%S %p',
    periods: ['AM', 'PM'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  'de-DE': {
    dateTime: '%A, der %e. %B %Y, %T',
    date: '%d.%m.%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    shortMonths: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
  },
  // Add matching spec definitions for: es-ES, es-419, fr-FR, it-IT, ja-JP, pt-BR, zh-CN, en-GB
};

export function getD3TimeLocaleFormatter(locale: string) {
  const spec = d3TimeLocaleSpecs[locale] || d3TimeLocaleSpecs['en-US'];
  return timeFormatLocale(spec);
}
```

### 2. Make `useFormat` Date-Aware
- [ ] **File:** `packages/lume/lib/src/composables/format.ts`
- [ ] **Action:**
  - Import `getD3TimeLocaleFormatter` from `@/utils/d3-time-locales`.
  - Update Lume's `useFormat` composable to detect if the target formatter is a D3 time format specifier, or if the value to format is an instance of a `Date` object.
  - If a time/date format is needed, compile it using the localized `timeFormatLocale` instead of the standard d3 package:
```typescript
const d3TimeLocale = getD3TimeLocaleFormatter(locale.value);
formatter = d3TimeLocale.format(format) as FormatFunction;
```

### 3. Replace Hardcoded Playgrounds and Demos
- [ ] **File:** `packages/lume/lib/src/playground/scale-time.vue`
- [ ] **Action:**
  - Import `useI18n` from `@adyen/bento-vue-i18n-demi`.
  - Inside `setup()`, resolve `const { locale } = useI18n();`.
  - Replace the hardcoded `'en-US'` locale string in the label rendering template with the reactive active locale:
```html
<!-- From -->
{{ tick.toLocaleString('en-US', { day: 'numeric', month: 'short' }) }}

<!-- To -->
{{ tick.toLocaleString(locale, { day: 'numeric', month: 'short' }) }}
```

### 4. Support Caching `Intl.DateTimeFormat`
- [ ] **File:** `packages/lume/lib/src/composables/format.ts`
- [ ] **Action:**
  - Integrate a small caching wrapper or import Bento's standard caching `getDateTimeFormatter` to format tooltip titles and axes ticks when values are `Date` objects and D3 specifiers are not passed, ensuring high-performance rendering.

---

## 👤 Tasks for the Human

The following verification steps must be completed by a human developer.

- [ ] **Verify Time Axis Labels:** Spin up Lume Storybook (`scale-time.stories.ts` or other time charts). Switch the active language to German (`de-DE`) or Japanese (`ja-JP`) and verify that axis tick marks show translated short month and weekday labels (e.g., "Jan", "Feb" -> "Jan", "Feb" for DE, and "1月", "2月" for JP).
- [ ] **Check Tooltip Timestamps:** Hover over dates in a line chart and verify that tooltip headers/timestamps update formatting to match localized standards (e.g. `DD/MM/YYYY` vs `MM/DD/YYYY`).
- [ ] **Perform Snapshot Testing:** Run `pnpm test` to check if changing default formatting affects chart SVG snapshots, and update any snapshots where the date rendering formats have changed due to the correct localization defaults.