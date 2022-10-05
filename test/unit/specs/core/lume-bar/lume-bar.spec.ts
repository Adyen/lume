import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';

import LumeBar from '@/components/core/lume-bar/lume-bar.vue';

const width = 100;
const height = 100;
const classList = 'my-class';
const transitionWidthClass = 'lume-bar--transition-width';
const transitionHeightClass = 'lume-bar--transition-height';
const negativeClass = 'lume-bar--negative';
const fadeClass = 'lume-fill--faded';

const defaultProps = {
  width,
  height,
  classList,
};

describe('lume-bar.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeBar, {
      propsData: defaultProps,
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.exists()).toBeTruthy();
    expect(el.attributes()['width']).toEqual(width.toString());
    expect(el.attributes()['height']).toEqual(width.toString());
    expect(el.attributes()['x']).toEqual('0');
    expect(el.attributes()['y']).toEqual('0');
    expect(el.classes().includes(classList)).toBeTruthy();
    expect(el.classes().includes(transitionHeightClass)).toBeFalsy();
    expect(el.classes().includes(fadeClass)).toBeFalsy();
  });

  test('mounts component and sets custom x and y prop values', () => {
    const x = 48;
    const y = 52;

    const wrapper = mount(LumeBar, {
      propsData: { ...defaultProps, x, y },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.attributes()['x']).toEqual(x.toString());
    expect(el.attributes()['y']).toEqual(y.toString());
  });

  test('mounts component and sets custom width and height prop values', () => {
    const width = 0.7;
    const height = 0.7;

    const wrapper = mount(LumeBar, {
      propsData: { ...defaultProps, width, height },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.attributes()['width']).toEqual('1');
    expect(el.attributes()['height']).toEqual('1');
  });

  test('mounts component and sets custom isFaded and animate prop values', () => {
    const wrapper = mount(LumeBar, {
      propsData: { ...defaultProps, isFaded: true, transition: false },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.classes().includes(transitionHeightClass)).toBeFalsy();
    expect(el.classes().includes(fadeClass)).toBeTruthy();
  });

  test('mounts with negative class when isNegative prop is true', () => {
    const wrapper = mount(LumeBar, {
      propsData: { ...defaultProps, isNegative: true },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.classes().includes(negativeClass)).toBeTruthy();
  });

  test('mounts with transition class when transition prop is valid', async () => {
    const wrapper = mount(LumeBar, {
      propsData: { ...defaultProps, transition: 'height' },
    });

    const el = wrapper.find('[data-j-bar]');

    expect(el.classes().includes(transitionHeightClass)).toBeTruthy();

    wrapper.setProps({ transition: 'width' });

    await nextTick();

    expect(el.classes().includes(transitionWidthClass)).toBeTruthy();
  });
});
