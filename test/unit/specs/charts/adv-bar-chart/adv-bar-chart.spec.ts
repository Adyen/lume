import { mount } from '@vue/test-utils';
import { data as singleSetData, generateData, labels, xScale, yScale } from '../../mock-data';
import BarChart from '@/charts/adv-bar-chart';

const numberOfSets = 2;
const numberOfBars = singleSetData[0].values.length;
const multiSetData = generateData(numberOfSets, singleSetData[0].values.length);

const barChartFactory = (propsData) => {
  return  mount(BarChart, {
    propsData: { 
      ...propsData
    }
  });
}

describe('bar.vue', () => {
  test('mounts component and sets prop values', async () => {
    const wrapper = await barChartFactory({ data: singleSetData, labels, xScale, yScale });
    
    expect(wrapper.find('[data-j-adv-bar-chart]')).toBeTruthy();
  });

  test('should display single bar chart', async () => {
    const wrapper = await barChartFactory({ data: singleSetData, labels, xScale, yScale });

    const el = wrapper.find('[data-j-single-bar-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
  });

  test.skip('should display grouped bar chart', async () => {
    const type = 'grouped';

    const wrapper = await barChartFactory({ data: multiSetData, type, labels, xScale, yScale });
    
    const el = wrapper.find('[data-j-grouped-bar-chart]');
    
    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test.skip('should display stacked bar chart', async () => {
    const type = 'stacked';

    const wrapper = await barChartFactory({ data: multiSetData, type, labels, xScale, yScale });
    
    const el = wrapper.find('[data-j-stacked-bar-chart]');
    
    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('should throw an error when type is not applied for multiset', async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => null);

    try {
      await barChartFactory({ data: multiSetData, labels, xScale, yScale });
      expect(error).toHaveBeenCalled();
    }
    catch(err) {
      expect(err).toEqual(new Error("Bar chart needs a type when there's multiple datasets."));
    }
  });
});
