import type { InternalMargins, Margins } from '../types/utils';

const DEFAULT_MARGIN_TOP = 16;
const DEFAULT_MARGIN_RIGHT = 8;
const DEFAULT_MARGIN_BOTTOM = 28;
const DEFAULT_MARGIN_LEFT = 24;

export const DEFAULT_MARGINS = {
    VERTICAL: {
        top: DEFAULT_MARGIN_TOP,
        right: DEFAULT_MARGIN_RIGHT,
        bottom: DEFAULT_MARGIN_BOTTOM,
        left: DEFAULT_MARGIN_LEFT,
    } as InternalMargins,
    HORIZONTAL: {
        top: DEFAULT_MARGIN_TOP,
        right: DEFAULT_MARGIN_RIGHT,
        bottom: DEFAULT_MARGIN_BOTTOM,
        left: DEFAULT_MARGIN_LEFT,
    } as InternalMargins,
};

export function calculateMarginTop(baseMargins?: Margins) {
    if (!baseMargins || baseMargins === 'auto' || baseMargins.top == null || baseMargins.top === 'auto') {
        return DEFAULT_MARGIN_TOP;
    }
    return baseMargins.top;
}

export function calculateMarginRight(baseMargins?: Margins, axisOverflow?: number) {
    if (!baseMargins || baseMargins === 'auto' || baseMargins.right == null || baseMargins.right === 'auto') {
        return Math.max(DEFAULT_MARGIN_RIGHT, axisOverflow || 0);
    }
    return baseMargins.right;
}

export function calculateMarginBottom(baseMargins?: Margins, axisSize?: number) {
    if (!baseMargins || baseMargins === 'auto' || baseMargins.bottom == null || baseMargins.bottom === 'auto') {
        return axisSize || DEFAULT_MARGIN_BOTTOM;
    }
    return baseMargins.bottom;
}

export function calculateMarginLeft(baseMargins?: Margins, axisSize?: number) {
    if (!baseMargins || baseMargins === 'auto' || baseMargins.left == null || baseMargins.left === 'auto') {
        return axisSize || DEFAULT_MARGIN_LEFT;
    }
    return baseMargins.left;
}
