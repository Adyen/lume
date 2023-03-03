import { mount } from '@vue/test-utils';

import LumeLine from './lume-line.vue';

import { getLinePathDefinition } from '@/composables/line-values';

import { data, xScale, yScale } from '@test/unit/mock-data';

const pathDefinition = getLinePathDefinition(
  1,
  [data[0].values[0].value, data[0].values[1].value],
  xScale,
  yScale
);

const props = { pathDefinition: pathDefinition.value, xScale };

describe('chart-container.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(LumeLine, { props });

    const el = wrapper.find('[data-j-line]');
    expect(el.exists()).toBeTruthy();
    expect(el.classes().includes('lume-line--dashed')).toBe(false);
  });

  test('mounts component and sets dashed line to true', () => {
    const wrapper = mount(LumeLine, {
      props: { ...props, dashed: true },
    });

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes('lume-line--dashed')).toBe(true);
    expect(el.classes().includes(`lume-stroke--skyblue`)).toBe(true);
  });

  test('mounts component with custom color', () => {
    const color = '02';
    const wrapper = mount(LumeLine, { props: { ...props, color } });

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes(`lume-stroke--${color}`)).toBe(true);
  });
});
