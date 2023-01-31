import { warn } from './warnings';

vi.mock('./helpers.ts', () => ({
  isProd: () => true,
}));

describe('warn.ts', () => {
  beforeEach(() => {
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should console.warn with prefix', () => {
    const prefix = '[lume] Warning: ';
    warn('test', false);
    expect(console.warn).toHaveBeenCalledWith(prefix + 'test');
  });

  it('should not console.warn if in production', () => {
    warn('test');
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});
