import { sankeyJustify } from 'd3-sankey';

import { AlluvialDiagramOptions } from '@/composables/options';

export const options: AlluvialDiagramOptions = {
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  withAxes: false,
  withTooltip: false,
  withHover: false,
  withLegend: false,

  // Alluvial options
  gradient: false,
  highlightedElements: 'full',
  nodePadding: 16,
  nodeWidth: 16,
  nodeAlign: sankeyJustify,
  valueFormat: (value: number) => String(value),
};
