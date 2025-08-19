import { Stack } from "immutable";

const ZipperBrand = Symbol("Zipper");
export type Zipper<T> = {
  // biome-ignore lint/suspicious/noConfusingVoidType: Branded type
  readonly [ZipperBrand]: void;
  readonly left: Stack<T>;
  readonly focus: T;
  readonly right: Stack<T>;
};

export const fromArray = <T>(head: T, tail: readonly T[]): Zipper<T> => ({
  [ZipperBrand]: undefined,
  left: Stack<T>(),
  focus: head,
  right: [...tail].reduceRight((acc, value) => acc.push(value), Stack<T>()),
});

export const fromArrayAt = <T>(
  array: readonly T[],
  index: number,
): Zipper<T> | undefined => {
  if (index < 0 || index >= array.length) return undefined;
  const focus = array[index];
  const left = Stack.of<T>(...array.slice(0, index).reverse());
  const right = Stack.of<T>(...array.slice(index + 1));
  return { [ZipperBrand]: undefined, left, focus, right };
};

export const toArray = <T>({ left, focus, right }: Zipper<T>): T[] => {
  return [...left.reverse(), focus, ...right];
};

export const moveLeft = <T>(zipper: Zipper<T>): Zipper<T> => {
  const focus = zipper.left.peek();
  if (focus === undefined) return zipper;
  return {
    [ZipperBrand]: undefined,
    left: zipper.left.pop(),
    focus,
    right: zipper.right.push(zipper.focus),
  };
};

export const moveRight = <T>(zipper: Zipper<T>): Zipper<T> => {
  const focus = zipper.right.peek();
  if (focus === undefined) return zipper;
  return {
    [ZipperBrand]: undefined,
    left: zipper.left.push(zipper.focus),
    focus,
    right: zipper.right.pop(),
  };
};

export const replace = <T>(value: T, zipper: Zipper<T>): Zipper<T> => ({
  [ZipperBrand]: undefined,
  left: zipper.left,
  focus: value,
  right: zipper.right,
});

export const visit = <T>(value: T, zipper: Zipper<T>): Zipper<T> => ({
  [ZipperBrand]: undefined,
  left: zipper.left.push(zipper.focus),
  focus: value,
  right: Stack<T>(),
});
