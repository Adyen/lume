import type { AxisOptions } from '@/types/options';

// Start alignment needs the widest label, so it falls back to end alignment until labels are measured
export function isTickStartAligned(
  options: AxisOptions,
  maxLabelWidth?: number
) {
  return options.tickAlign === 'start' && maxLabelWidth != null;
}
