import { warn, Warnings } from './warnings';

/**
 * Checks whether an element is contained inside an <svg> element.
 * @param el A DOM element.
 * @returns True if it is wrapped by an <svg> element.
 */
export function svgCheck(el: Element) {
  if (!el?.closest('svg')) warn(Warnings.NotContainedInSvg);
}
