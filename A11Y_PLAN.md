# Lume Chart Library Accessibility (A11y) Remediation Plan

## Objective
Upgrade the Lume chart library (Vue 2 / Vue 3 / D3) to meet Web Content Accessibility Guidelines (WCAG) 2.1 AA standards. This involves adding proper ARIA semantics, enabling comprehensive keyboard navigation, exposing chart data to screen readers, and ensuring color/contrast compliance.

---

## Phase 1: Core SVG Semantics & Descriptions
**Goal**: Ensure screen readers recognize the chart as an image/graphic and can read a high-level summary of the data.

### Tasks
- [ ] **Update `packages/lib/src/components/core/lume-chart-container/lume-chart-container.vue`:**
  - Add `role="figure"` or `role="img"` to the root `<svg>` element.
  - Add a dynamic `aria-labelledby` attribute linking to the IDs of newly injected `<title>` and `<desc>` child elements.
  - Expose props for `chartTitle` and `chartDescription` to allow developers to pass accessible descriptions.
  - Render the `<title>` and `<desc>` elements inside the `<svg>` tag.

*Implementation Hint:*
```vue
<svg
  ref="root"
  role="img"
  :aria-labelledby="`${chartID}-title ${chartID}-desc`"
>
  <title :id="`${chartID}-title`">{{ chartTitle || 'Data Visualization' }}</title>
  <desc :id="`${chartID}-desc`">{{ chartDescription || 'A chart displaying data.' }}</desc>
  ...
```

---

## Phase 2: Accessible Legend (Keyboard & ARIA)
**Goal**: Make the legend operable by keyboard-only users and understandable by screen reader users.

### Tasks
- [ ] **Update `packages/lib/src/components/core/lume-chart-legend/lume-chart-legend.vue`:**
  - Add `role="button"` (or `role="switch"`) to each `.lume-chart-legend__item`.
  - Add `aria-pressed` (or `aria-checked`) to reflect the active/visible state of each dataset.
  - Bind `@keydown.enter.prevent` and `@keydown.space.prevent` to trigger the same data-toggling logic as the `@click` event.
  - Ensure `tabindex="0"` correctly places items in the natural document tab order.
- [ ] **Update `packages/lib/src/components/core/lume-chart-legend/styles.scss`:**
  - Add a highly visible `:focus-visible` outline to `.lume-chart-legend__item` so users can see which legend item is currently focused.

*Implementation Hint:*
```scss
&__item:focus-visible {
  outline: 2px solid $lume-color-royalblue-50;
  outline-offset: 4px;
  border-radius: 4px;
}
```

---

## Phase 3: Interactive Data Keyboard Navigation
**Goal**: Allow keyboard users to navigate individual data points (bars, line points, alluvial nodes) without relying on mouse hover.

### Tasks
- [ ] **Update `packages/lib/src/components/groups/lume-overlay-group/lume-overlay-group.vue`:**
  - This component currently intercepts mouseover events for tooltip/highlight behavior. Update it to also intercept keyboard events.
  - Give the overall SVG/container a `tabindex="0"` to enter "chart navigation mode".
  - Implement left/right Arrow key navigation to cycle through data indices. Update the internal "hovered/active index" programmatically on keydown.
- [ ] **Update node/link elements in `lume-alluvial-group.vue`:**
  - Apply keyboard navigation (arrow keys or roving `tabindex`) to nodes and links to allow users to trigger highlighting and custom events via keyboard.

---

## Phase 4: Screen Reader Support & Tooltips
**Goal**: Ensure visually impaired users have access to the exact data values presented in the tooltips.

### Tasks
- [ ] **Create an `aria-live` Announcer (Visually Hidden):**
  - Add a visually hidden `<div>` with `aria-live="polite"` inside `lume-chart.vue` or `lume-chart-container.vue`.
  - Whenever the active/hovered data point changes (via mouse hover or keyboard navigation implemented in Phase 3), update the text content of this `<div>` to read out the label and value (e.g., "Quarter 1: 15 Million").
- [ ] **Accessible Tooltip Component `lume-tooltip.vue`:**
  - Add `role="tooltip"` to the tooltip container.
- [ ] **(Optional but Highly Recommended) Implement a Sr-Only Data Table:**
  - Provide a prop (e.g., `withA11yTable`) in `lume-chart.vue`.
  - When true, render an HTML `<table>` visually hidden (`.lume-sr-only`) adjacent to the SVG containing the exact structured dataset. This is the gold standard for screen-reader chart consumption.

*Implementation Hint:*
```css
.lume-sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;
}
```

---

## Phase 5: Contrast & Visual Compliance
**Goal**: Fix color contrast ratios to meet WCAG 1.4.1 (Use of Color) and 1.4.11 (Non-text Contrast).

### Tasks
- [ ] **Review and Update `packages/lib/src/styles/variables/_colors.scss`:**
  - Audit the default categorical colors (`skyblue`, `violet`, `gold`, etc.) against a white and dark background.
  - Adjust the primary mapping to ensure graphical elements have at least a 3:1 contrast ratio against the chart background.
- [ ] **Add SVG Pattern Fills Support:**
  - Implement an option (e.g., `a11yPatterns: true`) to render distinct SVG patterns (stripes, dots, cross-hatch) alongside or instead of solid colors.
  - Apply these patterns to `lume-bar.vue` and `lume-chart-legend.vue` to ensure information is conveyed through means other than color alone.

---

## Testing & Verification
1. **Automated Testing:** Verify that `@storybook/addon-a11y` (currently installed in package.json) runs successfully against the updated Storybook components without violations.
2. **Keyboard Testing:** Unplug the mouse. Ensure you can tab into the chart legend, toggle datasets with Space/Enter, and use Arrow keys to navigate data points and trigger tooltips.
3. **Screen Reader Testing:** Use VoiceOver (macOS) or NVDA (Windows). Focus the chart to hear the `<title>` and `<desc>`. Navigate data points to hear the `aria-live` region announce individual values.
