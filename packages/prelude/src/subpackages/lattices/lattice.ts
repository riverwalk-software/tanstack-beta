export const join =
  (p: boolean) =>
  (q: boolean): boolean =>
    p || q;
export const meet =
  (p: boolean) =>
  (q: boolean): boolean =>
    p && q;
