import { afterEach, describe, expect, test, vi } from 'vitest';
import { useFormat } from './format';

describe('format.ts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('d3 formatter', () => {
    test('should format with d3Format', () => {
      const formatValue = useFormat('~p'); // percentage

      expect(formatValue(0.1)).toBe('10%');
    });

    test('should warn if invalid value and not format', () => {
      const spy = vi.spyOn(console, 'warn');

      const formatValue = useFormat('d293nc df'); // invalid

      expect(spy).toHaveBeenCalledTimes(1);
      expect(formatValue(0.1)).toBe(0.1);
    });
  });

  describe('custom formatter', () => {
    const customFormatter = vi.fn((v) => 'test ' + v);

    test('should use custom formatter', () => {
      const formatValue = useFormat(customFormatter);

      expect(formatValue(1)).toBe('test 1');
      expect(customFormatter).toHaveBeenCalledTimes(1);
    });
  });

  describe('invalid formatter', () => {
    test('should not format if null', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const formatValue = useFormat(null);

      expect(formatValue(1)).toBe(1);
    });

    test('should not format if undefined', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const formatValue = useFormat();

      expect(formatValue(1)).toBe(1);
    });
  });
});
