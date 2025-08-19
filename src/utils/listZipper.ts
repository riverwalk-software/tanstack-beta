import { Stack } from "immutable";

const ListZipperBrand = Symbol("ListZipper");
export type ListZipper<T> = {
  // biome-ignore lint/suspicious/noConfusingVoidType: Branded type
  readonly [ListZipperBrand]: void;
  readonly left: Stack<T>;
  readonly focus: T;
  readonly right: Stack<T>;
};

export const fromArray = <T>(head: T, tail: readonly T[]): ListZipper<T> => ({
  [ListZipperBrand]: undefined,
  left: Stack<T>(),
  focus: head,
  right: [...tail].reduceRight((acc, value) => acc.push(value), Stack<T>()),
});

export const fromArrayAt = <T>(
  array: readonly T[],
  index: number,
): ListZipper<T> | undefined => {
  if (index < 0 || index >= array.length) return undefined;
  const focus = array[index];
  const left = Stack.of<T>(...array.slice(0, index).reverse());
  const right = Stack.of<T>(...array.slice(index + 1));
  return { [ListZipperBrand]: undefined, left, focus, right };
};

export const toArray = <T>({ left, focus, right }: ListZipper<T>): T[] => {
  return [...left.reverse(), focus, ...right];
};

export const moveLeft = <T>(
  listzipper: ListZipper<T>,
): ListZipper<T> | undefined => {
  const focus = listzipper.left.peek();
  if (focus === undefined) return undefined;
  return {
    [ListZipperBrand]: undefined,
    left: listzipper.left.pop(),
    focus,
    right: listzipper.right.push(listzipper.focus),
  };
};

export const moveRight = <T>(
  listzipper: ListZipper<T>,
): ListZipper<T> | undefined => {
  const focus = listzipper.right.peek();
  if (focus === undefined) return undefined;
  return {
    [ListZipperBrand]: undefined,
    left: listzipper.left.push(listzipper.focus),
    focus,
    right: listzipper.right.pop(),
  };
};

export const replace = <T>(
  value: T,
  listzipper: ListZipper<T>,
): ListZipper<T> => ({
  [ListZipperBrand]: undefined,
  left: listzipper.left,
  focus: value,
  right: listzipper.right,
});

export const visit = <T>(
  value: T,
  listzipper: ListZipper<T>,
): ListZipper<T> => ({
  [ListZipperBrand]: undefined,
  left: listzipper.left.push(listzipper.focus),
  focus: value,
  right: Stack<T>(),
});
