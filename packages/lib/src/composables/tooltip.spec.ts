import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import { useTooltip, useTooltipAnchors, useTooltipItems } from './tooltip';

import { data, xScale, yScale } from '@test/unit/mock-data';

import { Orientation } from '@/utils/constants';
import { InternalData } from '@/types/dataset';

const orientation: Orientation = 'vertical';
const chartType = 'bar';

const getTooltipAnchorsMixin = (anchors, xScale, yScale, orientation) => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useTooltipAnchors(
        anchors,
        ref({}),
        ref(xScale),
        ref(yScale),
        ref(orientation),
        ref(data as InternalData),
        ref(chartType)
      );
      return mixin;
    },
  });

  return mixin;
};

const getTooltipMixin = () => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useTooltip();
      return mixin;
    },
  });

  return mixin;
};

describe('tooltip.ts', () => {
  describe('useTooltipAnchors', () => {
    test('should return expected object with orientation vertical', () => {
      const expected = { cy: 80, cx: 45.714285714285715 };
      const anchors = ref([]);
      const mixin = getTooltipAnchorsMixin(
        anchors,
        xScale,
        yScale,
        orientation
      );
      mixin.updateTooltipAnchorAttributes(data);

      expect(anchors.value[0]).toEqual(expected);
    });

    test('should return formatted tooltip items', () => {
      const { getTooltipItems } = useTooltipItems(ref(data));

      expect(getTooltipItems.value(0)[0]).toHaveProperty('value');
      expect(getTooltipItems.value(0)[0].value).toEqual(10);
    });

    test('should return expected object with orientation horizontal', () => {
      const expected = { cy: 45.714285714285715, cx: 80 };
      const anchors = ref([]);
      const mixin = getTooltipAnchorsMixin(
        anchors,
        yScale,
        xScale,
        'horizontal'
      );
      mixin.updateTooltipAnchorAttributes(data);

      expect(anchors.value[0]).toEqual(expected);
    });
  });

  describe('useTooltip', () => {
    test('should instantiate expected object', () => {
      const mixin = getTooltipMixin();

      expect(mixin.tooltipConfig).toEqual({
        opened: false,
        targetElement: null,
      });
    });

    test('should toggle the state with showTooltip and hideTooltip methods', () => {
      const mixin = getTooltipMixin();
      const el = document.createElement('div');

      mixin.showTooltip(el);
      expect(mixin.tooltipConfig).toEqual({ opened: true, targetElement: el });
      mixin.hideTooltip();
      expect(mixin.tooltipConfig).toEqual({
        opened: false,
        targetElement: null,
      });
    });
  });
});
