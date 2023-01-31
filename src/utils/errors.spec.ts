import { error } from './errors';

vi.mock('./helpers.ts', () => ({
  isProd: () => true,
}));

describe('error.ts', () => {
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should console.error with prefix', () => {
    const prefix = '[lume] Error: ';
    error('test', undefined, false);
    expect(console.error).toHaveBeenCalledWith(prefix + 'test', undefined);
  });

  it('should not console.error if in production', () => {
    error('test');
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
