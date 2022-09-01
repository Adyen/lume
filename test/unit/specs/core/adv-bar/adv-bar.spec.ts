import { mount } from '@vue/test-utils';
import AdvBar from '@/core/adv-bar/adv-bar.vue';
import { nextTick } from 'vue';

const width = 100;
const height = 100;
const fillClass = 'my-class';
const transitionWidthClass = 'bar--transition-width';
const transitionHeightClass = 'bar--transition-height';
const negativeClass = 'bar--negative';
const fadeClass = 'bar--faded';

const defaultProps = {
  width,
  height,
  fillClass,
};

describe('bar.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(AdvBar, {
      propsData: defaultProps,
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.exists()).toBeTruthy();
    expect(el.attributes()['width']).toEqual(width.toString());
    expect(el.attributes()['height']).toEqual(width.toString());
    expect(el.attributes()['x']).toEqual('0');
    expect(el.attributes()['y']).toEqual('0');
    expect(el.classes().includes(fillClass)).toBeTruthy();
    expect(el.classes().includes(transitionHeightClass)).toBeFalsy();
    expect(el.classes().includes(fadeClass)).toBeFalsy();
  });

  test('mounts component and sets custom x and y prop values', () => {
    const x = 48;
    const y = 52;

    const wrapper = mount(AdvBar, {
      propsData: { ...defaultProps, x, y },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.attributes()['x']).toEqual(x.toString());
    expect(el.attributes()['y']).toEqual(y.toString());
  });

  test('mounts component and sets custom isFaded and animate prop values', () => {
    const wrapper = mount(AdvBar, {
      propsData: { ...defaultProps, isFaded: true, animate: false },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.classes().includes(transitionHeightClass)).toBeFalsy();
    expect(el.classes().includes(fadeClass)).toBeTruthy();
  });

  test('mounts with negative class when isNegative prop is true', () => {
    const wrapper = mount(AdvBar, {
      propsData: { ...defaultProps, isNegative: true },
    });

    const el = wrapper.find('[data-j-bar]');
    expect(el.classes().includes(negativeClass)).toBeTruthy();
  });

  test('mounts with transition class when transition prop is valid', async () => {
    const wrapper = mount(AdvBar, {
      propsData: { ...defaultProps, transition: 'height' },
    });

    const el = wrapper.find('[data-j-bar]');

    expect(el.classes().includes(transitionHeightClass)).toBeTruthy();

    wrapper.setProps({ transition: 'width' });

    await nextTick();

    expect(el.classes().includes(transitionWidthClass)).toBeTruthy();
  });
});
