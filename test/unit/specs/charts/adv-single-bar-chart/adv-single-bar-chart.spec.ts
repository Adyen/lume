import { mount } from '@vue/test-utils';
import { data, labels, xScale, yScale } from '../../mock-data';
import SingleBarChart from '@/charts/adv-single-bar-chart/adv-single-bar-chart.vue';

const numberOfBars = data[0].values.length;

describe('adv-single-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(SingleBarChart, {
      propsData: { data, labels, xScale, yScale }
    });

    const el = wrapper.find('[data-j-single-bar-chart]')
    const props = wrapper.vm.$props;
    expect(el.exists()).toBeTruthy();
    expect(props).toHaveProperty('data');
    expect(props.data).toEqual(data);
    expect(props).toHaveProperty('labels');
    expect(props.labels).toEqual(labels);
    expect(props).toHaveProperty('xScale');
    expect(props.xScale).toEqual(xScale);
    expect(props).toHaveProperty('yScale');
    expect(props.yScale).toEqual(yScale);

    expect(props).toHaveProperty('options');
    expect(props.options).toEqual({});
    expect(props).toHaveProperty('orientation');
    expect(props.orientation).toEqual('vertical');
    expect(props).toHaveProperty('title');
    expect(props.title).toEqual(null);

    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
  });
});
