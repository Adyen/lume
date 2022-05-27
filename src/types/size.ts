export interface ContainerSize {
  width: number;
  height: number;
  outerWidth?: number;
  outerHeight?: number;
}

export type Scale = {
  (index: number): number;
  bandwidth?: () => number;
  domain?: () => Array<number>;
};
