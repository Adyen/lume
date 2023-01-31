import { svgCheck } from './svg-check';

describe('svg-check.ts', () => {
  beforeEach(() => {
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should do nothing if element is child of SVG container', () => {
    const svgContainer = document.createElement('svg');
    const element = document.createElement('rect');
    svgContainer.appendChild(element);

    svgCheck(element);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('should do nothing if element is nested child of SVG container', () => {
    const svgContainer = document.createElement('svg');
    const layer1 = document.createElement('g');
    const layer2 = document.createElement('g');
    const element = document.createElement('rect');

    layer2.appendChild(element);
    layer1.appendChild(layer2);
    svgContainer.appendChild(layer1);

    svgCheck(element);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('should warn if element is not child of SVG container', () => {
    const svgContainer = document.createElement('div');
    const element = document.createElement('rect');
    svgContainer.appendChild(element);

    svgCheck(element);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });
});
