import { computed, PropType } from '@vue/composition-api';

const CONFIGS = ['margins'];

interface Configs {
  [key: string]: unknown;
}

export const withConfig = () => ({
  config: {
    type: Object as PropType<Configs>,
    default: () => ({}),
    validator: (value: Record<string, unknown>) =>
      Object.keys(value).every((key) => CONFIGS.includes(key)),
  },
});

export function useConfig(config: Configs, defaultConfig: Configs) {
  const computedConfig = computed<Configs>(() => ({
    ...defaultConfig,
    ...config,
  }));

  return { computedConfig };
}
