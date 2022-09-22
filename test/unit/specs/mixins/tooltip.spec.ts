import { mount } from '@vue/test-utils';
import { useTooltip, useTooltipAnchors } from '@/composables/tooltip';
import { ref } from 'vue';
import { data, xScale, yScale  } from '../mock-data';
import { Orientation } from "@/constants";

const orientation: Orientation = 'vertical';
const chartType = 'bar';

const getTooltipAnchorsMixin = (xScale, yScale, orientation) => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useTooltipAnchors(
        ref(data),
        ref(xScale),
        ref(yScale),
        ref(orientation),
        ref(chartType)
      );
      return mixin;
    },
  });

  return mixin;
}

const getTooltipMixin = () => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useTooltip();
      return mixin;
    }
  });

  return mixin;
}

describe('tooltip.ts', () => {
  describe('useTooltipAnchors', () => {
    test('should return expected object with orientation vertical', () => {
      const expected = { cy: 80, cx: 45.714285714285715 };
      const mixin = getTooltipAnchorsMixin(xScale, yScale, orientation);

      expect(mixin.getTooltipAnchorAttributes.value(0)).toEqual(expected);
      expect(mixin.getTooltipItems(0)[0]).toHaveProperty('value');
      expect(mixin.getTooltipItems(0)[0].value).toEqual(10);
    })

    test('should return expected object with orientation horizontal', () => {
      const expected = { cy: 45.714285714285715, cx: 80 };
      const mixin = getTooltipAnchorsMixin(yScale, xScale, 'horizontal');

      expect(mixin.getTooltipAnchorAttributes.value(0)).toEqual(expected);
    })
  });

  describe('useTooltip', () => {
    test('should instantiate expected object', () => {
      const mixin = getTooltipMixin();

      expect(mixin.tooltipConfig).toEqual({ opened: false, targetElement: null });
    })

    test('should toggle the state with showTooltip and hideTooltip methods', () => {
      const mixin = getTooltipMixin();
      const el = document.createElement('div');

      mixin.showTooltip(el);
      expect(mixin.tooltipConfig).toEqual({ opened: true, targetElement: el });
      mixin.hideTooltip();
      expect(mixin.tooltipConfig).toEqual({ opened: false, targetElement: null });
    })
  })
})