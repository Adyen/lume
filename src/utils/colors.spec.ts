import { computeColor } from './colors';

describe('colors.ts', () => {
  describe('computeColor', () => {
    it('should use dataset color when provided', () => {
      expect(computeColor('violet', 'skyblue', null, 2)).toBe('violet');
    });

    it('should use dataset color when provided (other colors)', () => {
      expect(computeColor('orange', 'skyblue', null, 0)).toBe('orange');
    });

    it('should use chart color based on default palette', () => {
      expect(computeColor(null, 'skyblue', null, 0)).toBe('skyblue');
      expect(computeColor(null, 'skyblue', null, 1)).toBe('royalblue'); // should be next color (index = 1)
      expect(computeColor(null, 'skyblue', null, 2)).toBe('violet'); // should be next color (index = 2)
    });

    it('should use chart color based on sequential palette', () => {
      expect(computeColor(null, 'violet', 'sequential', 0)).toBe('violet-50');
      expect(computeColor(null, 'violet', 'sequential', 1)).toBe('violet-60');
      expect(computeColor(null, 'gold', 'sequential', 2)).toBe('gold-70');
    });

    it('should use chart color based on divergent palette', () => {
      expect(computeColor(null, 'skyblue-darkteal', 'divergent', 0)).toBe(
        'skyblue-darkteal-10'
      );
      expect(computeColor(null, 'skyblue-darkteal', 'divergent', 1)).toBe(
        'skyblue-darkteal-20'
      );
      expect(computeColor(null, 'violet-royalblue', 'divergent', 2)).toBe(
        'violet-royalblue-30'
      );
    });

    // Error cases

    it('should default to categorical palette color', () => {
      expect(computeColor('invalid', null, null, 0)).toBe('skyblue');
      expect(computeColor('invalid', null, null, 1)).toBe('royalblue'); // should be next color (index = 1)
      expect(computeColor('invalid', null, null, 2)).toBe('violet'); // should be next color (index = 1)
    });

    it('should default to sequential palette color', () => {
      expect(computeColor('invalid', null, 'sequential', 0)).toBe('skyblue-50');
      expect(computeColor(null, null, 'sequential', 1)).toBe('skyblue-60'); // should be next color (index = 1)
      expect(computeColor(undefined, null, 'sequential', 2)).toBe('skyblue-70'); // should be next color (index = 1)
    });

    it('should warn about color loop if index > 4', () => {
      console.warn = vi.fn();

      computeColor(null, 'skyblue', null, 5);
      expect(console.warn).toHaveBeenCalledTimes(1);

      console.warn.mockRestore();
    });
  });
});
